import type { Locale } from "@client/i18n";
import type { TopicStatus } from "@client/shared/types";

export const getStatusLabels = (t: Locale): Record<TopicStatus, string> => ({
	implemented: t.status.implemented,
	planned: t.status.planned,
	unregistered: t.status.unregistered,
});

export const statusStyles: Record<TopicStatus, string> = {
	implemented: "status-implemented",
	planned: "status-planned",
	unregistered: "status-unregistered",
};
