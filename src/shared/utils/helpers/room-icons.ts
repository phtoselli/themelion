import {
	BookOpen,
	Brain,
	Cloud,
	Code,
	Database,
	type LucideIcon,
	Monitor,
	Rocket,
	Server,
	Shield,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
	brain: Brain,
	monitor: Monitor,
	server: Server,
	database: Database,
	cloud: Cloud,
	code: Code,
	rocket: Rocket,
	shield: Shield,
};

export const getRoomIcon = (iconName: string): LucideIcon => {
	return iconMap[iconName] ?? BookOpen;
};
