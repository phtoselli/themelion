import type { Room } from "@client/shared/types";
import { useMemo } from "react";

/**
 * Hook que constrói um Map de slugs para títulos de tópicos de forma memoizada.
 * Evita reconstruir o Map a cada render (O(n³) → O(1) em re-renders).
 *
 * @param rooms - Array de salas do virtual:content
 * @returns Map<slug, title> para lookup rápido de títulos por slug
 */
export const useTopicTitles = (rooms: Room[]): Map<string, string> => {
	return useMemo(() => {
		const map = new Map<string, string>();
		for (const room of rooms) {
			for (const category of room.categories) {
				for (const topic of category.topics) {
					map.set(topic.slug, topic.title);
				}
			}
		}
		return map;
	}, [rooms]);
};
