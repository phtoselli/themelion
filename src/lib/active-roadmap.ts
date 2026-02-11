const STORAGE_KEY = "themelion:active-roadmap";

export const getActiveRoadmap = (): string | null => {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
};

export const setActiveRoadmap = (slug: string): void => {
	try {
		localStorage.setItem(STORAGE_KEY, slug);
	} catch {
		// Silenciar erros de localStorage (modo privado, storage cheio, etc.)
	}
};

export const clearActiveRoadmap = (): void => {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// Silenciar erros de localStorage
	}
};
