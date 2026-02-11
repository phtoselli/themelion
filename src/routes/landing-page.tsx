import { useLocale } from "@client/hooks/use-locale";
import { useTheme } from "@client/hooks/use-theme";
import { PillBadge } from "@client/shared/components/pill-badge";
import "@client/styles/pages/landing.css";
import {
	ArrowRight,
	BookOpen,
	Heart,
	Infinity as InfinityIcon,
	Landmark,
	Map as MapIcon,
	Moon,
	ShieldCheck,
	Sun,
	Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

// Hook para revelar seções ao entrar na viewport
const useReveal = (threshold = 0.12) => {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					obs.disconnect();
				}
			},
			{ threshold },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, [threshold]);

	return { ref, visible };
};

// Conteúdo de código para cada linguagem
const codeExamples = {
	python: [
		{ type: "comment", content: "# Criando e manipulando arrays" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: " = " },
				{ type: "val", content: "[1, 2, 3, 4, 5]" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "# Acesso O(1) por índice" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "primeiro" },
				{ type: "op", content: " = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[0]" },
				{ type: "text", content: "    " },
				{ type: "comment", content: "# 1" },
			],
		},
		{
			type: "code",
			parts: [
				{ type: "text", content: "ultimo" },
				{ type: "op", content: "  = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[-1]" },
				{ type: "text", content: "   " },
				{ type: "comment", content: "# 5" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "# Inserção: O(1) amortizado" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: "." },
				{ type: "text", content: "append" },
				{ type: "val", content: "(6)" },
			],
		},
	],
	typescript: [
		{ type: "comment", content: "// Criando e manipulando arrays" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "const" },
				{ type: "text", content: " nums" },
				{ type: "op", content: ": " },
				{ type: "text", content: "number" },
				{ type: "val", content: "[]" },
				{ type: "op", content: " = " },
				{ type: "val", content: "[1, 2, 3, 4, 5]" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Acesso O(1) por índice" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "const" },
				{ type: "text", content: " primeiro" },
				{ type: "op", content: " = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[0]" },
				{ type: "text", content: "         " },
				{ type: "comment", content: "// 1" },
			],
		},
		{
			type: "code",
			parts: [
				{ type: "text", content: "const" },
				{ type: "text", content: " ultimo" },
				{ type: "op", content: "   = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[nums.length - 1]" },
				{ type: "text", content: " " },
				{ type: "comment", content: "// 5" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Inserção: O(1) amortizado" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: "." },
				{ type: "text", content: "push" },
				{ type: "val", content: "(6)" },
			],
		},
	],
	csharp: [
		{ type: "comment", content: "// Criando e manipulando arrays" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "List" },
				{ type: "op", content: "<" },
				{ type: "text", content: "int" },
				{ type: "op", content: "> " },
				{ type: "text", content: "nums" },
				{ type: "op", content: " = " },
				{ type: "text", content: "new" },
				{ type: "val", content: " { 1, 2, 3, 4, 5 }" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Acesso O(1) por índice" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "int" },
				{ type: "text", content: " primeiro" },
				{ type: "op", content: " = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[0]" },
				{ type: "text", content: "            " },
				{ type: "comment", content: "// 1" },
			],
		},
		{
			type: "code",
			parts: [
				{ type: "text", content: "int" },
				{ type: "text", content: " ultimo" },
				{ type: "op", content: "   = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[nums.Count - 1]" },
				{ type: "text", content: "  " },
				{ type: "comment", content: "// 5" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Inserção: O(1) amortizado" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: "." },
				{ type: "text", content: "Add" },
				{ type: "val", content: "(6)" },
			],
		},
	],
	go: [
		{ type: "comment", content: "// Criando e manipulando slices" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: " := " },
				{ type: "val", content: "[]int{1, 2, 3, 4, 5}" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Acesso O(1) por índice" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "primeiro" },
				{ type: "op", content: " := " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[0]" },
				{ type: "text", content: "              " },
				{ type: "comment", content: "// 1" },
			],
		},
		{
			type: "code",
			parts: [
				{ type: "text", content: "ultimo" },
				{ type: "op", content: "   := " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[len(nums) - 1]" },
				{ type: "text", content: "  " },
				{ type: "comment", content: "// 5" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Inserção: O(1) amortizado" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: " = " },
				{ type: "text", content: "append" },
				{ type: "val", content: "(nums, 6)" },
			],
		},
	],
	rust: [
		{ type: "comment", content: "// Criando e manipulando vectors" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "let" },
				{ type: "text", content: " mut" },
				{ type: "text", content: " nums" },
				{ type: "op", content: " = " },
				{ type: "text", content: "vec!" },
				{ type: "val", content: "[1, 2, 3, 4, 5]" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Acesso O(1) por índice" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "let" },
				{ type: "text", content: " primeiro" },
				{ type: "op", content: " = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[0]" },
				{ type: "text", content: "              " },
				{ type: "comment", content: "// 1" },
			],
		},
		{
			type: "code",
			parts: [
				{ type: "text", content: "let" },
				{ type: "text", content: " ultimo" },
				{ type: "op", content: "   = " },
				{ type: "text", content: "nums" },
				{ type: "val", content: "[nums.len() - 1]" },
				{ type: "text", content: "  " },
				{ type: "comment", content: "// 5" },
			],
		},
		{ type: "spacer" },
		{ type: "comment", content: "// Inserção: O(1) amortizado" },
		{
			type: "code",
			parts: [
				{ type: "text", content: "nums" },
				{ type: "op", content: "." },
				{ type: "text", content: "push" },
				{ type: "val", content: "(6)" },
			],
		},
	],
};

type Language = keyof typeof codeExamples;

// Mockup do produto renderizado em CSS
const ProductMockup = () => {
	const [activeLang, setActiveLang] = useState<Language>("python");

	const languages: { id: Language; label: string; hideOn?: "sm" | "md" }[] = [
		{ id: "python", label: "Python" },
		{ id: "typescript", label: "TypeScript" },
		{ id: "csharp", label: "C#", hideOn: "sm" },
		{ id: "go", label: "Go", hideOn: "md" },
		{ id: "rust", label: "Rust", hideOn: "md" },
	];

	const currentCode = codeExamples[activeLang];

	return (
		<div className="mockup-wrapper">
			{/* Glow atrás do mockup */}
			<div className="mockup-glow" />

			<div className="mockup-frame">
				{/* Barra do navegador */}
				<div className="mockup-titlebar">
					<div className="mockup-dots">
						<div className="mockup-dot mockup-dot-red" />
						<div className="mockup-dot mockup-dot-yellow" />
						<div className="mockup-dot mockup-dot-green" />
					</div>
					<div className="mockup-urlbar">
						<div className="mockup-url">themelion.dev/topic/arrays</div>
					</div>
					<div style={{ width: "3rem" }} />
				</div>

				{/* Conteúdo do app */}
				<div className="mockup-body">
					{/* Sidebar mockup */}
					<div className="mockup-sidebar">
						<div className="mockup-sidebar-logo">
							<Landmark size={16} />
						</div>
						<div className="mockup-sidebar-icon">
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Home</title>
								<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
								<polyline points="9 22 9 12 15 12 15 22" />
							</svg>
						</div>
						<div className="mockup-sidebar-icon" data-active="true">
							<BookOpen size={14} />
						</div>
						<div className="mockup-sidebar-icon">
							<MapIcon size={14} />
						</div>
					</div>

					{/* Área de conteúdo */}
					<div className="mockup-content">
						{/* Breadcrumb */}
						<div className="mockup-breadcrumb">
							<span>Fundamentos</span>
							<span className="mockup-breadcrumb-sep">/</span>
							<span>Estruturas de Dados</span>
							<span className="mockup-breadcrumb-sep">/</span>
							<span className="mockup-breadcrumb-current">Arrays</span>
						</div>

						{/* Título + badge */}
						<div className="mockup-title-row">
							<span className="mockup-title">Arrays e Strings</span>
							<span className="mockup-badge">Iniciante</span>
						</div>

						{/* Code tabs */}
						<div className="mockup-code-block">
							<div className="mockup-code-tabs">
								{languages.map((lang) => (
									<button
										key={lang.id}
										type="button"
										onClick={() => setActiveLang(lang.id)}
										className={`mockup-code-tab ${
											lang.hideOn === "sm"
												? "mockup-code-tab-hidden-sm"
												: lang.hideOn === "md"
													? "mockup-code-tab-hidden-md"
													: ""
										}`}
										data-active={activeLang === lang.id}
									>
										{lang.label}
									</button>
								))}
							</div>

							<div className="mockup-code-body">
								{currentCode.map((line, idx) => {
									if (line.type === "spacer") {
										return <div key={`spacer-${idx}`} className="mockup-code-spacer" />;
									}

									if (line.type === "comment") {
										return (
											<div key={idx}>
												<span className="mockup-code-comment">{line.content}</span>
											</div>
										);
									}

									if (line.type === "code") {
										return (
											<div key={idx}>
												{line.parts.map((part, partIdx) => {
													if (part.type === "comment") {
														return (
															<span key={partIdx} className="mockup-code-comment">
																{part.content}
															</span>
														);
													}
													if (part.type === "op") {
														return (
															<span key={partIdx} className="mockup-code-op">
																{part.content}
															</span>
														);
													}
													if (part.type === "val") {
														return (
															<span key={partIdx} className="mockup-code-val">
																{part.content}
															</span>
														);
													}
													return (
														<span key={partIdx} className="mockup-code-text">
															{part.content}
														</span>
													);
												})}
											</div>
										);
									}

									return null;
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const LandingPage = () => {
	const { t } = useLocale();
	const { theme, toggleTheme } = useTheme();
	const [scrolled, setScrolled] = useState(false);

	// Detecta scroll para glass nav
	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Seções com reveal ao scroll
	const features = useReveal();
	const preview = useReveal();
	const howItWorks = useReveal();
	const finalCta = useReveal();

	const featureCards = [
		{
			icon: ShieldCheck,
			title: t.landingPage.noAdsTitle,
			desc: t.landingPage.noAdsDesc,
		},
		{
			icon: Zap,
			title: t.landingPage.noLoginTitle,
			desc: t.landingPage.noLoginDesc,
		},
		{
			icon: Heart,
			title: t.landingPage.freeTitle,
			desc: t.landingPage.freeDesc,
		},
		{
			icon: InfinityIcon,
			title: t.landingPage.timelessTitle,
			desc: t.landingPage.timelessDesc,
		},
	];

	const steps = [
		{ num: "01", title: t.landingPage.step1Title, desc: t.landingPage.step1Desc },
		{ num: "02", title: t.landingPage.step2Title, desc: t.landingPage.step2Desc },
		{ num: "03", title: t.landingPage.step3Title, desc: t.landingPage.step3Desc },
	];

	return (
		<div className="landing">
			{/* ── Nav ── */}
			<nav className="landing-nav" data-scrolled={scrolled}>
				<div className="landing-nav-inner">
					<div className="landing-nav-logo">
						<div className="landing-nav-logo-icon">
							<Landmark size={20} />
							<div className="landing-nav-logo-glow" />
						</div>
						<span className="landing-nav-logo-text">Themelion</span>
					</div>

					<div className="landing-nav-actions">
						<button
							type="button"
							onClick={toggleTheme}
							className="landing-theme-toggle"
							aria-label={theme === "dark" ? t.sidebar.lightMode : t.sidebar.darkMode}
						>
							{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
						</button>
						<Link to="/home" className="landing-cta-btn">
							{t.landingPage.cta}
							<ArrowRight size={14} />
						</Link>
					</div>
				</div>
			</nav>

			{/* ── Hero ── */}
			<section className="landing-hero landing-hero-gradient">
				{/* Theta decorativo */}
				<div className="landing-hero-theta" aria-hidden="true">
					θ
				</div>

				<div className="landing-hero-content">
					{/* Pill badge */}
					<div style={{ marginBottom: "2rem" }}>
						<PillBadge>{t.landingPage.heroBadge}</PillBadge>
					</div>

					{/* Heading */}
					<h1 className="landing-heading">
						{t.landingPage.heroHeading}{" "}
						<span className="landing-heading-highlight">{t.landingPage.heroHighlight}</span>
					</h1>

					{/* Subtitle */}
					<p className="landing-subtitle">{t.landingPage.heroSubtitle}</p>

					{/* CTA */}
					<Link to="/home" className="landing-cta-btn-hero">
						{t.landingPage.cta}
						<ArrowRight size={18} />
					</Link>

					<p className="landing-access-note">{t.landingPage.heroAccessNote}</p>
				</div>

				{/* Scroll indicator */}
				<div className="landing-scroll-indicator">
					<div className="landing-scroll-pill">
						<div
							className="landing-scroll-dot"
							style={{
								animation: "scroll-hint 2s ease-in-out infinite",
							}}
						/>
					</div>
				</div>
			</section>

			{/* ── Features / Value Props ── */}
			<section className="landing-section">
				<div
					ref={features.ref}
					className="landing-section-inner landing-reveal"
					data-visible={features.visible}
				>
					<h2 className="landing-section-title">{t.landingPage.featuresSectionTitle}</h2>
					<div className="landing-section-divider" />

					<div className="landing-features-grid">
						{featureCards.map((card, i) => {
							const Icon = card.icon;
							return (
								<div
									key={card.title}
									className="landing-feature-card"
									style={{
										transitionDelay: features.visible ? `${i * 80}ms` : "0ms",
										opacity: features.visible ? 1 : 0,
										transform: features.visible ? "translateY(0)" : "translateY(12px)",
									}}
								>
									<div className="landing-feature-card-inner">
										<div className="landing-feature-icon">
											<Icon size={18} />
										</div>
										<div>
											<h3 className="landing-feature-title">{card.title}</h3>
											<p className="landing-feature-desc">{card.desc}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ── Product Preview ── */}
			<section className="landing-section landing-hero-gradient">
				<div
					ref={preview.ref}
					className="landing-section-inner landing-reveal"
					data-visible={preview.visible}
				>
					<div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
						<h2 className="landing-section-title" style={{ marginBottom: "0.75rem" }}>
							{t.landingPage.previewSectionTitle}
						</h2>
						<p className="landing-section-subtitle">{t.landingPage.previewSectionSubtitle}</p>
					</div>

					<ProductMockup />
				</div>
			</section>

			{/* ── How It Works ── */}
			<section className="landing-section">
				<div
					ref={howItWorks.ref}
					className="landing-section-inner-narrow landing-reveal"
					data-visible={howItWorks.visible}
				>
					<h2 className="landing-section-title">{t.landingPage.howItWorksTitle}</h2>
					<div className="landing-section-divider" />

					<div className="landing-steps-grid">
						{steps.map((step, i) => {
							return (
								<div
									key={step.num}
									className="landing-step"
									style={{
										transitionDelay: howItWorks.visible ? `${i * 120}ms` : "0ms",
										opacity: howItWorks.visible ? 1 : 0,
										transform: howItWorks.visible ? "translateY(0)" : "translateY(12px)",
										transition: "all 0.6s ease-out",
									}}
								>
									<div className="landing-step-num">
										<span>{step.num}</span>
									</div>
									<h3 className="landing-step-title">{step.title}</h3>
									<p className="landing-step-desc">{step.desc}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ── Final CTA ── */}
			<section className="landing-section">
				<div
					ref={finalCta.ref}
					className="landing-section-inner-cta landing-reveal"
					data-visible={finalCta.visible}
				>
					<h2 className="landing-section-title-big">{t.landingPage.finalCtaHeading}</h2>
					<p className="landing-final-subtitle">{t.landingPage.finalCtaSubtitle}</p>

					<Link to="/home" className="landing-cta-btn-hero">
						{t.landingPage.cta}
						<ArrowRight size={18} />
					</Link>

					<p className="landing-access-note">{t.landingPage.heroAccessNote}</p>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="landing-footer">
				<div className="landing-footer-inner">
					<div className="landing-footer-logo">
						<Landmark size={14} />
						<span>Themelion</span>
					</div>
					<p>
						Feito com 💛 por{" "}
						<a
							href="https://pedrotoselli.com"
							target="_blank"
							rel="noopener noreferrer"
							className="landing-footer-link"
						>
							Pedro Toselli
						</a>
					</p>
					<p style={{ fontStyle: "italic" }}>© 2026 θεμέλιον — Todos os direitos reservados</p>
				</div>
			</footer>
		</div>
	);
};
