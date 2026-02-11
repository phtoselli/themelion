import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import matter from "gray-matter";
import type { Plugin } from "vite";
import { parse as parseYaml } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIRTUAL_MODULE_ID = "virtual:content";
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

interface TopicSummary {
	slug: string;
	title: string;
	difficulty: string;
	order: number;
	status?: string;
	prerequisites: string[];
	tags: string[];
}

interface Category {
	slug: string;
	name: string;
	order: number;
	topics: TopicSummary[];
}

interface Room {
	slug: string;
	name: string;
	description: string;
	icon: string;
	order: number;
	categories: Category[];
}

interface TopicExample {
	languageId: string;
	filePath: string;
	code: string;
}

interface Topic {
	title: string;
	slug: string;
	room: string;
	category: string;
	difficulty: string;
	order: number;
	prerequisites: string[];
	tags: string[];
	relatedTools?: { name: string; searchTerm: string; url: string }[];
	status: string;
	contentPath: string;
	content: string;
	examples: TopicExample[];
}

interface Language {
	id: string;
	name: string;
	ext: string;
	monacoLanguage: string;
	label: string;
	icon: string;
}

interface Roadmap {
	slug: string;
	name: string;
	description: string;
	icon: string;
	stages: { slug: string; name: string; description: string; order: number; topics: string[] }[];
}

function scanContent(rootDir: string) {
	const rooms: Room[] = [];
	const topics = new Map<string, Topic>();
	const languages = new Map<string, Language>();
	const roadmaps = new Map<string, Roadmap>();

	// 1. Escanear linguagens
	const langFiles = globSync("data/languages/*.json", { cwd: rootDir });
	for (const file of langFiles) {
		const content = readFileSync(resolve(rootDir, file), "utf-8");
		const lang = JSON.parse(content);
		// Remover campo runner (backend-only)
		const { runner, ...langData } = lang;
		languages.set(langData.id, langData as Language);
	}

	// 2. Escanear registry (rooms)
	const roomFiles = globSync("data/registry/rooms/*.yaml", { cwd: rootDir });
	for (const file of roomFiles) {
		const content = readFileSync(resolve(rootDir, file), "utf-8");
		const data = parseYaml(content);
		rooms.push({
			slug: data.room,
			name: data.name,
			description: data.description,
			icon: data.icon,
			order: data.order,
			categories: data.categories.map((cat: Category) => ({
				...cat,
				topics: cat.topics.map((t: TopicSummary) => ({
					...t,
					status: "planned",
				})),
			})),
		});
	}
	rooms.sort((a, b) => a.order - b.order);

	// 3. Escanear roadmaps
	const roadmapFiles = globSync("data/registry/roadmaps/*.yaml", { cwd: rootDir });
	for (const file of roadmapFiles) {
		const content = readFileSync(resolve(rootDir, file), "utf-8");
		const data = parseYaml(content);
		roadmaps.set(data.roadmap, {
			slug: data.roadmap,
			name: data.name,
			description: data.description,
			icon: data.icon,
			stages: data.stages,
		});
	}

	// 4. Escanear conteúdo MDX
	const mdxFiles = globSync("data/content/**/topic.mdx", { cwd: rootDir });
	for (const file of mdxFiles) {
		const fullPath = resolve(rootDir, file);
		const raw = readFileSync(fullPath, "utf-8");
		const { data, content: mdxBody } = matter(raw);

		const frontmatter = data as Topic;
		const exampleDir = file.replace("topic.mdx", "examples");
		const exampleGlob = `${exampleDir}/*`;
		const exampleFiles = globSync(exampleGlob, { cwd: rootDir });

		const examples: TopicExample[] = exampleFiles.map((exFile) => {
			const ext = exFile.split(".").pop() || "";
			const langEntry = Array.from(languages.values()).find((l) => l.ext === `.${ext}`);
			return {
				languageId: langEntry?.id || ext,
				filePath: exFile,
				code: readFileSync(resolve(rootDir, exFile), "utf-8"),
			};
		});

		topics.set(frontmatter.slug, {
			...frontmatter,
			status: "implemented",
			contentPath: file,
			content: mdxBody.trim(),
			examples,
		});
	}

	// 5. Reconciliar status
	for (const room of rooms) {
		for (const category of room.categories) {
			for (const topic of category.topics) {
				const implemented = topics.get(topic.slug);
				if (implemented) {
					topic.status = "implemented";
				}
			}
		}
	}

	return {
		rooms,
		topics: Array.from(topics.values()),
		languages: Array.from(languages.values()),
		roadmaps: Array.from(roadmaps.values()).sort((a, b) => a.name.localeCompare(b.name)),
	};
}

export function contentPlugin(): Plugin {
	const rootDir = resolve(__dirname, "..");
	const watchDirs = ["data/content", "data/registry", "data/languages"].map((d) =>
		resolve(rootDir, d),
	);

	return {
		name: "vite-plugin-content",

		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) {
				return RESOLVED_VIRTUAL_MODULE_ID;
			}
		},

		load(id) {
			if (id === RESOLVED_VIRTUAL_MODULE_ID) {
				const data = scanContent(rootDir);

				return `
const _rooms = ${JSON.stringify(data.rooms)};
const _topics = ${JSON.stringify(data.topics)};
const _languages = ${JSON.stringify(data.languages)};
const _roadmaps = ${JSON.stringify(data.roadmaps)};

export const rooms = _rooms;
export const topics = _topics;
export const languages = _languages;
export const roadmaps = _roadmaps;

export function getRoomBySlug(slug) {
	return _rooms.find((r) => r.slug === slug) || null;
}

export function getTopicBySlug(slug) {
	return _topics.find((t) => t.slug === slug) || null;
}

export function getRoadmapBySlug(slug) {
	return _roadmaps.find((r) => r.slug === slug) || null;
}
`;
			}
		},

		configureServer(server) {
			// HMR: observar mudanças em content/, registry/, languages/
			for (const dir of watchDirs) {
				if (existsSync(dir)) {
					server.watcher.add(dir);
				}
			}

			server.watcher.on("change", (filePath) => {
				const rel = relative(rootDir, filePath);
				if (
					rel.startsWith("data/content/") ||
					rel.startsWith("data/registry/") ||
					rel.startsWith("data/languages/")
				) {
					const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
					if (mod) {
						server.moduleGraph.invalidateModule(mod);
						server.ws.send({ type: "full-reload" });
					}
				}
			});
		},
	};
}
