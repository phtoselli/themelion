import { useLocale } from "@client/hooks/use-locale";
import { Badge } from "@client/shared/components/ui/badge";
import { difficultyStyles, getDifficultyLabels } from "@client/shared/constants/difficulty";
import type { Difficulty } from "@client/shared/types";

export const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
	const { t } = useLocale();
	const difficultyLabels = getDifficultyLabels(t);

	return (
		<Badge
			variant="outline"
			className={`border-0 rounded-md text-[10px] ${difficultyStyles[difficulty]}`}
		>
			{difficultyLabels[difficulty]}
		</Badge>
	);
};
