const STORAGE_KEY = "themelion:progress";

interface TopicProgress {
	completed: boolean;
	completedAt: string | null;
	lastVisitedAt: string;
}

type ProgressMap = Record<string, TopicProgress>;

const getProgressMap = (): ProgressMap => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const saveProgressMap = (map: ProgressMap): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

export const markTopicVisited = (slug: string): void => {
	const map = getProgressMap();
	map[slug] = {
		...map[slug],
		completed: map[slug]?.completed ?? false,
		completedAt: map[slug]?.completedAt ?? null,
		lastVisitedAt: new Date().toISOString(),
	};
	saveProgressMap(map);
};

export const markTopicCompleted = (slug: string): void => {
	const map = getProgressMap();
	map[slug] = {
		...map[slug],
		completed: true,
		completedAt: new Date().toISOString(),
		lastVisitedAt: new Date().toISOString(),
	};
	saveProgressMap(map);
};

export const getTopicProgress = (slug: string): TopicProgress | null => {
	const map = getProgressMap();
	return map[slug] ?? null;
};

export const getAllProgress = (): ProgressMap => {
	return getProgressMap();
};

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
const MAX_SLUG_LENGTH = 100;
const MAX_ENTRIES = 10_000;

const isValidSlug = (key: string): boolean =>
	key.length <= MAX_SLUG_LENGTH && SLUG_PATTERN.test(key);

const isValidDateOrNull = (val: unknown): val is string | null =>
	val === null || (typeof val === "string" && ISO_DATE_PATTERN.test(val));

const isValidTopicProgress = (val: unknown): val is TopicProgress => {
	if (typeof val !== "object" || val === null || Array.isArray(val)) return false;
	const obj = val as Record<string, unknown>;
	return (
		typeof obj.completed === "boolean" &&
		isValidDateOrNull(obj.completedAt) &&
		typeof obj.lastVisitedAt === "string" &&
		ISO_DATE_PATTERN.test(obj.lastVisitedAt)
	);
};

/**
 * Valida e sanitiza um ProgressMap importado.
 * Rejeita keys perigosas (__proto__, constructor, prototype),
 * valida formato de slugs e estrutura de cada entry.
 */
const validateProgressMap = (data: unknown): ProgressMap => {
	if (typeof data !== "object" || data === null || Array.isArray(data)) {
		throw new Error("Formato inválido: esperado um objeto JSON.");
	}

	const raw = data as Record<string, unknown>;
	const entries = Object.keys(raw);

	if (entries.length > MAX_ENTRIES) {
		throw new Error(`Arquivo contém ${entries.length} entradas (máximo: ${MAX_ENTRIES}).`);
	}

	const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);
	const validated: ProgressMap = Object.create(null);

	for (const key of entries) {
		if (DANGEROUS_KEYS.has(key)) {
			throw new Error(`Key perigosa detectada: "${key}".`);
		}
		if (!isValidSlug(key)) {
			throw new Error(`Slug inválido: "${key}". Apenas letras minúsculas, números e hífens.`);
		}
		if (!isValidTopicProgress(raw[key])) {
			throw new Error(`Dados inválidos para o tópico "${key}".`);
		}
		validated[key] = raw[key] as TopicProgress;
	}

	return validated;
};

export const exportProgress = (): void => {
	const data = getProgressMap();
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = `themelion-progresso-${new Date().toISOString().slice(0, 10)}.json`;
	link.click();

	URL.revokeObjectURL(url);
};

export const importProgress = (file: File): Promise<{ imported: number }> => {
	return new Promise((resolve, reject) => {
		if (file.size > MAX_FILE_SIZE) {
			reject(new Error(`Arquivo muito grande (${(file.size / 1024).toFixed(0)}KB). Máximo: 1MB.`));
			return;
		}

		if (file.type && file.type !== "application/json") {
			reject(new Error("Tipo de arquivo inválido. Envie um arquivo .json."));
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			try {
				const text = reader.result as string;
				const parsed: unknown = JSON.parse(text);
				const validated = validateProgressMap(parsed);
				const count = Object.keys(validated).length;

				saveProgressMap(validated);
				resolve({ imported: count });
			} catch (err) {
				reject(err instanceof Error ? err : new Error("Erro ao processar o arquivo."));
			}
		};

		reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
		reader.readAsText(file);
	});
};
