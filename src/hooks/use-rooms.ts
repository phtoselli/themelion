import { rooms } from "virtual:content";
import type { Room } from "@client/shared/types";

interface UseRoomsReturn {
	rooms: Room[];
	loading: false;
	error: null;
}

export const useRooms = (): UseRoomsReturn => {
	return { rooms, loading: false, error: null };
};
