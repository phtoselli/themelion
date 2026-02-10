import { getRoomBySlug } from "virtual:content";
import { useNavigation } from "@client/contexts/navigation-context";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { DifficultyBadge } from "@client/modules/study/components/difficulty-badge";
import { StatusBadge } from "@client/modules/study/components/status-badge";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

export const RoomPage = () => {
	const { roomSlug } = useParams();
	const { setCurrentRoom } = useNavigation();
	const room = getRoomBySlug(roomSlug ?? "");

	useEffect(() => {
		if (room) {
			setCurrentRoom(room);
		}
	}, [room, setCurrentRoom]);

	if (!room) {
		return (
			<PageLayout>
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-text-muted">Sala não encontrada</p>
				</div>
			</PageLayout>
		);
	}

	const Icon = getRoomIcon(room.icon);
	const totalTopics = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

	return (
		<PageLayout room={room} breadcrumbs={[{ label: "Home", href: "/" }, { label: room.name }]}>
			{/* Header da sala */}
			<div className="relative mb-10 animate-fade-in-up">
				{/* Background glow */}
				<div className="absolute -top-20 -left-20 w-[400px] h-[300px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none" />

				<div className="relative flex items-start gap-4 mb-4">
					<div className="relative p-3 rounded-xl bg-primary/8 shrink-0">
						<Icon size={24} className="text-primary relative z-10" />
						<div className="absolute inset-0 bg-primary/5 rounded-xl blur-sm" />
					</div>
					<div>
						<h1 className="font-display text-2xl font-bold tracking-tight">{room.name}</h1>
						<div className="flex items-center gap-2 mt-1.5">
							<span className="text-xs text-text-faint font-medium">
								{room.categories.length} categorias
							</span>
							<span className="w-1 h-1 rounded-full bg-text-faint/40" />
							<span className="text-xs text-text-faint font-medium">{totalTopics} tópicos</span>
						</div>
					</div>
				</div>
				<p className="text-text-muted text-sm leading-relaxed max-w-2xl">{room.description}</p>
			</div>

			{/* Categorias */}
			<div className="space-y-10">
				{room.categories
					.sort((a, b) => a.order - b.order)
					.map((category, catIndex) => {
						const implementedCount = category.topics.filter(
							(t) => t.status === "implemented",
						).length;

						return (
							<section
								key={category.slug}
								className={`animate-fade-in-up stagger-${Math.min(catIndex + 1, 10)}`}
							>
								<div className="flex items-baseline gap-3 mb-4">
									<h2 className="font-display text-base font-bold tracking-tight">
										{category.name}
									</h2>
									<span className="text-[11px] text-text-faint tabular-nums font-medium">
										{implementedCount}/{category.topics.length}
									</span>
									<div className="flex-1 h-px bg-border ml-2" />
								</div>

								<div className="grid gap-2">
									{category.topics
										.sort((a, b) => a.order - b.order)
										.map((topic) => {
											const isPlanned = topic.status !== "implemented";

											const cardContent = (
												<>
													<span
														className={`font-medium text-sm flex-1 ${isPlanned ? "text-text-faint" : "text-text"}`}
													>
														{topic.title}
													</span>
													<DifficultyBadge difficulty={topic.difficulty} />
													{isPlanned && <StatusBadge status="planned" />}
												</>
											);

											const cardClassName = `topic-card flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
												isPlanned
													? "border-border/50 bg-surface-raised/30 opacity-60 cursor-not-allowed"
													: "border-border bg-surface-raised/60 hover:bg-surface-light/80 card-glow"
											}`;

											return isPlanned ? (
												<div key={topic.slug} className={cardClassName}>
													{cardContent}
												</div>
											) : (
												<Link
													key={topic.slug}
													to={`/topic/${topic.slug}`}
													className={cardClassName}
												>
													{cardContent}
												</Link>
											);
										})}
								</div>
							</section>
						);
					})}
			</div>
		</PageLayout>
	);
};
