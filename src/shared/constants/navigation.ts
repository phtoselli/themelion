import type { ActiveSection } from "@client/contexts/navigation-context";
import type { Locale } from "@client/i18n";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Home, Map as MapIcon } from "lucide-react";

export interface NavItem {
	id: ActiveSection;
	label: string;
	icon: LucideIcon;
	href: string;
}

export const getNavItems = (t: Locale): NavItem[] => [
	{ id: "home", label: t.nav.home, icon: Home, href: "/home" },
	{ id: "rooms", label: t.nav.studyRooms, icon: BookOpen, href: "/modules" },
	{ id: "roadmaps", label: t.nav.roadmaps, icon: MapIcon, href: "/roadmaps" },
];
