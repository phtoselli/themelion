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
		projects: string;
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
		logout: string;
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

	landingPage: {
		cta: string;
		heroBadge: string;
		heroHeading: string;
		heroHighlight: string;
		heroSubtitle: string;
		heroAccessNote: string;
		featuresSectionTitle: string;
		noAdsTitle: string;
		noAdsDesc: string;
		noLoginTitle: string;
		noLoginDesc: string;
		freeTitle: string;
		freeDesc: string;
		timelessTitle: string;
		timelessDesc: string;
		previewSectionTitle: string;
		previewSectionSubtitle: string;
		howItWorksTitle: string;
		step1Title: string;
		step1Desc: string;
		step2Title: string;
		step2Desc: string;
		step3Title: string;
		step3Desc: string;
		finalCtaHeading: string;
		finalCtaSubtitle: string;
		footerTagline: string;
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
		projectsTitle: string;
		viewAllProjects: string;
		projectsSubtitle: string;
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
		levelJunior: string;
		levelPleno: string;
		levelSenior: string;
	};

	roadmapPage: {
		notFound: string;
		completed: string;
		completionPercent: (percent: number) => string;
	};

	projectsPage: {
		title: string;
		description: string;
		availableProjects: (count: number) => string;
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
		rooms: "Módulos",
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
		studyRooms: "Módulos",
		roadmaps: "Trilhas",
		projects: "Projetos",
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
		logout: "Sair",
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

	landingPage: {
		cta: "Iniciar estudos",
		heroBadge: "100% gratuita & open source",
		heroHeading: "Os fundamentos que",
		heroHighlight: "não mudam.",
		heroSubtitle:
			"Aprenda conceitos de programação que transcendem qualquer framework. Sem cadastro, sem anúncios, sem custo — direto ao ponto.",
		heroAccessNote: "Acesso imediato. Sem criar conta.",
		featuresSectionTitle: "Feita para quem quer estudar de verdade",
		noAdsTitle: "Sem anúncios",
		noAdsDesc: "Zero banners, pop-ups ou rastreadores. O foco aqui é 100% no conteúdo.",
		noLoginTitle: "Sem cadastro",
		noLoginDesc: "Chegou, estudou. Sem formulários, sem email, sem senhas. Zero fricção.",
		freeTitle: "100% gratuita",
		freeDesc: "Todo o conteúdo é aberto. Sem planos premium, sem paywall, sem surpresas.",
		timelessTitle: "Conteúdo atemporal",
		timelessDesc:
			"Conceitos que não expiram. Arrays, algoritmos, arquitetura — o que você aprende aqui vale para toda a carreira.",
		previewSectionTitle: "Uma plataforma pensada para programadores",
		previewSectionSubtitle:
			"Conteúdo técnico com exemplos em 5 linguagens. Cada tópico vai do conceito à implementação.",
		howItWorksTitle: "Como funciona",
		step1Title: "Escolha um módulo",
		step1Desc:
			"+10 módulos organizados por área: fundamentos, frontend, backend, banco de dados, Cybersecurity, QA e mais.",
		step2Title: "Estude com exemplos reais",
		step2Desc:
			"Cada tópico tem explicações diretas com exemplos em Python, TypeScript, C#, Go e Rust.",
		step3Title: "Acompanhe seu progresso",
		step3Desc: "Marque tópicos como concluídos e siga trilhas de carreira estruturadas.",
		finalCtaHeading: "Comece agora.",
		finalCtaSubtitle: "É grátis. É direto. É para sempre.",
		footerTagline: "θεμέλιον — fundação",
	},

	homePage: {
		badge: "Fundamentos Atemporais",
		heading: "Aprenda os fundamentos que",
		headingHighlight: "não mudam",
		subtitle:
			'Themelion (do grego θεμέλιον, "alicerce" ou "fundação") — é como os templos gregos que resistem ao tempo, aprenda conceitos de programação que transcendem qualquer framework.',
		studyRoomsTitle: "Módulos",
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
		projectsTitle: "Projetos",
		viewAllProjects: "Ver todos os projetos",
		projectsSubtitle: "Projetos práticos para construir seu portfólio",
	},

	roomsPage: {
		title: "Módulos",
		description:
			"Cada módulo agrupa tópicos por área de conhecimento. Escolha um módulo para explorar seus conteúdos e começar a aprender.",
	},

	roomPage: {
		notFound: "Módulo não encontrado",
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
		levelJunior: "Júnior",
		levelPleno: "Pleno",
		levelSenior: "Sênior",
	},

	roadmapPage: {
		notFound: "Roadmap não encontrado",
		completed: "Concluído",
		completionPercent: (percent: number) => `${percent}% concluído`,
	},

	projectsPage: {
		title: "Projetos",
		description:
			"Projetos práticos organizados por trilha de carreira para você construir um portfólio sólido. Cada projeto aplica conceitos fundamentais e pode ser implementado em múltiplas linguagens.",
		availableProjects: (count: number) =>
			`${count} ${count === 1 ? "projeto" : "projetos"} disponíveis`,
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
