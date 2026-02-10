import { useRooms } from "@client/hooks/use-rooms";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { PageSkeleton } from "@client/modules/layout/components/skeletons";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { ArrowRight, BookOpen, Code2, Layers, Map as MapIcon, Sparkles } from "lucide-react";
import { Link } from "react-router";

export const HomePage = () => {
	const { rooms, loading } = useRooms();

	if (loading) {
		return (
			<PageLayout>
				<PageSkeleton />
			</PageLayout>
		);
	}

	const totalTopics = rooms.reduce(
		(sum, room) => sum + room.categories.reduce((catSum, cat) => catSum + cat.topics.length, 0),
		0,
	);

	return (
		<PageLayout>
			{/* Hero */}
			<div className="relative mb-16 animate-fade-in-up">
				{/* Background glows */}
				<div className="absolute -top-32 -left-32 w-[500px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute -top-16 right-0 w-[300px] h-[300px] bg-accent/[0.03] rounded-full blur-[80px] pointer-events-none" />

				<div className="relative">
					{/* Pill badge */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8">
						<span
							className="w-1.5 h-1.5 rounded-full bg-primary"
							style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
						/>
						<span className="text-xs text-primary font-medium tracking-widest uppercase">
							Fundamentos Atemporais
						</span>
					</div>

					{/* Heading */}
					<h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight mb-5 max-w-3xl leading-[1.08]">
						Aprenda os fundamentos que <span className="text-primary">não mudam</span>
					</h1>

					{/* Subtitle */}
					<p className="text-text-muted text-lg max-w-2xl leading-relaxed font-light">
						Do grego <span className="italic text-text font-medium">θεμέλιον</span>, "alicerce" —
						como os templos gregos que resistem ao tempo, aprenda conceitos de programação que
						transcendem qualquer framework.
					</p>

					{/* Stats */}
					<div className="flex items-center gap-10 mt-10">
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
						<div className="w-px h-10 bg-border" />
						<div className="flex flex-col gap-1">
							<span className="font-display text-2xl font-bold text-text tabular-nums">5</span>
							<span className="text-[11px] text-text-faint uppercase tracking-[0.15em] font-medium">
								Linguagens
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Salas de Estudo */}
			<section className="mb-16 animate-fade-in-up stagger-2">
				<div className="flex items-center gap-3 mb-6">
					<BookOpen size={18} className="text-primary" />
					<h2 className="font-display text-xl font-bold tracking-tight">Salas de Estudo</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{rooms
						.sort((a, b) => a.order - b.order)
						.map((room, index) => {
							const Icon = getRoomIcon(room.icon);
							const topicCount = room.categories.reduce((sum, cat) => sum + cat.topics.length, 0);

							return (
								<Link
									key={room.slug}
									to={`/room/${room.slug}`}
									className={`group room-card card-glow flex flex-col gap-4 p-5 rounded-xl bg-surface-raised/80 border border-border hover:bg-surface-light/80 animate-fade-in-up stagger-${index + 3}`}
								>
									<div className="flex items-center gap-3">
										<div className="relative p-2.5 rounded-lg bg-primary/8">
											<Icon size={18} className="text-primary relative z-10" />
											<div className="absolute inset-0 bg-primary/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-sm text-text">{room.name}</h3>
											<span className="text-[11px] text-text-faint">
												{room.categories.length} categorias · {topicCount} tópicos
											</span>
										</div>
									</div>

									<p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
										{room.description}
									</p>

									<div className="flex items-center gap-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 mt-auto translate-x-0 group-hover:translate-x-1">
										<span className="font-medium">Explorar</span>
										<ArrowRight size={12} />
									</div>
								</Link>
							);
						})}
				</div>
			</section>

			{/* Modos de Aprendizado */}
			<section className="mb-16 animate-fade-in-up stagger-6">
				<div className="flex items-center gap-3 mb-6">
					<Layers size={18} className="text-accent" />
					<h2 className="font-display text-xl font-bold tracking-tight">Dois modos de aprender</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Modo Estudo */}
					<div className="group p-6 rounded-xl bg-surface-raised/80 border border-border card-glow">
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-lg bg-primary/8">
								<Sparkles size={16} className="text-primary" />
							</div>
							<h3 className="font-display font-bold text-sm">Modo Estudo</h3>
						</div>
						<p className="text-xs text-text-muted leading-relaxed">
							Conteúdo direto ao ponto com exemplos em 5 linguagens. Sem enrolação, sem frameworks —
							só conceitos que importam.
						</p>
					</div>

					{/* Modo Pratica */}
					<div className="group relative p-6 rounded-xl bg-surface-raised/80 border border-border card-glow opacity-60">
						<div className="absolute top-3 right-3">
							<span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
								Em breve
							</span>
						</div>
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-lg bg-accent/10">
								<Code2 size={16} className="text-accent" />
							</div>
							<h3 className="font-display font-bold text-sm">Modo Prática</h3>
						</div>
						<p className="text-xs text-text-muted leading-relaxed">
							Desafios em containers Docker efêmeros com feedback de performance em tempo real.
							Escreva, execute, aprenda.
						</p>
					</div>
				</div>
			</section>

			{/* Trilhas de Carreira */}
			<section className="animate-fade-in-up stagger-8">
				<div className="flex items-center gap-3 mb-6">
					<MapIcon size={18} className="text-accent" />
					<h2 className="font-display text-xl font-bold tracking-tight">Trilhas de Carreira</h2>
				</div>

				<div className="relative flex items-center gap-5 p-6 rounded-xl bg-surface-raised/80 border border-border card-glow max-w-lg opacity-60 cursor-not-allowed">
					<div className="absolute top-3 right-3">
						<span className="text-[10px] text-accent font-medium px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
							Em breve
						</span>
					</div>
					<div className="relative p-3 rounded-xl bg-accent/8">
						<MapIcon size={22} className="text-accent relative z-10" />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-sm text-text mb-1">Ver todas as trilhas</h3>
						<p className="text-xs text-text-muted">Caminhos estruturados do zero ao profissional</p>
					</div>
					<ArrowRight size={16} className="text-text-faint" />
				</div>
			</section>
		</PageLayout>
	);
};
