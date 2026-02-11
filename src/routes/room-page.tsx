import { getRoomBySlug } from "virtual:content";
import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { clearActiveRoadmap } from "@client/lib/active-roadmap";
import { getAllProgress } from "@client/lib/progress";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { DifficultyBadge } from "@client/modules/study/components/difficulty-badge";
import { StatusBadge } from "@client/modules/study/components/status-badge";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { CircleCheck } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router";
import "@client/styles/pages/room.css";

export const RoomPage = () => {
	const { t } = useLocale();
	const { roomSlug } = useParams();
	const { setCurrentRoom } = useNavigation();
	const room = getRoomBySlug(roomSlug ?? "");

	useEffect(() => {
		clearActiveRoadmap();
		if (room) {
			setCurrentRoom(room);
		}
	}, [room, setCurrentRoom]);

	// Memoizar cálculos para evitar recalcular em cada render
	const { totalTopics, sortedCategories } = useMemo(() => {
		if (!room) return { totalTopics: 0, sortedCategories: [] as typeof room.categories };
		const total = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);
		const sorted = [...room.categories].sort((a, b) => a.order - b.order);
		return { totalTopics: total, sortedCategories: sorted };
	}, [room]);

	if (!room) {
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
					<p style={{ color: "var(--text-muted)" }}>{t.roomPage.notFound}</p>
				</div>
			</PageLayout>
		);
	}

	const Icon = getRoomIcon(room.icon);
	const progress = getAllProgress();

	return (
		<PageLayout
			breadcrumbs={[
				{ label: t.common.home, href: "/" },
				{ label: t.nav.studyRooms, href: "/rooms" },
				{ label: room.name },
			]}
		>
			{/* Header da sala */}
			<div className="room-header">
				{/* Background glow */}
				<div className="room-glow" />

				<div className="room-title-row">
					<div className="room-icon">
						<Icon size={20} className="room-icon-svg room-icon-svg-sm" />
						<Icon size={24} className="room-icon-svg room-icon-svg-md" />
						<div className="room-icon-glow" />
					</div>
					<div>
						<h1 className="room-title">{room.name}</h1>
						<div className="room-meta">
							<span className="room-meta-text">
								{room.categories.length} {t.common.categories}
							</span>
							<span className="room-meta-dot" />
							<span className="room-meta-text">
								{totalTopics} {t.common.topics.toLowerCase()}
							</span>
						</div>
					</div>
				</div>
				<p className="room-desc">{room.description}</p>
			</div>

			{/* Categorias */}
			<div className="room-categories">
				{sortedCategories.map((category, catIndex) => {
					const implementedCount = category.topics.filter((t) => t.status === "implemented").length;

					return (
						<section
							key={category.slug}
							className="animate-fade-in-up"
							style={{ animationDelay: `${Math.min(catIndex + 1, 10) * 0.1}s` }}
						>
							<div className="room-category-header">
								<h2 className="room-category-title">{category.name}</h2>
								<span className="room-category-count">
									{implementedCount}/{category.topics.length}
								</span>
								<div className="room-category-line" />
							</div>

							<div className="room-topics-grid">
								{category.topics.map((topic) => {
									const isPlanned = topic.status !== "implemented";
									const isCompleted = progress[topic.slug]?.completed === true;

									const cardContent = (
										<>
											<span className="room-topic-title">{topic.title}</span>
											<DifficultyBadge difficulty={topic.difficulty} />
											{isPlanned && <StatusBadge status="planned" />}
											{isCompleted && <CircleCheck size={16} className="room-topic-check" />}
										</>
									);

									return isPlanned ? (
										<div
											key={topic.slug}
											className="room-topic-card card-glow"
											data-planned="true"
											data-completed={String(isCompleted)}
										>
											{cardContent}
										</div>
									) : (
										<Link
											key={topic.slug}
											to={`/topic/${topic.slug}`}
											className="room-topic-card card-glow"
											data-planned="false"
											data-completed={String(isCompleted)}
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
