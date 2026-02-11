import type { Locale } from "@client/i18n";
import type { Difficulty } from "@client/shared/types";

export const getDifficultyLabels = (t: Locale): Record<Difficulty, string> => ({
	beginner: t.difficulty.beginner,
	intermediate: t.difficulty.intermediate,
	advanced: t.difficulty.advanced,
});

export const difficultyStyles: Record<Difficulty, string> = {
	beginner: "difficulty-beginner",
	intermediate: "difficulty-intermediate",
	advanced: "difficulty-advanced",
};

export const difficultyDotStyles: Record<Difficulty, string> = {
	beginner: "dot-beginner",
	intermediate: "dot-intermediate",
	advanced: "dot-advanced",
};
