// === Dificuldade ===
export type Difficulty = "beginner" | "intermediate" | "advanced";

// === Status de implementação ===
export type TopicStatus = "implemented" | "planned" | "unregistered";

// === Linguagem de programação ===
export interface Language {
	id: string;
	name: string;
	ext: string;
	monacoLanguage: string;
	label: string;
	icon: string;
}

// === Tópico (conteúdo) ===
export interface TopicFrontmatter {
	title: string;
	slug: string;
	room: string;
	category: string;
	difficulty: Difficulty;
	order: number;
	prerequisites: string[];
	tags: string[];
	relatedTools?: RelatedTool[];
}

export interface RelatedTool {
	name: string;
	searchTerm: string;
	url: string;
}

export interface Topic extends TopicFrontmatter {
	status: TopicStatus;
	contentPath: string;
	content: string;
	examples: TopicExample[];
}

export interface TopicExample {
	languageId: string;
	filePath: string;
	code: string;
}

// === Sala de estudo (room) ===
export interface Room {
	slug: string;
	name: string;
	description: string;
	icon: string;
	order: number;
	categories: Category[];
}

// === Categoria ===
export interface Category {
	slug: string;
	name: string;
	order: number;
	topics: TopicSummary[];
}

// === Resumo de tópico (sem conteúdo completo) ===
export interface TopicSummary {
	slug: string;
	title: string;
	difficulty: Difficulty;
	order: number;
	status?: TopicStatus;
	prerequisites: string[];
	tags: string[];
}

// === Roadmap (trilha de carreira) ===
export interface Roadmap {
	slug: string;
	name: string;
	description: string;
	icon: string;
	stages: Stage[];
}

export interface Stage {
	slug: string;
	name: string;
	description: string;
	order: number;
	topics: string[];
}

// === Estado de UI ===
export interface UIState {
	sidebarOpen: boolean;
	selectedLanguage: string;
	theme: "dark" | "light";
}
