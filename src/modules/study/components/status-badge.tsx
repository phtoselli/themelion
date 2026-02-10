import { Badge } from "@client/shared/components/ui/badge";
import { statusLabels, statusStyles } from "@client/shared/constants/status";
import type { TopicStatus } from "@client/shared/types";

export const StatusBadge = ({ status }: { status: TopicStatus }) => {
	return (
		<Badge variant="outline" className={`border-0 rounded-md text-[10px] ${statusStyles[status]}`}>
			{statusLabels[status]}
		</Badge>
	);
};
