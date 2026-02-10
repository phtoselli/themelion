import { useNavigation } from "@client/contexts/navigation-context";
import { useRooms } from "@client/hooks/use-rooms";
import { RoomsNav } from "@client/modules/layout/components/rooms-nav";
import { navItems } from "@client/shared/constants/navigation";
import type { Room } from "@client/shared/types";
import { ChevronLeft, ChevronRight, Landmark } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";

interface AppSidebarProps {
	room?: Room | null;
	activeTopicSlug?: string;
}

export const AppSidebar = ({ room, activeTopicSlug }: AppSidebarProps) => {
	const {
		expanded,
		toggleExpanded,
		activeSection,
		setActiveSection,
		setCurrentRoom,
		roomsListOpen,
		setRoomsListOpen,
		toggleRoomsList,
	} = useNavigation();
	const { rooms, loading } = useRooms();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const activeRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		if (pathname === "/") setActiveSection("home");
		else if (
			pathname === "/rooms" ||
			pathname.startsWith("/room/") ||
			pathname.startsWith("/topic/")
		)
			setActiveSection("rooms");
		else if (pathname.startsWith("/roadmap")) setActiveSection("roadmaps");
	}, [pathname, setActiveSection]);

	useEffect(() => {
		if (activeRef.current && expanded) {
			activeRef.current.scrollIntoView({ block: "nearest" });
		}
	}, [expanded]);

	const displayRoom = room ?? null;

	const sidebarWidth = expanded
		? "w-[var(--spacing-sidebar-expanded)]"
		: "w-[var(--spacing-sidebar-collapsed)]";

	return (
		<aside
			className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} glass border-r border-sidebar-border flex flex-col transition-[width] duration-300 ease-out overflow-hidden`}
		>
			{/* Logo */}
			<div className="shrink-0 h-14 flex items-center gap-3 px-4 border-b border-sidebar-border">
				<div className="relative">
					<Landmark size={20} className="text-primary shrink-0 relative z-10" />
					<div className="absolute -inset-1 bg-primary/10 rounded-lg blur-sm" />
				</div>
				{expanded && (
					<span className="font-display font-bold text-sm text-text tracking-tight whitespace-nowrap">
						Themelion
					</span>
				)}
				<button
					type="button"
					onClick={toggleExpanded}
					className={`${expanded ? "ml-auto" : ""} flex items-center justify-center rounded-lg p-1.5 text-text-faint hover:text-text hover:bg-surface-hover transition-all duration-200`}
					title={expanded ? "Recolher menu" : "Expandir menu"}
				>
					{expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
				</button>
			</div>

			{/* Navegacao principal */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-1">
				{navItems.map((item) => {
					const isActive = activeSection === item.id;
					const Icon = item.icon;

					if (item.id === "rooms") {
						return (
							<div key={item.id}>
								<button
									type="button"
									onClick={() => {
										if (isActive && expanded) {
											toggleRoomsList();
										} else {
											setActiveSection("rooms");
											setRoomsListOpen(true);
											if (!expanded) toggleExpanded();
											navigate("/rooms");
										}
									}}
									className={`group flex items-center gap-3 w-full rounded-lg transition-all duration-200 ${
										expanded ? "px-3 py-2" : "px-0 py-2 justify-center"
									} ${
										isActive
											? "bg-primary/8 text-primary sidebar-active-indicator"
											: "text-text-muted hover:text-text hover:bg-surface-hover"
									}`}
									title={expanded ? undefined : item.label}
								>
									<Icon size={18} className="shrink-0" />
									{expanded && <span className="text-sm font-medium truncate">{item.label}</span>}
								</button>

								{expanded && isActive && roomsListOpen && (
									<div className="mt-1.5 space-y-0.5 animate-fade-in">
										<RoomsNav
											rooms={rooms}
											loading={loading}
											displayRoom={displayRoom}
											activeTopicSlug={activeTopicSlug}
											activeRef={activeRef}
											onRoomSelect={(r) => setCurrentRoom(r)}
										/>
									</div>
								)}
							</div>
						);
					}

					return (
						<Link
							key={item.id}
							to={item.href}
							onClick={() => setActiveSection(item.id)}
							className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
								expanded ? "px-3 py-2" : "px-0 py-2 justify-center"
							} ${
								isActive
									? "bg-primary/8 text-primary sidebar-active-indicator"
									: "text-text-muted hover:text-text hover:bg-surface-hover"
							}`}
							title={expanded ? undefined : item.label}
						>
							<Icon size={18} className="shrink-0" />
							{expanded && <span className="text-sm font-medium truncate">{item.label}</span>}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
};
