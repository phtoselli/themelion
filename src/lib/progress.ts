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
