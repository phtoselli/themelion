import { CollapsibleSection } from "@client/modules/layout/components/collapsible-section";
import { SidebarSkeleton } from "@client/modules/layout/components/skeletons";
import { difficultyDotStyles } from "@client/shared/constants/difficulty";
import type { Room } from "@client/shared/types";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { Circle } from "lucide-react";
import type { RefObject } from "react";
import { Link } from "react-router";

interface RoomsNavProps {
	rooms: Room[];
	loading: boolean;
	displayRoom: Room | null;
	activeTopicSlug?: string;
	activeRef: RefObject<HTMLAnchorElement | null>;
	onRoomSelect: (room: Room) => void;
	onNavigate?: () => void;
}

export const RoomsNav = ({
	rooms,
	loading,
	displayRoom,
	activeTopicSlug,
	activeRef,
	onRoomSelect,
	onNavigate,
}: RoomsNavProps) => {
	if (loading) return <SidebarSkeleton />;

	return (
		<div className="space-y-0.5 pl-2">
			{rooms
				.sort((a, b) => a.order - b.order)
				.map((r) => {
					const Icon = getRoomIcon(r.icon);
					const isRoomActive = r.slug === displayRoom?.slug;

					return (
						<div key={r.slug}>
							<Link
								to={`/room/${r.slug}`}
								onClick={() => {
									onRoomSelect(r);
									onNavigate?.();
								}}
								className={`flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-md transition-all duration-200 ${
									isRoomActive
										? "text-primary font-medium bg-primary/5"
										: "text-text-muted hover:text-text hover:bg-surface-hover"
								}`}
							>
								<Icon size={13} className="shrink-0 opacity-70" />
								<span className="truncate">{r.name}</span>
							</Link>

							{isRoomActive && (
								<div className="ml-4 mt-1 space-y-0.5 animate-fade-in">
									{r.categories
										.sort((a, b) => a.order - b.order)
										.map((category) => (
											<CollapsibleSection
												key={category.slug}
												title={category.name}
												count={category.topics.length}
												defaultOpen={category.topics.some((t) => t.slug === activeTopicSlug)}
											>
												<div className="space-y-px py-0.5">
													{category.topics
														.sort((a, b) => a.order - b.order)
														.map((topic) => {
															const isActive = topic.slug === activeTopicSlug;
															const isPlanned = topic.status !== "implemented";

															const itemContent = (
																<>
																	<Circle
																		size={4}
																		className={`shrink-0 fill-current ${difficultyDotStyles[topic.difficulty]}`}
																	/>
																	<span className="truncate">{topic.title}</span>
																</>
															);

															const itemClassName = `flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all duration-200 ${
																isActive
																	? "bg-primary/10 text-primary font-medium"
																	: isPlanned
																		? "text-text-faint/70 cursor-not-allowed"
																		: "text-text-muted hover:text-text hover:bg-surface-hover"
															}`;

															return isPlanned ? (
																<div key={topic.slug} className={itemClassName}>
																	{itemContent}
																</div>
															) : (
																<Link
																	key={topic.slug}
																	ref={isActive ? activeRef : undefined}
																	to={`/topic/${topic.slug}`}
																	onClick={() => onNavigate?.()}
																	className={itemClassName}
																>
																	{itemContent}
																</Link>
															);
														})}
												</div>
											</CollapsibleSection>
										))}
								</div>
							)}
						</div>
					);
				})}
		</div>
	);
};
