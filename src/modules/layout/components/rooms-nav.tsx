import { CollapsibleSection } from "@client/modules/layout/components/collapsible-section";
import { SidebarSkeleton } from "@client/modules/layout/components/skeletons";
import { difficultyDotStyles } from "@client/shared/constants/difficulty";
import type { Room } from "@client/shared/types";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import "@client/styles/modules/rooms-nav.css";
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
		<div className="rooms-nav">
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
								className="rooms-nav-room"
								data-active={isRoomActive}
							>
								<Icon size={13} />
								<span className="truncate">{r.name}</span>
							</Link>

							{isRoomActive && (
								<div className="rooms-nav-categories">
									{r.categories
										.sort((a, b) => a.order - b.order)
										.map((category) => (
											<CollapsibleSection
												key={category.slug}
												title={category.name}
												count={category.topics.length}
												defaultOpen={category.topics.some((t) => t.slug === activeTopicSlug)}
											>
												<div className="rooms-nav-topics">
													{category.topics
														.sort((a, b) => a.order - b.order)
														.map((topic) => {
															const isActive = topic.slug === activeTopicSlug;
															const isPlanned = topic.status !== "implemented";

															const itemContent = (
																<>
																	<Circle
																		size={4}
																		className={difficultyDotStyles[topic.difficulty]}
																		style={{ fill: "currentColor" }}
																	/>
																	<span className="truncate">{topic.title}</span>
																</>
															);

															return isPlanned ? (
																<div
																	key={topic.slug}
																	className="rooms-nav-topic"
																	data-active={false}
																	data-planned={true}
																>
																	{itemContent}
																</div>
															) : (
																<Link
																	key={topic.slug}
																	ref={isActive ? activeRef : undefined}
																	to={`/topic/${topic.slug}`}
																	onClick={() => onNavigate?.()}
																	className="rooms-nav-topic"
																	data-active={isActive}
																	data-planned={false}
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
