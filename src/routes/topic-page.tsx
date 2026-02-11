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
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-text-muted">{t.topicPage.notFound}</p>
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
			<div className="mb-8 md:mb-10 animate-fade-in-up">
				<div className="flex items-start justify-between gap-4">
					<h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
						{topic.title}
					</h1>
					{isCompleted && (
						<span className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-beginner bg-beginner/10 px-2.5 py-1 rounded-md">
							<CircleCheck size={13} />
							{t.topicPage.completed}
						</span>
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2 mb-4">
					<DifficultyBadge difficulty={topic.difficulty} />
					{topic.tags.map((tag) => (
						<TagBadge key={tag}>{tag}</TagBadge>
					))}
				</div>

				{topic.prerequisites.length > 0 && (
					<div className="flex items-start gap-3 p-3 md:p-4 rounded-lg bg-surface-raised/60 border border-border animate-fade-in-up stagger-1">
						<LinkIcon size={14} className="text-primary shrink-0 mt-0.5" />
						<div>
							<span className="text-xs text-text-faint font-medium block mb-1">
								{t.topicPage.prerequisites}
							</span>
							<div className="flex flex-wrap gap-1.5">
								{topic.prerequisites.map((prereq) => (
									<Link
										key={prereq}
										to={`/topic/${prereq}`}
										className="text-xs text-primary hover:text-primary-dark bg-primary/8 px-2 py-0.5 rounded-md transition-colors duration-200 font-medium"
									>
										{prereq}
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Area de conteudo */}
			<div className="max-w-none min-h-[200px]">
				{topic.status !== "implemented" ? (
					<div className="flex flex-col items-center justify-center gap-4 p-8 md:p-16 rounded-xl border border-dashed border-border/60 bg-surface-raised/30 animate-fade-in-up stagger-2">
						<BookOpen size={32} className="text-text-faint/40 md:hidden" />
						<BookOpen size={40} className="text-text-faint/40 hidden md:block" />
						<p className="text-text-muted text-base md:text-lg font-medium">
							{t.topicPage.comingSoonTitle}
						</p>
						<p className="text-text-faint text-xs md:text-sm max-w-md text-center">
							{t.topicPage.comingSoonDescription}
						</p>
					</div>
				) : topic.content ? (
					<TopicContent content={topic.content} examples={topic.examples} />
				) : (
					<div className="flex flex-col items-center justify-center gap-4 p-8 md:p-12 rounded-xl border border-dashed border-border/60 bg-surface-raised/30 animate-fade-in-up stagger-2">
						<BookOpen size={32} className="text-text-faint/40" />
						<p className="text-text-faint text-xs md:text-sm">{t.topicPage.mdxPlaceholder}</p>
					</div>
				)}
			</div>

			{/* Botao de marcar como concluido */}
			{topic.status === "implemented" && topic.content && (
				<div className="mt-10 md:mt-14 pt-6 md:pt-8 border-t border-border animate-fade-in-up stagger-4">
					{isCompleted ? (
						<div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-beginner/5 border border-beginner/20">
							<CircleCheck size={20} className="text-beginner" />
							<div className="text-center">
								<p className="text-sm font-medium text-beginner">{t.topicPage.completed}</p>
								{completedAt && (
									<p className="text-xs text-text-faint mt-0.5">
										{t.topicPage.completedAt(formatDate(completedAt))}
									</p>
								)}
							</div>
						</div>
					) : (
						<button
							type="button"
							onClick={handleMarkCompleted}
							className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-primary/8 border border-primary/20 text-primary hover:bg-primary/15 hover:border-primary/30 transition-all duration-200 active:scale-[0.99]"
						>
							<Check size={18} />
							<span className="text-sm font-medium">{t.topicPage.markCompleted}</span>
						</button>
					)}
				</div>
			)}

			{/* Navegacao prev/next */}
			<nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border animate-fade-in-up stagger-5">
				{prevTopic ? (
					<Link
						to={`/topic/${prevTopic.slug}`}
						className="group flex items-center gap-3 p-3 md:p-4 rounded-xl bg-surface-raised/60 border border-border card-glow transition-all duration-200 active:bg-surface-light/80"
					>
						<ArrowLeft
							size={16}
							className="text-text-faint group-hover:text-primary shrink-0 transition-colors duration-200"
						/>
						<div className="min-w-0">
							<span className="text-[11px] text-text-faint uppercase tracking-wider font-medium block mb-0.5">
								{t.common.previous}
							</span>
							<span className="text-sm text-text-muted group-hover:text-text transition-colors duration-200 truncate block">
								{prevTopic.title}
							</span>
						</div>
					</Link>
				) : (
					<div className="hidden sm:block" />
				)}
				{nextTopic ? (
					<Link
						to={`/topic/${nextTopic.slug}`}
						className="group flex items-center justify-end gap-3 p-3 md:p-4 rounded-xl bg-surface-raised/60 border border-border card-glow text-right transition-all duration-200 active:bg-surface-light/80"
					>
						<div className="min-w-0">
							<span className="text-[11px] text-text-faint uppercase tracking-wider font-medium block mb-0.5">
								{t.common.next}
							</span>
							<span className="text-sm text-text-muted group-hover:text-text transition-colors duration-200 truncate block">
								{nextTopic.title}
							</span>
						</div>
						<ArrowRight
							size={16}
							className="text-text-faint group-hover:text-primary shrink-0 transition-colors duration-200"
						/>
					</Link>
				) : (
					<div className="hidden sm:block" />
				)}
			</nav>
		</PageLayout>
	);
};
