import type { Locale } from "@client/i18n";
import type { Difficulty } from "@client/shared/types";

export const getDifficultyLabels = (t: Locale): Record<Difficulty, string> => ({
	beginner: t.difficulty.beginner,
	intermediate: t.difficulty.intermediate,
	advanced: t.difficulty.advanced,
});

export const difficultyStyles: Record<Difficulty, string> = {
	beginner: "bg-beginner/12 text-beginner",
	intermediate: "bg-intermediate/12 text-intermediate",
	advanced: "bg-advanced/12 text-advanced",
};

export const difficultyDotStyles: Record<Difficulty, string> = {
	beginner: "text-beginner",
	intermediate: "text-intermediate",
	advanced: "text-advanced",
};
