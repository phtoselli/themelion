import { useLocale } from "@client/hooks/use-locale";
import { Badge } from "@client/shared/components/ui/badge";
import "@client/styles/modules/badges.css";

export const AiGeneratedBadge = () => {
	const { t } = useLocale();

	return (
		<Badge variant="outline" className="badge-ai-generated">
			{t.topicPage.aiGenerated}
		</Badge>
	);
};
