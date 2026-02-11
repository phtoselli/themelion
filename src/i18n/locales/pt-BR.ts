export interface Locale {
	common: {
		rooms: string;
		topics: string;
		languages: string;
		categories: string;
		explore: string;
		comingSoon: string;
		home: string;
		previous: string;
		next: string;
		stages: string;
		openMenu: string;
		closeMenu: string;
	};

	nav: {
		home: string;
		studyRooms: string;
		roadmaps: string;
	};

	sidebar: {
		collapse: string;
		expand: string;
		settings: string;
		downloadProgress: string;
		uploadProgress: string;
		importSuccess: (count: number) => string;
		importError: string;
		theme: string;
		darkMode: string;
		lightMode: string;
	};

	difficulty: {
		beginner: string;
		intermediate: string;
		advanced: string;
	};

	status: {
		implemented: string;
		planned: string;
		unregistered: string;
	};

	homePage: {
		badge: string;
		heading: string;
		headingHighlight: string;
		subtitle: string;
		studyRoomsTitle: string;
		roomStats: (categories: number, topics: number) => string;
		learningModesTitle: string;
		studyMode: string;
		studyModeDescription: string;
		practiceMode: string;
		practiceModeDescription: string;
		careerTracksTitle: string;
		viewAllTracks: string;
		careerTracksSubtitle: string;
	};

	roomsPage: {
		title: string;
		description: string;
	};

	roomPage: {
		notFound: string;
	};

	topicPage: {
		notFound: string;
		prerequisites: string;
		comingSoonTitle: string;
		comingSoonDescription: string;
		mdxPlaceholder: string;
		markCompleted: string;
		completed: string;
		completedAt: (date: string) => string;
	};

	roadmapsPage: {
		title: string;
		availableTracks: (count: number) => string;
		description: string;
		stages: string;
		viewTrack: string;
	};

	roadmapPage: {
		notFound: string;
		completed: string;
		completionPercent: (percent: number) => string;
	};

	progress: {
		invalidFormat: string;
		tooManyEntries: (count: number, max: number) => string;
		dangerousKey: (key: string) => string;
		invalidSlug: (slug: string) => string;
		invalidTopicData: (key: string) => string;
		fileTooLarge: (sizeKB: string) => string;
		invalidFileType: string;
		readError: string;
		processError: string;
	};
}

export const ptBR: Locale = {
	common: {
		rooms: "Salas",
		topics: "Tópicos",
		languages: "Linguagens",
		categories: "categorias",
		explore: "Explorar",
		comingSoon: "Em breve",
		home: "Home",
		previous: "Anterior",
		next: "Próximo",
		stages: "fases",
		openMenu: "Abrir menu",
		closeMenu: "Fechar menu",
	},

	nav: {
		home: "Início",
		studyRooms: "Salas de Estudo",
		roadmaps: "Roadmaps",
	},

	sidebar: {
		collapse: "Recolher menu",
		expand: "Expandir menu",
		settings: "Configurações",
		downloadProgress: "Download do progresso",
		uploadProgress: "Upload do progresso",
		importSuccess: (count: number) =>
			`${count} tópico${count !== 1 ? "s" : ""} importado${count !== 1 ? "s" : ""}.`,
		importError: "Erro ao importar.",
		theme: "Tema",
		darkMode: "Modo escuro",
		lightMode: "Modo claro",
	},

	difficulty: {
		beginner: "Iniciante",
		intermediate: "Intermediário",
		advanced: "Avançado",
	},

	status: {
		implemented: "Disponível",
		planned: "Em breve",
		unregistered: "Não registrado",
	},

	homePage: {
		badge: "Fundamentos Atemporais",
		heading: "Aprenda os fundamentos que",
		headingHighlight: "não mudam",
		subtitle:
			'Themelion (do grego θεμέλιον, "alicerce" ou "fundação") — é como os templos gregos que resistem ao tempo, aprenda conceitos de programação que transcendem qualquer framework.',
		studyRoomsTitle: "Salas de Estudo",
		roomStats: (categories: number, topics: number) =>
			`${categories} categorias · ${topics} tópicos`,
		learningModesTitle: "Dois modos de aprender",
		studyMode: "Modo Estudo",
		studyModeDescription:
			"Conteúdo direto ao ponto com exemplos em 5 linguagens. Sem enrolação, sem frameworks — só conceitos que importam.",
		practiceMode: "Modo Prática",
		practiceModeDescription:
			"Desafios em containers Docker efêmeros com feedback de performance em tempo real. Escreva, execute, aprenda.",
		careerTracksTitle: "Trilhas de Carreira",
		viewAllTracks: "Ver todas as trilhas",
		careerTracksSubtitle: "Caminhos estruturados do zero ao profissional",
	},

	roomsPage: {
		title: "Salas de Estudo",
		description:
			"Cada sala agrupa tópicos por área de conhecimento. Escolha uma sala para explorar seus conteúdos e começar a aprender.",
	},

	roomPage: {
		notFound: "Sala não encontrada",
	},

	topicPage: {
		notFound: "Tópico não encontrado",
		prerequisites: "Antes de começar, leia:",
		comingSoonTitle: "Em Breve",
		comingSoonDescription: "Este conteúdo está sendo preparado e estará disponível em breve.",
		mdxPlaceholder: "Conteúdo MDX será renderizado aqui",
		markCompleted: "Marcar como concluído",
		completed: "Concluído",
		completedAt: (date: string) => `Concluído em ${date}`,
	},

	roadmapsPage: {
		title: "Trilhas de Carreira",
		availableTracks: (count: number) =>
			`${count} ${count === 1 ? "trilha" : "trilhas"} disponíveis`,
		description:
			"Caminhos estruturados para guiar seu aprendizado do zero ao profissional. Cada trilha conecta tópicos na ordem certa para você evoluir sem pular etapas.",
		stages: "fases",
		viewTrack: "Ver trilha",
	},

	roadmapPage: {
		notFound: "Roadmap não encontrado",
		completed: "Concluído",
		completionPercent: (percent: number) => `${percent}% concluído`,
	},

	progress: {
		invalidFormat: "Formato inválido: esperado um objeto JSON.",
		tooManyEntries: (count: number, max: number) =>
			`Arquivo contém ${count} entradas (máximo: ${max}).`,
		dangerousKey: (key: string) => `Key perigosa detectada: "${key}".`,
		invalidSlug: (slug: string) =>
			`Slug inválido: "${slug}". Apenas letras minúsculas, números e hífens.`,
		invalidTopicData: (key: string) => `Dados inválidos para o tópico "${key}".`,
		fileTooLarge: (sizeKB: string) => `Arquivo muito grande (${sizeKB}KB). Máximo: 1MB.`,
		invalidFileType: "Tipo de arquivo inválido. Envie um arquivo .json.",
		readError: "Erro ao ler o arquivo.",
		processError: "Erro ao processar o arquivo.",
	},
};
