import type { Locale } from "@client/i18n";
import type { TopicStatus } from "@client/shared/types";

export const getStatusLabels = (t: Locale): Record<TopicStatus, string> => ({
	implemented: t.status.implemented,
	planned: t.status.planned,
	unregistered: t.status.unregistered,
});

export const statusStyles: Record<TopicStatus, string> = {
	implemented: "bg-accent/15 text-accent",
	planned: "bg-muted text-muted-foreground",
	unregistered: "bg-warning/15 text-warning",
};
