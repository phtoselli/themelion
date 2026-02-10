import type { ActiveSection } from "@client/contexts/navigation-context";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Home, Map as MapIcon } from "lucide-react";

export interface NavItem {
	id: ActiveSection;
	label: string;
	icon: LucideIcon;
	href: string;
}

export const navItems: NavItem[] = [
	{ id: "home", label: "Início", icon: Home, href: "/" },
	{ id: "rooms", label: "Salas de Estudo", icon: BookOpen, href: "/rooms" },
	{ id: "roadmaps", label: "Roadmaps", icon: MapIcon, href: "/roadmaps" },
];
