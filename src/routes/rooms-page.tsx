import { useRooms } from "@client/hooks/use-rooms";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { PageSkeleton } from "@client/modules/layout/components/skeletons";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export const RoomsPage = () => {
	const { rooms, loading } = useRooms();

	if (loading) {
		return (
			<PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Salas de Estudo" }]}>
				<PageSkeleton />
			</PageLayout>
		);
	}

	const totalTopics = rooms.reduce(
		(sum, room) => sum + room.categories.reduce((catSum, cat) => catSum + cat.topics.length, 0),
		0,
	);

	return (
		<PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Salas de Estudo" }]}>
			{/* Header */}
			<div className="relative mb-12 animate-fade-in-up">
				<div className="absolute -top-24 -left-24 w-[400px] h-[350px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />

				<div className="relative">
					<h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
						Salas de Estudo
					</h1>
					<p className="text-text-muted text-base max-w-2xl leading-relaxed">
						Cada sala agrupa tópicos por área de conhecimento. Escolha uma sala para explorar seus
						conteúdos e começar a aprender.
					</p>

					<div className="flex items-center gap-8 mt-8">
						<div className="flex flex-col gap-1">
							<span className="font-display text-2xl font-bold text-text tabular-nums">
								{rooms.length}
							</span>
							<span className="text-[11px] text-text-faint uppercase tracking-[0.15em] font-medium">
								Salas
							</span>
						</div>
						<div className="w-px h-10 bg-border" />
						<div className="flex flex-col gap-1">
							<span className="font-display text-2xl font-bold text-text tabular-nums">
								{totalTopics}
							</span>
							<span className="text-[11px] text-text-faint uppercase tracking-[0.15em] font-medium">
								Tópicos
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Grid de salas */}
			<div className="space-y-6">
				{rooms
					.sort((a, b) => a.order - b.order)
					.map((room, index) => {
						const Icon = getRoomIcon(room.icon);
						const topicCount = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

						return (
							<Link
								key={room.slug}
								to={`/room/${room.slug}`}
								className={`group room-card card-glow flex items-start gap-5 p-6 rounded-xl bg-surface-raised/80 border border-border hover:bg-surface-light/80 animate-fade-in-up stagger-${Math.min(index + 1, 10)}`}
							>
								<div className="relative p-3 rounded-xl bg-primary/8 shrink-0">
									<Icon size={22} className="text-primary relative z-10" />
									<div className="absolute inset-0 bg-primary/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-3 mb-1.5">
										<h3 className="font-display font-bold text-base text-text">{room.name}</h3>
										<span className="text-[11px] text-text-faint font-medium tabular-nums">
											{room.categories.length} categorias · {topicCount} tópicos
										</span>
									</div>
									<p className="text-sm text-text-muted leading-relaxed mb-3">{room.description}</p>

									{/* Categorias preview */}
									<div className="flex flex-wrap gap-2">
										{room.categories
											.sort((a, b) => a.order - b.order)
											.slice(0, 4)
											.map((cat) => (
												<span
													key={cat.slug}
													className="text-[11px] text-text-faint bg-surface/80 border border-border/50 px-2.5 py-1 rounded-md"
												>
													{cat.name}
												</span>
											))}
										{room.categories.length > 4 && (
											<span className="text-[11px] text-text-faint px-2.5 py-1">
												+{room.categories.length - 4}
											</span>
										)}
									</div>
								</div>

								<ArrowRight
									size={16}
									className="text-text-faint group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1"
								/>
							</Link>
						);
					})}
			</div>
		</PageLayout>
	);
};
