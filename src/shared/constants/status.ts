import type { TopicStatus } from "@client/shared/types";

export const statusLabels: Record<TopicStatus, string> = {
	implemented: "Disponível",
	planned: "Em breve",
	unregistered: "Não registrado",
};

export const statusStyles: Record<TopicStatus, string> = {
	implemented: "bg-accent/15 text-accent",
	planned: "bg-muted text-muted-foreground",
	unregistered: "bg-warning/15 text-warning",
};
