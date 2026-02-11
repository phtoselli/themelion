import { getRoadmapBySlug, getRoomBySlug, getTopicBySlug, rooms } from "virtual:content";
import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { useTopicTitles } from "@client/hooks/use-topic-titles";
import { getActiveRoadmap } from "@client/lib/active-roadmap";
import { getTopicProgress, markTopicCompleted, markTopicVisited } from "@client/lib/progress";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { DifficultyBadge } from "@client/modules/study/components/difficulty-badge";
import { TagBadge } from "@client/modules/study/components/tag-badge";
import { TopicContent } from "@client/modules/study/components/topic-content";
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Check,
	CircleCheck,
	Link as LinkIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import "@client/styles/pages/topic.css";

export const TopicPage = () => {
	const { t } = useLocale();
	const { topicSlug } = useParams();
	const { setCurrentRoom } = useNavigation();

	const topic = getTopicBySlug(topicSlug ?? "");
	const room = topic ? getRoomBySlug(topic.room) : null;

	const [isCompleted, setIsCompleted] = useState(false);
	const [completedAt, setCompletedAt] = useState<string | null>(null);

	// Marcar como visitado e carregar estado de progresso
	useEffect(() => {
		if (topic) {
			markTopicVisited(topic.slug);
			const progress = getTopicProgress(topic.slug);
			if (progress?.completed) {
				setIsCompleted(true);
				setCompletedAt(progress.completedAt);
			} else {
				setIsCompleted(false);
				setCompletedAt(null);
			}
		}
	}, [topic]);

	useEffect(() => {
		if (room) {
			setCurrentRoom(room);
		}
	}, [room, setCurrentRoom]);

	// Usar hook memoizado para topic titles (evita O(n³) em cada render)
	const topicTitles = useTopicTitles(rooms);

	const { prevTopic, nextTopic, categoryName } = useMemo(() => {
		if (!topic) return { prevTopic: null, nextTopic: null, categoryName: "" };

		// Tentar navegacao por roadmap ativo
		const activeRoadmapSlug = getActiveRoadmap();
		if (activeRoadmapSlug) {
			const roadmap = getRoadmapBySlug(activeRoadmapSlug);
			if (roadmap) {
				const flatTopics = roadmap.stages
					.sort((a, b) => a.order - b.order)
					.flatMap((stage) => stage.topics);

				const currentIndex = flatTopics.indexOf(topic.slug);

				if (currentIndex !== -1) {
					const prevSlug = currentIndex > 0 ? flatTopics[currentIndex - 1] : null;
					const nextSlug =
						currentIndex < flatTopics.length - 1 ? flatTopics[currentIndex + 1] : null;

					return {
						prevTopic: prevSlug
							? { slug: prevSlug, title: topicTitles.get(prevSlug) ?? prevSlug }
							: null,
						nextTopic: nextSlug
							? { slug: nextSlug, title: topicTitles.get(nextSlug) ?? nextSlug }
							: null,
						categoryName: "",
					};
				}
			}
		}

		// Fallback: navegacao por categoria (comportamento padrao)
		if (!room) return { prevTopic: null, nextTopic: null, categoryName: "" };

		const category = room.categories.find((c) => c.slug === topic.category);
		if (!category) return { prevTopic: null, nextTopic: null, categoryName: "" };

		const sorted = [...category.topics].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((t) => t.slug === topic.slug);

		return {
			prevTopic: idx > 0 ? sorted[idx - 1] : null,
			nextTopic: idx < sorted.length - 1 ? sorted[idx + 1] : null,
			categoryName: category.name,
		};
	}, [room, topic, topicTitles]);

	const handleMarkCompleted = useCallback(() => {
		if (!topic) return;
		markTopicCompleted(topic.slug);
		setIsCompleted(true);
		setCompletedAt(new Date().toISOString());
	}, [topic]);

	const formatDate = (isoDate: string) => {
		return new Date(isoDate).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	if (!topic) {
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
					<p style={{ color: "var(--text-muted)" }}>{t.topicPage.notFound}</p>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout
			breadcrumbs={[
				{ label: t.common.home, href: "/" },
				{ label: t.nav.studyRooms, href: "/rooms" },
				{ label: room?.name ?? topic.room, href: `/room/${topic.room}` },
				{ label: categoryName || topic.category },
				{ label: topic.title },
			]}
		>
			{/* Header do topico */}
			<div className="topic-header">
				<div className="topic-title-row">
					<h1 className="topic-title">{topic.title}</h1>
					{isCompleted && (
						<span className="topic-completed-badge">
							<CircleCheck size={13} />
							{t.topicPage.completed}
						</span>
					)}
				</div>

				<div className="topic-badges">
					<DifficultyBadge difficulty={topic.difficulty} />
					{topic.tags.map((tag) => (
						<TagBadge key={tag}>{tag}</TagBadge>
					))}
				</div>

				{topic.prerequisites.length > 0 && (
					<div className="topic-prereqs animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
						<LinkIcon size={14} className="topic-prereqs-icon" />
						<div>
							<span className="topic-prereqs-label">{t.topicPage.prerequisites}</span>
							<div className="topic-prereqs-links">
								{topic.prerequisites.map((prereq) => (
									<Link key={prereq} to={`/topic/${prereq}`} className="topic-prereqs-link">
										{prereq}
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Area de conteudo */}
			<div className="topic-content-area">
				{topic.status !== "implemented" ? (
					<div className="topic-empty animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
						<BookOpen size={32} className="topic-empty-icon topic-empty-icon-sm" />
						<BookOpen size={40} className="topic-empty-icon topic-empty-icon-md" />
						<p className="topic-empty-title">{t.topicPage.comingSoonTitle}</p>
						<p className="topic-empty-desc">{t.topicPage.comingSoonDescription}</p>
					</div>
				) : topic.content ? (
					<TopicContent content={topic.content} examples={topic.examples} />
				) : (
					<div className="topic-empty-small animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
						<BookOpen size={32} className="topic-empty-small-icon" />
						<p className="topic-empty-small-text">{t.topicPage.mdxPlaceholder}</p>
					</div>
				)}
			</div>

			{/* Botao de marcar como concluido */}
			{topic.status === "implemented" && topic.content && (
				<div className="topic-completion animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
					{isCompleted ? (
						<div className="topic-completed-state">
							<CircleCheck size={20} />
							<div className="topic-completed-state-text">
								<p className="topic-completed-state-label">{t.topicPage.completed}</p>
								{completedAt && (
									<p className="topic-completed-state-date">
										{t.topicPage.completedAt(formatDate(completedAt))}
									</p>
								)}
							</div>
						</div>
					) : (
						<button type="button" onClick={handleMarkCompleted} className="topic-mark-btn">
							<Check size={18} />
							<span>{t.topicPage.markCompleted}</span>
						</button>
					)}
				</div>
			)}

			{/* Navegacao prev/next */}
			<nav className="topic-nav animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
				{prevTopic ? (
					<Link to={`/topic/${prevTopic.slug}`} className="topic-nav-card card-glow">
						<ArrowLeft size={16} className="topic-nav-arrow" />
						<div className="topic-nav-info">
							<span className="topic-nav-label">{t.common.previous}</span>
							<span className="topic-nav-title">{prevTopic.title}</span>
						</div>
					</Link>
				) : (
					<div className="topic-nav-placeholder" />
				)}
				{nextTopic ? (
					<Link
						to={`/topic/${nextTopic.slug}`}
						className="topic-nav-card card-glow"
						data-align="right"
					>
						<div className="topic-nav-info">
							<span className="topic-nav-label">{t.common.next}</span>
							<span className="topic-nav-title">{nextTopic.title}</span>
						</div>
						<ArrowRight size={16} className="topic-nav-arrow" />
					</Link>
				) : (
					<div className="topic-nav-placeholder" />
				)}
			</nav>
		</PageLayout>
	);
};
