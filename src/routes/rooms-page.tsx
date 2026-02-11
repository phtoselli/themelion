import { useLocale } from "@client/hooks/use-locale";
import { useRooms } from "@client/hooks/use-rooms";
import { clearActiveRoadmap } from "@client/lib/active-roadmap";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { PageSkeleton } from "@client/modules/layout/components/skeletons";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router";

export const RoomsPage = () => {
	const { t } = useLocale();
	const { rooms, loading } = useRooms();

	useEffect(() => {
		clearActiveRoadmap();
	}, []);


	// Memoizar total de tópicos para evitar recalcular em cada render
	const totalTopics = useMemo(
		() => rooms.reduce(
			(sum, room) => sum + room.categories.reduce((catSum, cat) => catSum + cat.topics.length, 0),
			0,
		),
		[rooms],
	);

	// Memoizar ordenação para evitar sort em cada render
	const sortedRooms = useMemo(
		() => [...rooms].sort((a, b) => a.name.localeCompare(b.name)),
		[rooms],
	);

	if (loading) {
		return (
			<PageLayout breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.studyRooms }]}>
				<PageSkeleton />
			</PageLayout>
		);
	}

	return (
		<PageLayout breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.studyRooms }]}>
			{/* Header */}
			<div className="relative mb-8 md:mb-12 animate-fade-in-up">
				<div className="hidden md:block absolute -top-24 -left-24 w-[400px] h-[350px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />

				<div className="relative">
					<h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 md:mb-4">
						{t.roomsPage.title}
					</h1>
					<p className="text-text-muted text-sm md:text-base max-w-2xl leading-relaxed">
						{t.roomsPage.description}
					</p>

					<div className="flex items-center gap-6 md:gap-8 mt-6 md:mt-8">
						<div className="flex flex-col gap-1">
							<span className="font-display text-xl md:text-2xl font-bold text-text tabular-nums">
								{rooms.length}
							</span>
							<span className="text-[10px] md:text-[11px] text-text-faint uppercase tracking-[0.15em] font-medium">
								{t.common.rooms}
							</span>
						</div>
						<div className="w-px h-8 md:h-10 bg-border" />
						<div className="flex flex-col gap-1">
							<span className="font-display text-xl md:text-2xl font-bold text-text tabular-nums">
								{totalTopics}
							</span>
							<span className="text-[10px] md:text-[11px] text-text-faint uppercase tracking-[0.15em] font-medium">
								{t.common.topics}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Grid de salas */}
			<div className="space-y-4 md:space-y-6">
				{sortedRooms
					.map((room, index) => {
						const Icon = getRoomIcon(room.icon);
						const topicCount = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

						return (
							<Link
								key={room.slug}
								to={`/room/${room.slug}`}
								className={`group room-card card-glow flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-xl bg-surface-raised/80 border border-border hover:bg-surface-light/80 active:bg-surface-light/80 animate-fade-in-up stagger-${Math.min(index + 1, 10)}`}
							>
								<div className="relative p-2.5 md:p-3 rounded-xl bg-primary/8 shrink-0">
									<Icon size={20} className="text-primary relative z-10" />
									<div className="absolute inset-0 bg-primary/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1.5">
										<h3 className="font-display font-bold text-sm md:text-base text-text">
											{room.name}
										</h3>
										<span className="text-[11px] text-text-faint font-medium tabular-nums">
											{room.categories.length} {t.common.categories} · {topicCount}{" "}
											{t.common.topics.toLowerCase()}
										</span>
									</div>
									<p className="text-xs md:text-sm text-text-muted leading-relaxed mb-3 line-clamp-2 md:line-clamp-none">
										{room.description}
									</p>

									{/* Categorias preview */}
									<div className="flex flex-wrap gap-1.5 md:gap-2">
										{room.categories
											.sort((a, b) => a.order - b.order)
											.slice(0, 4)
											.map((cat) => (
												<span
													key={cat.slug}
													className="text-[10px] md:text-[11px] text-text-faint bg-surface/80 border border-border/50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md"
												>
													{cat.name}
												</span>
											))}
										{room.categories.length > 4 && (
											<span className="text-[10px] md:text-[11px] text-text-faint px-2 md:px-2.5 py-0.5 md:py-1">
												+{room.categories.length - 4}
											</span>
										)}
									</div>
								</div>

								<ArrowRight
									size={16}
									className="text-text-faint group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1"
								/>
							</Link>
						);
					})}
			</div>
		</PageLayout>
	);
};
