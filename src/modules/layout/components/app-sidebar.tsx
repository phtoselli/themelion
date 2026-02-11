import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { useIsMobile } from "@client/hooks/use-mobile";
import { useTheme } from "@client/hooks/use-theme";
import { exportProgress, importProgress } from "@client/lib/progress";
import { Sheet, SheetContent } from "@client/shared/components/ui/sheet";
import { getNavItems } from "@client/shared/constants/navigation";
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Landmark,
	Moon,
	Settings,
	Sun,
	Upload,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

export const AppSidebar = () => {
	const { t } = useLocale();
	const navItems = getNavItems(t);
	const { theme, toggleTheme } = useTheme();
	const { expanded, toggleExpanded, activeSection, setActiveSection, mobileOpen, setMobileOpen } =
		useNavigation();
	const isMobile = useIsMobile();
	const { pathname } = useLocation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [importStatus, setImportStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const handleExport = useCallback(() => {
		exportProgress();
	}, []);

	const handleImportClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			try {
				const { imported } = await importProgress(file);
				setImportStatus({
					type: "success",
					message: t.sidebar.importSuccess(imported),
				});
			} catch (err) {
				setImportStatus({
					type: "error",
					message: err instanceof Error ? err.message : t.sidebar.importError,
				});
			}

			// Limpa o input pra permitir reimportar o mesmo arquivo
			e.target.value = "";

			setTimeout(() => setImportStatus(null), 4000);
		},
		[t],
	);

	useEffect(() => {
		if (pathname === "/") setActiveSection("home");
		else if (
			pathname === "/rooms" ||
			pathname.startsWith("/room/") ||
			pathname.startsWith("/topic/")
		)
			setActiveSection("rooms");
		else if (pathname.startsWith("/roadmap")) setActiveSection("roadmaps");
	}, [pathname, setActiveSection]);

	// Callback para fechar o drawer mobile ao navegar
	const closeMobileDrawer = useCallback(() => {
		if (isMobile) setMobileOpen(false);
	}, [isMobile, setMobileOpen]);

	// Conteudo da sidebar (compartilhado entre desktop e mobile)
	const sidebarContent = (
		<>
			{/* Logo */}
			<div className="shrink-0 h-14 flex items-center gap-3 px-4 border-b border-sidebar-border">
				<div className="relative">
					<Landmark size={20} className="text-primary shrink-0 relative z-10" />
					<div className="absolute -inset-1 bg-primary/10 rounded-lg blur-sm" />
				</div>
				{(isMobile || expanded) && (
					<span className="font-display font-bold text-sm text-text tracking-tight whitespace-nowrap">
						Themelion
					</span>
				)}
				{isMobile ? (
					<button
						type="button"
						onClick={() => setMobileOpen(false)}
						className="ml-auto flex items-center justify-center rounded-lg p-1.5 text-text-faint hover:text-text hover:bg-surface-hover transition-all duration-200"
						title={t.common.closeMenu}
					>
						<X size={18} />
					</button>
				) : (
					<button
						type="button"
						onClick={toggleExpanded}
						className={`${expanded ? "ml-auto" : ""} flex items-center justify-center rounded-lg p-1.5 text-text-faint hover:text-text hover:bg-surface-hover transition-all duration-200`}
						title={expanded ? t.sidebar.collapse : t.sidebar.expand}
					>
						{expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
					</button>
				)}
			</div>

			{/* Navegacao principal */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-1">
				{navItems.map((item) => {
					const isActive = activeSection === item.id;
					const Icon = item.icon;
					const showLabels = isMobile || expanded;

					return (
						<Link
							key={item.id}
							to={item.href}
							onClick={() => {
								setActiveSection(item.id);
								closeMobileDrawer();
							}}
							className={`group flex items-center gap-3 rounded-lg transition-all duration-200 ${
								showLabels ? "px-3 py-2.5" : "px-0 py-2 justify-center"
							} ${
								isActive
									? "bg-primary/8 text-primary sidebar-active-indicator"
									: "text-text-muted hover:text-text hover:bg-surface-hover"
							}`}
							title={showLabels ? undefined : item.label}
						>
							<Icon size={18} className="shrink-0" />
							{showLabels && <span className="text-sm font-medium truncate">{item.label}</span>}
						</Link>
					);
				})}
			</nav>

			{/* Configuracoes */}
			<div className="shrink-0 border-t border-sidebar-border px-2.5 py-3 relative">
				<button
					type="button"
					onClick={() => {
						if (!isMobile && !expanded) toggleExpanded();
						setSettingsOpen((prev) => !prev);
					}}
					className={`group flex items-center gap-3 w-full rounded-lg transition-all duration-200 ${
						isMobile || expanded ? "px-3 py-2.5" : "px-0 py-2 justify-center"
					} ${
						settingsOpen
							? "bg-primary/8 text-primary"
							: "text-text-muted hover:text-text hover:bg-surface-hover"
					}`}
					title={isMobile || expanded ? undefined : t.sidebar.settings}
				>
					<Settings size={18} className="shrink-0" />
					{(isMobile || expanded) && (
						<span className="text-sm font-medium truncate">{t.sidebar.settings}</span>
					)}
				</button>

				{(isMobile || expanded) && settingsOpen && (
					<div className="mt-2 space-y-1 animate-fade-in">
						<button
							type="button"
							onClick={toggleTheme}
							className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-text-muted hover:text-text hover:bg-surface-hover transition-all duration-200"
							title={theme === "dark" ? t.sidebar.lightMode : t.sidebar.darkMode}
						>
							{theme === "dark" ? (
								<Sun size={16} className="shrink-0" />
							) : (
								<Moon size={16} className="shrink-0" />
							)}
							<span className="text-sm truncate">
								{theme === "dark" ? t.sidebar.lightMode : t.sidebar.darkMode}
							</span>
						</button>

						<button
							type="button"
							onClick={handleExport}
							className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-text-muted hover:text-text hover:bg-surface-hover transition-all duration-200"
						>
							<Download size={16} className="shrink-0" />
							<span className="text-sm truncate">{t.sidebar.downloadProgress}</span>
						</button>

						<button
							type="button"
							onClick={handleImportClick}
							className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-text-muted hover:text-text hover:bg-surface-hover transition-all duration-200"
						>
							<Upload size={16} className="shrink-0" />
							<span className="text-sm truncate">{t.sidebar.uploadProgress}</span>
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept=".json"
							onChange={handleFileChange}
							className="hidden"
						/>

						{importStatus && (
							<p
								className={`text-xs px-3 py-1.5 rounded-md ${
									importStatus.type === "success"
										? "text-beginner bg-beginner/10"
										: "text-advanced bg-advanced/10"
								}`}
							>
								{importStatus.message}
							</p>
						)}
					</div>
				)}
			</div>
		</>
	);

	// Mobile: usa Sheet como drawer
	if (isMobile) {
		return (
			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetContent
					side="left"
					showCloseButton={false}
					className="w-[280px] p-0 bg-sidebar border-sidebar-border flex flex-col"
				>
					{sidebarContent}
				</SheetContent>
			</Sheet>
		);
	}

	// Desktop: sidebar fixa
	const sidebarWidth = expanded
		? "w-[var(--spacing-sidebar-expanded)]"
		: "w-[var(--spacing-sidebar-collapsed)]";

	return (
		<aside
			className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} glass border-r border-sidebar-border flex flex-col transition-[width] duration-300 ease-out overflow-hidden`}
		>
			{sidebarContent}
		</aside>
	);
};
