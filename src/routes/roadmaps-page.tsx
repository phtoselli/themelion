import { roadmaps } from "virtual:content";
import { useLocale } from "@client/hooks/use-locale";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { ArrowRight, Lock, Map as MapIcon } from "lucide-react";
import { Link } from "react-router";
import "@client/styles/pages/roadmaps.css";

type RoadmapLevel = "junior" | "pleno" | "senior";

const AVAILABLE_SLUGS = ["fullstack-developer-junior"];

function isAvailable(slug: string): boolean {
	return AVAILABLE_SLUGS.includes(slug);
}

function extractLevel(slug: string): RoadmapLevel | null {
	if (slug.endsWith("-junior")) return "junior";
	if (slug.endsWith("-pleno")) return "pleno";
	if (slug.endsWith("-senior")) return "senior";
	return null;
}

interface GroupedRoadmaps {
	level: RoadmapLevel;
	label: string;
	roadmaps: typeof roadmaps;
}

function groupRoadmapsByLevel(list: typeof roadmaps, t: ReturnType<typeof useLocale>["t"]): GroupedRoadmaps[] {
	const grouped: Record<RoadmapLevel, typeof roadmaps> = {
		junior: [],
		pleno: [],
		senior: [],
	};

	for (const roadmap of list) {
		const level = extractLevel(roadmap.slug);
		if (level) {
			grouped[level].push(roadmap);
		}
	}

	// Dentro de cada grupo: disponíveis primeiro, depois alfabético
	for (const level of Object.keys(grouped) as RoadmapLevel[]) {
		grouped[level].sort((a, b) => {
			const aAvailable = isAvailable(a.slug);
			const bAvailable = isAvailable(b.slug);
			if (aAvailable !== bAvailable) return aAvailable ? -1 : 1;
			return a.name.localeCompare(b.name, "pt-BR");
		});
	}

	return [
		{ level: "junior", label: t.roadmapsPage.levelJunior, roadmaps: grouped.junior },
		{ level: "pleno", label: t.roadmapsPage.levelPleno, roadmaps: grouped.pleno },
		{ level: "senior", label: t.roadmapsPage.levelSenior, roadmaps: grouped.senior },
	].filter((group) => group.roadmaps.length > 0);
}

export const RoadmapsPage = () => {
	const { t } = useLocale();
	const groupedRoadmaps = groupRoadmapsByLevel(roadmaps, t);

	return (
		<PageLayout breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.roadmaps }]}>
			{/* Header */}
			<div className="roadmaps-header">
				<div className="roadmaps-glow" />

				<div className="roadmaps-title-row">
					<div className="roadmaps-icon">
						<MapIcon size={20} />
						<div className="roadmaps-icon-glow" />
					</div>
					<div>
						<h1 className="roadmaps-title">{t.roadmapsPage.title}</h1>
						<span className="roadmaps-meta">{t.roadmapsPage.availableTracks(roadmaps.length)}</span>
					</div>
				</div>
				<p className="roadmaps-desc">{t.roadmapsPage.description}</p>
			</div>

			{/* Roadmaps agrupados por nível */}
			{groupedRoadmaps.map((group) => (
				<div key={group.level} className="roadmaps-level-section">
					<div className="roadmaps-level-header">
						<h2 className="roadmaps-level-title">{group.label}</h2>
						<div className="roadmaps-level-divider" />
					</div>

					<div className="roadmaps-grid">
						{group.roadmaps.map((roadmap, index) => {
							const Icon = getRoomIcon(roadmap.icon);
							const totalTopics = roadmap.stages.reduce((sum, s) => sum + s.topics.length, 0);
							const available = isAvailable(roadmap.slug);

							if (available) {
								return (
									<Link
										key={roadmap.slug}
										to={`/roadmap/${roadmap.slug}`}
										className="roadmaps-card card-glow animate-fade-in-up"
										style={{ animationDelay: `${(index + 1) * 0.1}s` }}
									>
										<div className="roadmaps-card-header">
											<div className="roadmaps-card-icon">
												<Icon size={18} />
											</div>
											<div className="roadmaps-card-info">
												<h3 className="roadmaps-card-name">{roadmap.name}</h3>
												<span className="roadmaps-card-meta">
													{roadmap.stages.length} {t.common.stages} · {totalTopics}{" "}
													{t.common.topics.toLowerCase()}
												</span>
											</div>
										</div>

										<div className="roadmaps-card-progress">
											{roadmap.stages.map((stage) => (
												<div key={stage.slug} className="roadmaps-card-progress-bar" />
											))}
										</div>

										<p className="roadmaps-card-desc">{roadmap.description}</p>

										<div className="roadmaps-card-explore">
											<span>{t.roadmapsPage.viewTrack}</span>
											<ArrowRight size={12} />
										</div>
									</Link>
								);
							}

							return (
								<div
									key={roadmap.slug}
									className="roadmaps-card roadmaps-card-locked animate-fade-in-up"
									style={{ animationDelay: `${(index + 1) * 0.1}s` }}
								>
									<div className="roadmaps-card-header">
										<div className="roadmaps-card-icon roadmaps-card-icon-locked">
											<Icon size={18} />
										</div>
										<div className="roadmaps-card-info">
											<h3 className="roadmaps-card-name">{roadmap.name}</h3>
											<span className="roadmaps-card-meta">
												{roadmap.stages.length} {t.common.stages} · {totalTopics}{" "}
												{t.common.topics.toLowerCase()}
											</span>
										</div>
										<span className="roadmaps-coming-soon-badge">
											<Lock size={10} />
											{t.common.comingSoon}
										</span>
									</div>

									<div className="roadmaps-card-progress">
										{roadmap.stages.map((stage) => (
											<div key={stage.slug} className="roadmaps-card-progress-bar" />
										))}
									</div>

									<p className="roadmaps-card-desc">{roadmap.description}</p>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</PageLayout>
	);
};
