import { getRoadmapBySlug, rooms } from "virtual:content";
import { useLocale } from "@client/hooks/use-locale";
import { useTopicTitles } from "@client/hooks/use-topic-titles";
import { setActiveRoadmap } from "@client/lib/active-roadmap";
import { getAllProgress } from "@client/lib/progress";
import { CollapsibleSection } from "@client/modules/layout/components/collapsible-section";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { Check, Circle, Map as MapIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router";

export const RoadmapPage = () => {
	const { t } = useLocale();
	const { roadmapSlug } = useParams();
	const roadmap = getRoadmapBySlug(roadmapSlug ?? "");

	useEffect(() => {
		if (roadmap) {
			setActiveRoadmap(roadmap.slug);
		}
	}, [roadmap]);

	if (!roadmap) {
		return (
			<PageLayout>
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-text-muted">{t.roadmapPage.notFound}</p>
				</div>
			</PageLayout>
		);
	}

	// Memoizar cálculos de progresso para evitar recalcular em cada render
	const completionStats = useMemo(() => {
		const progress = getAllProgress();
		const allTopicSlugs = roadmap.stages.flatMap((stage) => stage.topics);
		const totalTopics = allTopicSlugs.length;
		const completedTopics = allTopicSlugs.filter(
			(slug) => progress[slug]?.completed === true,
		).length;
		const completionPercent =
			totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
		const isFullyCompleted = completedTopics === totalTopics && totalTopics > 0;
		return { totalTopics, completedTopics, completionPercent, isFullyCompleted };
	}, [roadmap.stages]);

	const { totalTopics, completedTopics, completionPercent, isFullyCompleted } = completionStats;

	// Usar hook memoizado para topic titles (evita O(n³) em cada render)
	const topicTitles = useTopicTitles(rooms);

	return (
		<PageLayout
			breadcrumbs={[
				{ label: t.common.home, href: "/" },
				{ label: t.nav.roadmaps, href: "/roadmaps" },
				{ label: roadmap.name },
			]}
		>
			{/* Header */}
			<div className="relative mb-8 md:mb-10 animate-fade-in-up">
				<div className="hidden md:block absolute -top-16 -left-16 w-[300px] h-[250px] bg-accent/[0.03] rounded-full blur-[80px] pointer-events-none" />

				<div className="relative flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
					<div className="relative p-2.5 md:p-3 rounded-xl bg-accent/8 shrink-0">
						<MapIcon size={20} className="text-accent relative z-10" />
						<div className="absolute inset-0 bg-accent/5 rounded-xl blur-sm" />
					</div>
					<div>
						<h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
							{roadmap.name}
						</h1>
						<div className="flex items-center gap-2 mt-1 md:mt-1.5">
							<span className="text-xs text-text-faint font-medium">
								{roadmap.stages.length} {t.common.stages}
							</span>
							<span className="w-1 h-1 rounded-full bg-text-faint/40" />
							<span className="text-xs text-text-faint font-medium">
								{totalTopics} {t.common.topics.toLowerCase()}
							</span>
						</div>
					</div>
				</div>
				<p className="text-text-muted text-xs md:text-sm leading-relaxed max-w-2xl">
					{roadmap.description}
				</p>

				{/* Barra de progresso */}
				<div className="mt-4 md:mt-5 max-w-2xl">
					<div className="flex items-center justify-between mb-1.5">
						<span
							className={`text-xs font-medium flex items-center gap-1.5 ${
								isFullyCompleted ? "text-emerald-500" : "text-text-muted"
							}`}
						>
							{isFullyCompleted ? (
								<>
									<Check size={12} className="text-emerald-500" />
									{t.roadmapPage.completed}
								</>
							) : (
								t.roadmapPage.completionPercent(completionPercent)
							)}
						</span>
						<span className="text-[10px] text-text-faint">
							{completedTopics}/{totalTopics}
						</span>
					</div>
					<div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full transition-all duration-500 ease-out ${
								isFullyCompleted ? "bg-emerald-500" : "bg-accent"
							}`}
							style={{ width: `${completionPercent}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Stages */}
			<div className="space-y-3">
				{roadmap.stages
					.sort((a, b) => a.order - b.order)
					.map((stage, index) => (
						<div
							key={stage.slug}
							className={`rounded-xl border border-border bg-surface-raised/60 overflow-hidden animate-fade-in-up stagger-${Math.min(index + 1, 10)}`}
						>
							<CollapsibleSection
								title={stage.name}
								count={stage.topics.length}
								defaultOpen={index === 0}
							>
								{stage.description && (
									<p className="text-xs text-text-muted px-3 pb-3 leading-relaxed">
										{stage.description}
									</p>
								)}
								<div className="space-y-0.5 pb-2">
									{stage.topics.map((topicSlug) => {
										const isCompleted = progress[topicSlug]?.completed === true;

										return (
											<Link
												key={topicSlug}
												to={`/topic/${topicSlug}`}
												className={`flex items-center gap-2.5 px-3 py-2.5 md:py-2 text-sm rounded-md transition-all duration-200 group ${
													isCompleted
														? "text-emerald-500 hover:text-emerald-400 hover:bg-surface-hover/50 active:bg-surface-hover/50"
														: "text-text-muted hover:text-text hover:bg-surface-hover/50 active:bg-surface-hover/50"
												}`}
											>
												<Circle
													size={5}
													className={`shrink-0 transition-colors duration-200 ${
														isCompleted
															? "text-emerald-500"
															: "text-text-faint group-hover:text-primary"
													}`}
												/>
												<span className="text-xs">{topicTitles.get(topicSlug) ?? topicSlug}</span>
											</Link>
										);
									})}
								</div>
							</CollapsibleSection>
						</div>
					))}
			</div>
		</PageLayout>
	);
};
