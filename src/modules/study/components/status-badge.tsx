import { useLocale } from "@client/hooks/use-locale";
import { Badge } from "@client/shared/components/ui/badge";
import { getStatusLabels, statusStyles } from "@client/shared/constants/status";
import type { TopicStatus } from "@client/shared/types";

export const StatusBadge = ({ status }: { status: TopicStatus }) => {
	const { t } = useLocale();
	const statusLabels = getStatusLabels(t);

	return (
		<Badge variant="outline" className={`border-0 rounded-md text-[10px] ${statusStyles[status]}`}>
			{statusLabels[status]}
		</Badge>
	);
};
