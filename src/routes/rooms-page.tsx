import { useLocale } from "@client/hooks/use-locale";
import { useRooms } from "@client/hooks/use-rooms";
import { clearActiveRoadmap } from "@client/lib/active-roadmap";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { PageSkeleton } from "@client/modules/layout/components/skeletons";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import "@client/styles/pages/rooms.css";
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
			<PageLayout breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.studyRooms }]}>
				<PageSkeleton />
			</PageLayout>
		);
	}

	return (
		<PageLayout breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.studyRooms }]}>
			{/* Header */}
			<div className="rooms-header">
				<div className="rooms-glow" />

				<div style={{ position: "relative" }}>
					<h1 className="rooms-title">{t.roomsPage.title}</h1>
					<p className="rooms-desc">{t.roomsPage.description}</p>

					<div className="rooms-stats">
						<div className="home-stat">
							<span className="rooms-stat-value">{rooms.length}</span>
							<span className="rooms-stat-label">{t.common.rooms}</span>
						</div>
						<div className="rooms-stat-divider" />
						<div className="home-stat">
							<span className="rooms-stat-value">{totalTopics}</span>
							<span className="rooms-stat-label">{t.common.topics}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Grid de salas */}
			<div className="rooms-list">
				{sortedRooms.map((room, index) => {
					const Icon = getRoomIcon(room.icon);
					const topicCount = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

					return (
						<Link
							key={room.slug}
							to={`/room/${room.slug}`}
							className="rooms-card card-glow animate-fade-in-up"
							style={{ animationDelay: `${Math.min(index + 1, 10) * 0.05}s` }}
						>
							<div className="rooms-card-icon">
								<Icon size={20} />
								<div className="rooms-card-icon-glow" />
							</div>

							<div className="rooms-card-body">
								<div className="rooms-card-title-row">
									<h3 className="rooms-card-title">{room.name}</h3>
									<span className="rooms-card-meta">
										{room.categories.length} {t.common.categories} · {topicCount}{" "}
										{t.common.topics.toLowerCase()}
									</span>
								</div>
								<p className="rooms-card-desc">{room.description}</p>

								{/* Categorias preview */}
								<div className="rooms-card-categories">
									{room.categories
										.sort((a, b) => a.order - b.order)
										.slice(0, 4)
										.map((cat) => (
											<span key={cat.slug} className="rooms-card-category-tag">
												{cat.name}
											</span>
										))}
									{room.categories.length > 4 && (
										<span className="rooms-card-more">+{room.categories.length - 4}</span>
									)}
								</div>
							</div>

							<ArrowRight size={16} className="rooms-card-arrow" />
						</Link>
					);
				})}
			</div>
		</PageLayout>
	);
};
