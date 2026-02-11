import { getRoomBySlug, getTopicBySlug } from "virtual:content";
import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { DifficultyBadge } from "@client/modules/study/components/difficulty-badge";
import { TagBadge } from "@client/modules/study/components/tag-badge";
import { ArrowLeft, ArrowRight, BookOpen, Link as LinkIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router";

export const TopicPage = () => {
	const { t } = useLocale();
	const { topicSlug } = useParams();
	const { setCurrentRoom } = useNavigation();

	const topic = getTopicBySlug(topicSlug ?? "");
	const room = topic ? getRoomBySlug(topic.room) : null;

	useEffect(() => {
		if (room) {
			setCurrentRoom(room);
		}
	}, [room, setCurrentRoom]);

	const { prevTopic, nextTopic, categoryName } = useMemo(() => {
		if (!room || !topic) return { prevTopic: null, nextTopic: null, categoryName: "" };

		const category = room.categories.find((c) => c.slug === topic.category);
		if (!category) return { prevTopic: null, nextTopic: null, categoryName: "" };

		const sorted = [...category.topics].sort((a, b) => a.order - b.order);
		const idx = sorted.findIndex((t) => t.slug === topic.slug);

		return {
			prevTopic: idx > 0 ? sorted[idx - 1] : null,
			nextTopic: idx < sorted.length - 1 ? sorted[idx + 1] : null,
			categoryName: category.name,
		};
	}, [room, topic]);

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
				<h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
					{topic.title}
				</h1>

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

			{/* Area de conteudo (placeholder para MDX) */}
			<div className="prose prose-invert max-w-none min-h-[200px] animate-fade-in-up stagger-2">
				{topic.status !== "implemented" ? (
					<div className="flex flex-col items-center justify-center gap-4 p-8 md:p-16 rounded-xl border border-dashed border-border/60 bg-surface-raised/30">
						<BookOpen size={32} className="text-text-faint/40 md:hidden" />
						<BookOpen size={40} className="text-text-faint/40 hidden md:block" />
						<p className="text-text-muted text-base md:text-lg font-medium">
							{t.topicPage.comingSoonTitle}
						</p>
						<p className="text-text-faint text-xs md:text-sm max-w-md text-center">
							{t.topicPage.comingSoonDescription}
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-4 p-8 md:p-12 rounded-xl border border-dashed border-border/60 bg-surface-raised/30">
						<BookOpen size={32} className="text-text-faint/40" />
						<p className="text-text-faint text-xs md:text-sm">{t.topicPage.mdxPlaceholder}</p>
					</div>
				)}
			</div>

			{/* Navegacao prev/next */}
			<nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-10 md:mt-14 pt-6 md:pt-8 border-t border-border animate-fade-in-up stagger-3">
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
