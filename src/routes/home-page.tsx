import { useLocale } from "@client/hooks/use-locale";
import { useRooms } from "@client/hooks/use-rooms";
import { clearActiveRoadmap } from "@client/lib/active-roadmap";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { PageSkeleton } from "@client/modules/layout/components/skeletons";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { ArrowRight, BookOpen, Code2, Layers, Map as MapIcon, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router";

export const HomePage = () => {
	const { rooms, loading } = useRooms();
	const { t } = useLocale();

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
			<PageLayout>
				<PageSkeleton />
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			<div className="relative mb-10 md:mb-16 animate-fade-in-up">
				{/* Background glows - escondido em mobile pra evitar overflow */}
				<div className="hidden md:block absolute -top-32 -left-32 w-[500px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
				<div className="hidden md:block absolute -top-16 right-0 w-[300px] h-[300px] bg-accent/[0.03] rounded-full blur-[80px] pointer-events-none" />

				<div className="relative">
					{/* Pill badge */}
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-6 md:mb-8">
						<span
							className="w-1.5 h-1.5 rounded-full bg-primary"
							style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
						/>
						<span className="text-[10px] md:text-xs text-primary font-medium tracking-widest uppercase">
							{t.homePage.badge}
						</span>
					</div>

					{/* Heading */}
					<h1 className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight mb-4 md:mb-5 max-w-3xl leading-[1.08]">
						{t.homePage.heading} <span className="text-primary">{t.homePage.headingHighlight}</span>
					</h1>

					{/* Subtitle */}
					<p className="text-text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
						Themelion (do grego <span className="italic text-text font-medium">θεμέλιον</span>,
						"alicerce" ou "fundação") — é como os templos gregos que resistem ao tempo, aprenda
						conceitos de programação que transcendem qualquer framework.
					</p>

					{/* Stats */}
					<div className="flex items-center gap-6 md:gap-10 mt-8 md:mt-10">
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
						<div className="w-px h-8 md:h-10 bg-border" />
						<div className="flex flex-col gap-1">
							<span className="font-display text-xl md:text-2xl font-bold text-text tabular-nums">
								5
							</span>
							<span className="text-[10px] md:text-[11px] text-text-faint uppercase tracking-[0.15em] font-medium">
								{t.common.languages}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Salas de Estudo */}
			<section className="mb-10 md:mb-16 animate-fade-in-up stagger-2">
				<div className="flex items-center gap-3 mb-4 md:mb-6">
					<BookOpen size={18} className="text-primary" />
					<h2 className="font-display text-lg md:text-xl font-bold tracking-tight">
						{t.homePage.studyRoomsTitle}
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
					                {sortedRooms.map((room, index) => {
							const Icon = getRoomIcon(room.icon);
							const topicCount = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

							return (
								<Link
									key={room.slug}
									to={`/room/${room.slug}`}
									className={`group room-card card-glow flex flex-col gap-3 md:gap-4 p-4 md:p-5 rounded-xl bg-surface-raised/80 border border-border hover:bg-surface-light/80 active:bg-surface-light/80 animate-fade-in-up stagger-${index + 3}`}
								>
									<div className="flex items-center gap-3">
										<div className="relative p-2 md:p-2.5 rounded-lg bg-primary/8">
											<Icon size={18} className="text-primary relative z-10" />
											<div className="absolute inset-0 bg-primary/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-sm text-text">{room.name}</h3>
											<span className="text-[11px] text-text-faint">
												{t.homePage.roomStats(room.categories.length, topicCount)}
											</span>
										</div>
									</div>

									<p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
										{room.description}
									</p>

									<div className="flex items-center gap-1.5 text-xs text-primary md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 mt-auto translate-x-0 group-hover:translate-x-1">
										<span className="font-medium">{t.common.explore}</span>
										<ArrowRight size={12} />
									</div>
								</Link>
							);
						})}
				</div>
			</section>

			{/* Modos de Aprendizado */}
			<section className="mb-10 md:mb-16 animate-fade-in-up stagger-6">
				<div className="flex items-center gap-3 mb-4 md:mb-6">
					<Layers size={18} className="text-accent" />
					<h2 className="font-display text-lg md:text-xl font-bold tracking-tight">
						{t.homePage.learningModesTitle}
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
					{/* Modo Estudo */}
					<div className="group p-4 md:p-6 rounded-xl bg-surface-raised/80 border border-border card-glow">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-lg bg-primary/8">
								<Sparkles size={16} className="text-primary" />
							</div>
							<h3 className="font-display font-bold text-sm">{t.homePage.studyMode}</h3>
						</div>
						<p className="text-xs text-text-muted leading-relaxed">
							{t.homePage.studyModeDescription}
						</p>
					</div>

					{/* Modo Pratica */}
					<div className="group relative p-4 md:p-6 rounded-xl bg-surface-raised/80 border border-border card-glow opacity-60">
						<div className="absolute top-3 right-3">
							<span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
								{t.common.comingSoon}
							</span>
						</div>
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-lg bg-accent/10">
								<Code2 size={16} className="text-accent" />
							</div>
							<h3 className="font-display font-bold text-sm">{t.homePage.practiceMode}</h3>
						</div>
						<p className="text-xs text-text-muted leading-relaxed">
							{t.homePage.practiceModeDescription}
						</p>
					</div>
				</div>
			</section>

			{/* Trilhas de Carreira */}
			<section className="animate-fade-in-up stagger-8">
				<div className="flex items-center gap-3 mb-4 md:mb-6">
					<MapIcon size={18} className="text-accent" />
					<h2 className="font-display text-lg md:text-xl font-bold tracking-tight">
						{t.homePage.careerTracksTitle}
					</h2>
				</div>

				<Link
					to="/roadmaps"
					className="group relative flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-xl bg-surface-raised/80 border border-border hover:bg-surface-light/80 active:bg-surface-light/80 card-glow max-w-lg"
				>
					<div className="relative p-2.5 md:p-3 rounded-xl bg-accent/8">
						<MapIcon size={20} className="text-accent relative z-10 md:hidden" />
						<MapIcon size={22} className="text-accent relative z-10 hidden md:block" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-sm text-text mb-1">{t.homePage.viewAllTracks}</h3>
						<p className="text-xs text-text-muted">{t.homePage.careerTracksSubtitle}</p>
					</div>
					<ArrowRight
						size={16}
						className="text-text-faint group-hover:text-accent shrink-0 transition-colors duration-200"
					/>
				</Link>
			</section>
		</PageLayout>
	);
};
