import { useLocale } from "@client/hooks/use-locale";
import { Badge } from "@client/shared/components/ui/badge";
import { difficultyStyles, getDifficultyLabels } from "@client/shared/constants/difficulty";
import type { Difficulty } from "@client/shared/types";
import "@client/styles/modules/badges.css";

export const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
	const { t } = useLocale();
	const difficultyLabels = getDifficultyLabels(t);

	return (
		<Badge variant="outline" className={`badge-difficulty ${difficultyStyles[difficulty]}`}>
			{difficultyLabels[difficulty]}
		</Badge>
	);
};
