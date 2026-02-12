import { useLocale } from "@client/hooks/use-locale";
import { PageLayout } from "@client/modules/layout/components/page-layout";
import "@client/styles/pages/projects.css";
import { Construction, FolderKanban } from "lucide-react";

export const ProjectsPage = () => {
	const { t } = useLocale();
	const projectCount = 0;

	return (
		<PageLayout breadcrumbs={[{ label: t.common.home, href: "/" }, { label: t.nav.projects }]}>
			{/* Header */}
			<div className="projects-header">
				<div className="projects-glow" />

				<div className="projects-title-row">
					<div className="projects-icon">
						<FolderKanban size={20} />
						<div className="projects-icon-glow" />
					</div>
					<div>
						<h1 className="projects-title">{t.projectsPage.title}</h1>
						<span className="projects-meta">{t.projectsPage.availableProjects(projectCount)}</span>
					</div>
				</div>
				<p className="projects-desc">{t.projectsPage.description}</p>
			</div>

			{/* Card "Em construção" */}
			<div className="projects-construction-card card-glow animate-fade-in-up">
				<div className="projects-construction-icon">
					<Construction size={32} />
				</div>
				<h2 className="projects-construction-title">Em construção</h2>
				<p className="projects-construction-desc">
					Estamos preparando projetos práticos incríveis para você construir seu portfólio. Em
					breve, você terá acesso a desafios completos organizados por trilha de carreira.
				</p>
			</div>
		</PageLayout>
	);
};
