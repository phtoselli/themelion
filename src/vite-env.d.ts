/// <reference types="vite/client" />

declare module "virtual:content" {
	import type { Room, Topic, Language, Roadmap } from "@client/shared/types";

	export const rooms: Room[];
	export const topics: Topic[];
	export const languages: Language[];
	export const roadmaps: Roadmap[];

	export function getRoomBySlug(slug: string): Room | null;
	export function getTopicBySlug(slug: string): Topic | null;
	export function getRoadmapBySlug(slug: string): Roadmap | null;
}
