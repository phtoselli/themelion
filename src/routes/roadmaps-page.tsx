import { roadmaps } from "virtual:content";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import { getRoomIcon } from "@client/shared/utils/helpers/room-icons";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { Link } from "react-router";

export const RoadmapsPage = () => {
	return (
		<PageLayout breadcrumbs={[{ label: "Home", href: "/" }, { label: "Roadmaps" }]}>
			{/* Header */}
			<div className="relative mb-10 animate-fade-in-up">
				<div className="absolute -top-16 -left-16 w-[300px] h-[250px] bg-accent/[0.03] rounded-full blur-[80px] pointer-events-none" />

				<div className="relative flex items-start gap-4 mb-4">
					<div className="relative p-3 rounded-xl bg-accent/8 shrink-0">
						<MapIcon size={22} className="text-accent relative z-10" />
						<div className="absolute inset-0 bg-accent/5 rounded-xl blur-sm" />
					</div>
					<div>
						<h1 className="font-display text-2xl font-bold tracking-tight">Trilhas de Carreira</h1>
						<span className="text-xs text-text-faint font-medium mt-1 block">
							{roadmaps.length} {roadmaps.length === 1 ? "trilha" : "trilhas"} disponíveis
						</span>
					</div>
				</div>
				<p className="text-text-muted text-sm leading-relaxed max-w-2xl">
					Caminhos estruturados para guiar seu aprendizado do zero ao profissional. Cada trilha
					conecta tópicos na ordem certa para você evoluir sem pular etapas.
				</p>
			</div>

			{/* Grid de roadmaps */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{roadmaps.map((roadmap, index) => {
					const Icon = getRoomIcon(roadmap.icon);
					const totalTopics = roadmap.stages.reduce((sum, s) => sum + s.topics.length, 0);

					return (
						<Link
							key={roadmap.slug}
							to={`/roadmap/${roadmap.slug}`}
							className={`group room-card card-glow flex flex-col gap-4 p-6 rounded-xl bg-surface-raised/80 border border-border hover:bg-surface-light/80 transition-all duration-300 animate-fade-in-up stagger-${index + 1}`}
						>
							<div className="flex items-center gap-3">
								<div className="relative p-2.5 rounded-lg bg-accent/8">
									<Icon size={18} className="text-accent relative z-10" />
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-display font-bold text-sm">{roadmap.name}</h3>
									<span className="text-[11px] text-text-faint">
										{roadmap.stages.length} fases · {totalTopics} tópicos
									</span>
								</div>
							</div>

							{/* Progresso visual */}
							<div className="flex gap-1">
								{roadmap.stages.map((stage) => (
									<div
										key={stage.slug}
										className="flex-1 h-1 rounded-full bg-border group-hover:bg-accent/20 transition-colors duration-500"
									/>
								))}
							</div>

							<p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
								{roadmap.description}
							</p>

							<div className="flex items-center gap-1.5 text-xs text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 mt-auto translate-x-0 group-hover:translate-x-1">
								<span className="font-medium">Ver trilha</span>
								<ArrowRight size={12} />
							</div>
						</Link>
					);
				})}
			</div>
		</PageLayout>
	);
};
