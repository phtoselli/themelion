import { useLocale } from "@client/hooks/use-locale";
import { useRooms } from "@client/hooks/use-rooms";
import { clearActiveRoadmap } from "@client/lib/active-roadmap";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { PageSkeleton } from "@client/modules/layout/components/skeletons";
import { PillBadge } from "@client/shared/components/pill-badge";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import "@client/styles/pages/home.css";
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
		() =>
			rooms.reduce(
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
			<div className="home-header">
				{/* Background glows - CSS handles responsive visibility */}
				<div className="home-glow-primary" />
				<div className="home-glow-accent" />

				<div style={{ position: "relative" }}>
					{/* Pill badge */}
					<div style={{ marginBottom: "1.5rem" }}>
						<PillBadge>{t.homePage.badge}</PillBadge>
					</div>

					{/* Heading */}
					<h1 className="home-heading">
						{t.homePage.heading}{" "}
						<span className="home-heading-highlight">{t.homePage.headingHighlight}</span>
					</h1>

					{/* Subtitle */}
					<p className="home-subtitle">
						Themelion (do grego <span className="home-subtitle-highlight">θεμέλιον</span>,
						"alicerce" ou "fundação") — é como os templos gregos que resistem ao tempo, aprenda
						conceitos de programação que transcendem qualquer framework.
					</p>

					{/* Stats */}
					<div className="home-stats">
						<div className="home-stat">
							<span className="home-stat-value">{rooms.length}</span>
							<span className="home-stat-label">{t.common.rooms}</span>
						</div>
						<div className="home-stat-divider" />
						<div className="home-stat">
							<span className="home-stat-value">{totalTopics}</span>
							<span className="home-stat-label">{t.common.topics}</span>
						</div>
						<div className="home-stat-divider" />
						<div className="home-stat">
							<span className="home-stat-value">5</span>
							<span className="home-stat-label">{t.common.languages}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Salas de Estudo */}
			<section className="home-section animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
				<div className="home-section-header">
					<BookOpen size={18} />
					<h2 className="home-section-title">{t.homePage.studyRoomsTitle}</h2>
				</div>

				<div className="home-rooms-grid">
					{sortedRooms.map((room, index) => {
						const Icon = getRoomIcon(room.icon);
						const topicCount = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

						return (
							<Link
								key={room.slug}
								to={`/room/${room.slug}`}
								className="home-room-card card-glow animate-fade-in-up"
								style={{ animationDelay: `${(index + 3) * 0.05}s` }}
							>
								<div className="home-room-header">
									<div className="home-room-icon">
										<Icon size={18} />
										<div className="home-room-icon-glow" />
									</div>
									<div className="home-room-info">
										<h3 className="home-room-name">{room.name}</h3>
										<span className="home-room-stats">
											{t.homePage.roomStats(room.categories.length, topicCount)}
										</span>
									</div>
								</div>

								<p className="home-room-desc">{room.description}</p>

								<div className="home-room-explore">
									<span>{t.common.explore}</span>
									<ArrowRight size={12} />
								</div>
							</Link>
						);
					})}
				</div>
			</section>

			{/* Modos de Aprendizado */}
			<section className="home-section animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
				<div className="home-section-header" data-accent="true">
					<Layers size={18} />
					<h2 className="home-section-title">{t.homePage.learningModesTitle}</h2>
				</div>

				<div className="home-modes-grid">
					{/* Modo Estudo */}
					<div className="home-mode-card card-glow">
						<div className="home-mode-header">
							<div className="home-mode-icon">
								<Sparkles size={16} />
							</div>
							<h3 className="home-mode-title">{t.homePage.studyMode}</h3>
						</div>
						<p className="home-mode-desc">{t.homePage.studyModeDescription}</p>
					</div>

					{/* Modo Pratica */}
					<div className="home-mode-card card-glow" data-disabled="true">
						<span className="home-coming-soon-badge">{t.common.comingSoon}</span>
						<div className="home-mode-header">
							<div className="home-mode-icon" data-accent="true">
								<Code2 size={16} />
							</div>
							<h3 className="home-mode-title">{t.homePage.practiceMode}</h3>
						</div>
						<p className="home-mode-desc">{t.homePage.practiceModeDescription}</p>
					</div>
				</div>
			</section>

			{/* Trilhas de Carreira */}
			<section className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
				<div className="home-section-header" data-accent="true">
					<MapIcon size={18} />
					<h2 className="home-section-title">{t.homePage.careerTracksTitle}</h2>
				</div>

				<Link to="/roadmaps" className="home-tracks-card card-glow">
					<div className="home-tracks-icon">
						<MapIcon size={20} className="home-tracks-icon-sm" />
						<MapIcon size={22} className="home-tracks-icon-md" />
					</div>
					<div className="home-tracks-info">
						<h3 className="home-tracks-title">{t.homePage.viewAllTracks}</h3>
						<p className="home-tracks-subtitle">{t.homePage.careerTracksSubtitle}</p>
					</div>
					<ArrowRight size={16} className="home-tracks-arrow" />
				</Link>
			</section>
		</PageLayout>
	);
};
