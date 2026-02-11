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
import "@client/styles/pages/roadmap.css";

export const RoadmapPage = () => {
	const { t } = useLocale();
	const { roadmapSlug } = useParams();
	const roadmap = getRoadmapBySlug(roadmapSlug ?? "");

	useEffect(() => {
		if (roadmap) {
			setActiveRoadmap(roadmap.slug);
		}
	}, [roadmap]);

	// Memoizar cálculos de progresso para evitar recalcular em cada render
	const completionStats = useMemo(() => {
		if (!roadmap)
			return { totalTopics: 0, completedTopics: 0, completionPercent: 0, isFullyCompleted: false };
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
	}, [roadmap]);

	const { totalTopics, completedTopics, completionPercent, isFullyCompleted } = completionStats;

	// Usar hook memoizado para topic titles (evita O(n³) em cada render)
	const topicTitles = useTopicTitles(rooms);

	if (!roadmap) {
		return (
			<PageLayout>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "400px",
					}}
				>
					<p style={{ color: "var(--text-muted)" }}>{t.roadmapPage.notFound}</p>
				</div>
			</PageLayout>
		);
	}

	const progress = getAllProgress();

	return (
		<PageLayout
			breadcrumbs={[
				{ label: t.common.home, href: "/" },
				{ label: t.nav.roadmaps, href: "/roadmaps" },
				{ label: roadmap.name },
			]}
		>
			{/* Header */}
			<div className="roadmap-header">
				<div className="roadmap-glow" />

				<div className="roadmap-title-row">
					<div className="roadmap-icon">
						<MapIcon size={20} />
						<div className="roadmap-icon-glow" />
					</div>
					<div>
						<h1 className="roadmap-title">{roadmap.name}</h1>
						<div className="roadmap-meta">
							<span className="roadmap-meta-text">
								{roadmap.stages.length} {t.common.stages}
							</span>
							<span className="roadmap-meta-dot" />
							<span className="roadmap-meta-text">
								{totalTopics} {t.common.topics.toLowerCase()}
							</span>
						</div>
					</div>
				</div>
				<p className="roadmap-desc">{roadmap.description}</p>

				{/* Barra de progresso */}
				<div className="roadmap-progress">
					<div className="roadmap-progress-header">
						<span className="roadmap-progress-label" data-complete={String(isFullyCompleted)}>
							{isFullyCompleted ? (
								<>
									<Check size={12} />
									{t.roadmapPage.completed}
								</>
							) : (
								t.roadmapPage.completionPercent(completionPercent)
							)}
						</span>
						<span className="roadmap-progress-count">
							{completedTopics}/{totalTopics}
						</span>
					</div>
					<div className="roadmap-progress-track">
						<div
							className="roadmap-progress-bar"
							data-complete={String(isFullyCompleted)}
							style={{ width: `${completionPercent}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Stages */}
			<div className="roadmap-stages">
				{roadmap.stages
					.sort((a, b) => a.order - b.order)
					.map((stage, index) => (
						<div
							key={stage.slug}
							className="roadmap-stage animate-fade-in-up"
							style={{ animationDelay: `${Math.min(index + 1, 10) * 0.1}s` }}
						>
							<CollapsibleSection
								title={stage.name}
								count={stage.topics.length}
								defaultOpen={index === 0}
							>
								{stage.description && <p className="roadmap-stage-desc">{stage.description}</p>}
								<div className="roadmap-stage-topics">
									{stage.topics.map((topicSlug) => {
										const isCompleted = progress[topicSlug]?.completed === true;

										return (
											<Link
												key={topicSlug}
												to={`/topic/${topicSlug}`}
												className="roadmap-topic"
												data-completed={String(isCompleted)}
											>
												<Circle size={5} className="roadmap-topic-dot" />
												<span className="roadmap-topic-name">
													{topicTitles.get(topicSlug) ?? topicSlug}
												</span>
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
