import type { Room } from "@client/shared/types";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

export type ActiveSection = "home" | "rooms" | "roadmaps";

interface NavigationState {
	expanded: boolean;
	activeSection: ActiveSection;
	currentRoom: Room | null;
	roomsListOpen: boolean;
	mobileOpen: boolean;
	setExpanded: (expanded: boolean) => void;
	toggleExpanded: () => void;
	setActiveSection: (section: ActiveSection) => void;
	setCurrentRoom: (room: Room | null) => void;
	setRoomsListOpen: (open: boolean) => void;
	toggleRoomsList: () => void;
	setMobileOpen: (open: boolean) => void;
}

const NavigationContext = createContext<NavigationState | null>(null);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
	const [expanded, setExpandedState] = useState(() => {
		const stored = localStorage.getItem("dp:sidebar-expanded");
		return stored !== null ? stored === "true" : true;
	});
	const [activeSection, setActiveSection] = useState<ActiveSection>("home");
	const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
	const [roomsListOpen, setRoomsListOpen] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);

	const setExpanded = useCallback((value: boolean) => {
		setExpandedState(value);
		localStorage.setItem("dp:sidebar-expanded", String(value));
	}, []);

	const toggleExpanded = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded, setExpanded]);

	const toggleRoomsList = useCallback(() => {
		setRoomsListOpen((prev) => !prev);
	}, []);

	return (
		<NavigationContext.Provider
			value={{
				expanded,
				activeSection,
				currentRoom,
				roomsListOpen,
				mobileOpen,
				setExpanded,
				toggleExpanded,
				setActiveSection,
				setCurrentRoom,
				setRoomsListOpen,
				toggleRoomsList,
				setMobileOpen,
			}}
		>
			{children}
		</NavigationContext.Provider>
	);
};

export const useNavigation = () => {
	const context = useContext(NavigationContext);
	if (!context) {
		throw new Error("useNavigation deve ser usado dentro de NavigationProvider");
	}
	return context;
};
