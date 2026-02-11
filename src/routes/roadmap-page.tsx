import { getRoadmapBySlug } from "virtual:content";
import { useLocale } from "@client/hooks/use-locale";
import { CollapsibleSection } from "@client/modules/layout/components/collapsible-section";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { Circle, Map as MapIcon } from "lucide-react";
import { Link, useParams } from "react-router";

export const RoadmapPage = () => {
	const { t } = useLocale();
	const { roadmapSlug } = useParams();
	const roadmap = getRoadmapBySlug(roadmapSlug ?? "");

	if (!roadmap) {
		return (
			<PageLayout>
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-text-muted">{t.roadmapPage.notFound}</p>
				</div>
			</PageLayout>
		);
	}

	const totalTopics = roadmap.stages.reduce((sum, stage) => sum + stage.topics.length, 0);

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
									{stage.topics.map((topicSlug) => (
										<Link
											key={topicSlug}
											to={`/topic/${topicSlug}`}
											className="flex items-center gap-2.5 px-3 py-2.5 md:py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover/50 active:bg-surface-hover/50 rounded-md transition-all duration-200 group"
										>
											<Circle
												size={5}
												className="shrink-0 text-text-faint group-hover:text-primary transition-colors duration-200"
											/>
											<span className="text-xs">{topicSlug}</span>
										</Link>
									))}
								</div>
							</CollapsibleSection>
						</div>
					))}
			</div>
		</PageLayout>
	);
};
