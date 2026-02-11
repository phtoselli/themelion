import { useLocale } from "@client/hooks/use-locale";
import { useTheme } from "@client/hooks/use-theme";
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

// Classe de transição reutilizável
const revealClass = (visible: boolean) =>
	`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;

// Mockup do produto renderizado em CSS
const ProductMockup = () => (
	<div className="relative w-full max-w-4xl mx-auto">
		{/* Glow atrás do mockup */}
		<div className="absolute -inset-8 bg-primary/[0.04] blur-[60px] rounded-full pointer-events-none" />

		<div className="relative rounded-xl border border-border overflow-hidden bg-surface shadow-2xl shadow-black/30">
			{/* Barra do navegador */}
			<div className="flex items-center gap-2 px-4 py-3 bg-surface-raised/80 border-b border-border">
				<div className="flex gap-1.5">
					<div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
					<div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
					<div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
				</div>
				<div className="flex-1 flex justify-center">
					<div className="px-4 py-1 rounded-md bg-surface-light/60 text-[10px] text-text-faint font-mono">
						themelion.dev/topic/arrays
					</div>
				</div>
				<div className="w-12" />
			</div>

			{/* Conteúdo do app */}
			<div className="flex min-h-[300px] md:min-h-[360px]">
				{/* Sidebar mockup */}
				<div className="hidden sm:flex flex-col w-14 bg-surface-raised/60 border-r border-border py-4 gap-1 items-center shrink-0">
					<div className="p-2 mb-3">
						<Landmark size={16} className="text-primary" />
					</div>
					<div className="p-2 rounded-lg text-text-faint">
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
					<div className="p-2 rounded-lg bg-primary/10 text-primary">
						<BookOpen size={14} />
					</div>
					<div className="p-2 rounded-lg text-text-faint">
						<MapIcon size={14} />
					</div>
				</div>

				{/* Área de conteúdo */}
				<div className="flex-1 p-4 md:p-6 overflow-hidden">
					{/* Breadcrumb */}
					<div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-text-faint mb-3 md:mb-4">
						<span>Fundamentos</span>
						<span className="opacity-40">/</span>
						<span>Estruturas de Dados</span>
						<span className="opacity-40">/</span>
						<span className="text-text-muted">Arrays</span>
					</div>

					{/* Título + badge */}
					<div className="flex items-center gap-2.5 mb-4 md:mb-5">
						<span className="font-display font-bold text-sm md:text-base text-text">
							Arrays e Strings
						</span>
						<span className="text-[8px] md:text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-beginner/10 text-beginner border border-beginner/20">
							Iniciante
						</span>
					</div>

					{/* Code tabs */}
					<div className="rounded-lg border border-border overflow-hidden bg-surface-raised/40">
						<div className="flex border-b border-border text-[10px] md:text-[11px]">
							<div className="px-3 py-1.5 font-medium text-primary border-b border-primary bg-primary/5">
								Python
							</div>
							<div className="px-3 py-1.5 font-medium text-text-faint">TypeScript</div>
							<div className="px-3 py-1.5 font-medium text-text-faint hidden sm:block">C#</div>
							<div className="px-3 py-1.5 font-medium text-text-faint hidden md:block">Go</div>
							<div className="px-3 py-1.5 font-medium text-text-faint hidden md:block">Rust</div>
						</div>

						<div className="p-3 md:p-4 font-mono text-[10px] md:text-[11px] leading-[1.7] select-none">
							<div>
								<span className="text-text-faint"># Criando e manipulando arrays</span>
							</div>
							<div>
								<span className="text-text">nums</span> <span className="text-primary">=</span>{" "}
								<span className="text-accent">[1, 2, 3, 4, 5]</span>
							</div>
							<div className="h-2.5" />
							<div>
								<span className="text-text-faint"># Acesso O(1) por índice</span>
							</div>
							<div>
								<span className="text-text">primeiro</span> <span className="text-primary">=</span>{" "}
								<span className="text-text">nums</span>
								<span className="text-accent">[0]</span>
								{"    "}
								<span className="text-text-faint"># 1</span>
							</div>
							<div>
								<span className="text-text">ultimo</span>
								{"  "}
								<span className="text-primary">=</span> <span className="text-text">nums</span>
								<span className="text-accent">[-1]</span>
								{"   "}
								<span className="text-text-faint"># 5</span>
							</div>
							<div className="h-2.5" />
							<div>
								<span className="text-text-faint"># Inserção: O(1) amortizado</span>
							</div>
							<div>
								<span className="text-text">nums</span>
								<span className="text-primary">.</span>
								<span className="text-text">append</span>
								<span className="text-accent">(6)</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

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
		<div className="min-h-screen bg-surface text-text overflow-x-hidden">
			{/* ── Nav ── */}
			<nav
				className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
					scrolled ? "glass border-b border-border" : ""
				}`}
			>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<div className="relative">
							<Landmark size={20} className="text-primary relative z-10" />
							<div className="absolute -inset-1 bg-primary/10 rounded-lg blur-sm" />
						</div>
						<span className="font-display font-bold text-sm tracking-tight">Themelion</span>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={toggleTheme}
							className="p-2 rounded-lg text-text-faint hover:text-text hover:bg-surface-hover transition-all duration-200"
							aria-label={theme === "dark" ? t.sidebar.lightMode : t.sidebar.darkMode}
						>
							{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
						</button>
						<Link
							to="/home"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md shadow-primary/15"
						>
							{t.landingPage.cta}
							<ArrowRight size={14} />
						</Link>
					</div>
				</div>
			</nav>

			{/* ── Hero ── */}
			<section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 landing-hero-gradient">
				{/* Theta decorativo */}
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] sm:text-[28rem] md:text-[36rem] font-serif text-primary/[0.025] select-none pointer-events-none leading-none"
					aria-hidden="true"
				>
					θ
				</div>

				<div className="relative max-w-3xl mx-auto text-center animate-fade-in-up">
					{/* Pill badge */}
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-8">
						<span
							className="w-1.5 h-1.5 rounded-full bg-primary"
							style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
						/>
						<span className="text-[10px] sm:text-xs text-primary font-medium tracking-widest uppercase">
							{t.landingPage.heroBadge}
						</span>
					</div>

					{/* Heading */}
					<h1 className="font-display text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
						{t.landingPage.heroHeading}{" "}
						<span className="text-primary">{t.landingPage.heroHighlight}</span>
					</h1>

					{/* Subtitle */}
					<p className="text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10">
						{t.landingPage.heroSubtitle}
					</p>

					{/* CTA */}
					<Link
						to="/home"
						className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
					>
						{t.landingPage.cta}
						<ArrowRight size={18} />
					</Link>

					<p className="mt-4 text-xs text-text-faint">{t.landingPage.heroAccessNote}</p>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in stagger-6">
					<div className="w-5 h-8 rounded-full border border-border flex justify-center pt-1.5">
						<div
							className="w-1 h-2 rounded-full bg-text-faint"
							style={{
								animation: "scroll-hint 2s ease-in-out infinite",
							}}
						/>
					</div>
				</div>
			</section>

			{/* ── Features / Value Props ── */}
			<section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
				<div ref={features.ref} className={`max-w-5xl mx-auto ${revealClass(features.visible)}`}>
					<h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
						{t.landingPage.featuresSectionTitle}
					</h2>
					<div className="w-12 h-0.5 bg-primary/40 mx-auto mb-12 md:mb-16 rounded-full" />

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
						{featureCards.map((card, i) => {
							const Icon = card.icon;
							return (
								<div
									key={card.title}
									className="group p-5 md:p-6 rounded-xl bg-surface-raised/60 border border-border hover:border-primary/20 transition-all duration-300"
									style={{
										transitionDelay: features.visible ? `${i * 80}ms` : "0ms",
										opacity: features.visible ? 1 : 0,
										transform: features.visible ? "translateY(0)" : "translateY(12px)",
									}}
								>
									<div className="flex items-start gap-4">
										<div className="p-2.5 rounded-lg bg-primary/8 shrink-0">
											<Icon size={18} className="text-primary" />
										</div>
										<div>
											<h3 className="font-display font-bold text-sm md:text-base mb-1.5">
												{card.title}
											</h3>
											<p className="text-sm text-text-muted leading-relaxed">{card.desc}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ── Product Preview ── */}
			<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 landing-hero-gradient">
				<div ref={preview.ref} className={`max-w-5xl mx-auto ${revealClass(preview.visible)}`}>
					<div className="text-center mb-10 md:mb-14">
						<h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
							{t.landingPage.previewSectionTitle}
						</h2>
						<p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
							{t.landingPage.previewSectionSubtitle}
						</p>
					</div>

					<ProductMockup />
				</div>
			</section>

			{/* ── How It Works ── */}
			<section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
				<div
					ref={howItWorks.ref}
					className={`max-w-4xl mx-auto ${revealClass(howItWorks.visible)}`}
				>
					<h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
						{t.landingPage.howItWorksTitle}
					</h2>
					<div className="w-12 h-0.5 bg-primary/40 mx-auto mb-12 md:mb-16 rounded-full" />

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						{steps.map((step, i) => {
							return (
								<div
									key={step.num}
									className="relative text-center md:text-left"
									style={{
										transitionDelay: howItWorks.visible ? `${i * 120}ms` : "0ms",
										opacity: howItWorks.visible ? 1 : 0,
										transform: howItWorks.visible ? "translateY(0)" : "translateY(12px)",
										transition: "all 0.6s ease-out",
									}}
								>
									<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/8 border border-primary/15 mb-4">
										<span className="font-mono text-xs font-bold text-primary">{step.num}</span>
									</div>
									<h3 className="font-display font-bold text-base md:text-lg mb-2">{step.title}</h3>
									<p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ── Final CTA ── */}
			<section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
				<div
					ref={finalCta.ref}
					className={`max-w-2xl mx-auto text-center ${revealClass(finalCta.visible)}`}
				>
					<h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
						{t.landingPage.finalCtaHeading}
					</h2>
					<p className="text-text-muted text-base md:text-lg mb-8">
						{t.landingPage.finalCtaSubtitle}
					</p>

					<Link
						to="/home"
						className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
					>
						{t.landingPage.cta}
						<ArrowRight size={18} />
					</Link>

					<p className="mt-4 text-xs text-text-faint">{t.landingPage.heroAccessNote}</p>
				</div>
			</section>

			{/* ── Footer ── */}
			<footer className="border-t border-border py-6 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-faint">
					<div className="flex items-center gap-2">
						<Landmark size={14} className="text-primary" />
						<span className="font-display font-bold text-sm tracking-tight text-text">
							Themelion
						</span>
					</div>
					<p>
						Feito com 💛 por{" "}
						<a
							href="https://pedrotoselli.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-primary-dark transition-colors duration-200 underline underline-offset-2"
						>
							Pedro Toselli
						</a>
					</p>
					<p className="italic">© 2026 θεμέλιον — Todos os direitos reservados</p>
				</div>
			</footer>
		</div>
	);
};
