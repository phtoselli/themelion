import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { useIsMobile } from "@client/hooks/use-media-query";
import { useTheme } from "@client/hooks/use-theme";
import { exportProgress, importProgress } from "@client/lib/progress";
import { Sheet, SheetContent } from "@client/shared/components/ui/sheet";
import { getNavItems } from "@client/shared/constants/navigation";
import { ERROR_MESSAGE_DURATION } from "@client/shared/constants/timing";
import "@client/styles/layout/app-sidebar.css";
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Landmark,
	LogOut,
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
	const [importError, setImportError] = useState<string | null>(null);

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
				await importProgress(file);
				window.location.reload();
			} catch (err) {
				setImportError(err instanceof Error ? err.message : t.sidebar.importError);
				setTimeout(() => setImportError(null), ERROR_MESSAGE_DURATION);
			}

			// Limpa o input pra permitir reimportar o mesmo arquivo
			e.target.value = "";
		},
		[t],
	);

	useEffect(() => {
		if (pathname === "/home") setActiveSection("home");
		else if (
			pathname === "/rooms" ||
			pathname.startsWith("/room/") ||
			pathname.startsWith("/topic/")
		)
			setActiveSection("rooms");
		else if (pathname.startsWith("/roadmap")) setActiveSection("roadmaps");
		else if (pathname.startsWith("/projects")) setActiveSection("projects");
	}, [pathname, setActiveSection]);

	// Callback para fechar o drawer mobile ao navegar
	const closeMobileDrawer = useCallback(() => {
		if (isMobile) setMobileOpen(false);
	}, [isMobile, setMobileOpen]);

	const showLabels = isMobile || expanded;

	// Conteudo da sidebar (compartilhado entre desktop e mobile)
	const sidebarContent = (
		<>
			{/* Logo */}
			<div className="sidebar-logo">
				<div className="sidebar-logo-icon">
					<Landmark size={20} />
					<div className="sidebar-logo-glow" />
				</div>
				{showLabels && <span className="sidebar-logo-text">Themelion</span>}
				{isMobile ? (
					<button
						type="button"
						onClick={() => setMobileOpen(false)}
						className="sidebar-toggle-btn"
						data-position="end"
						title={t.common.closeMenu}
					>
						<X size={18} />
					</button>
				) : (
					<button
						type="button"
						onClick={toggleExpanded}
						className="sidebar-toggle-btn"
						data-position={expanded ? "end" : undefined}
						title={expanded ? t.sidebar.collapse : t.sidebar.expand}
					>
						{expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
					</button>
				)}
			</div>

			{/* Navegacao principal */}
			<nav className="sidebar-nav">
				{navItems.map((item) => {
					const isActive = activeSection === item.id;
					const Icon = item.icon;

					return (
						<Link
							key={item.id}
							to={item.href}
							onClick={() => {
								setActiveSection(item.id);
								closeMobileDrawer();
							}}
							className="sidebar-nav-item"
							data-expanded={showLabels}
							data-active={isActive}
							title={showLabels ? undefined : item.label}
						>
							<Icon size={18} />
							{showLabels && <span className="sidebar-nav-label">{item.label}</span>}
						</Link>
					);
				})}
			</nav>

			{/* Configuracoes */}
			<div className="sidebar-settings">
				<button
					type="button"
					onClick={() => {
						if (!isMobile && !expanded) toggleExpanded();
						setSettingsOpen((prev) => !prev);
					}}
					className="sidebar-settings-btn"
					data-expanded={showLabels}
					data-active={settingsOpen}
					title={showLabels ? undefined : t.sidebar.settings}
				>
					<Settings size={18} />
					{showLabels && <span className="sidebar-nav-label">{t.sidebar.settings}</span>}
				</button>

				{showLabels && settingsOpen && (
					<div className="sidebar-settings-panel">
						<button
							type="button"
							onClick={toggleTheme}
							className="sidebar-settings-action"
							title={theme === "dark" ? t.sidebar.lightMode : t.sidebar.darkMode}
						>
							{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
							<span>{theme === "dark" ? t.sidebar.lightMode : t.sidebar.darkMode}</span>
						</button>

						<button type="button" onClick={handleExport} className="sidebar-settings-action">
							<Download size={16} />
							<span>{t.sidebar.downloadProgress}</span>
						</button>

						<button type="button" onClick={handleImportClick} className="sidebar-settings-action">
							<Upload size={16} />
							<span>{t.sidebar.uploadProgress}</span>
						</button>

						<Link
							to="/"
							onClick={closeMobileDrawer}
							className="sidebar-settings-action sidebar-settings-action-danger"
						>
							<LogOut size={16} />
							<span>{t.sidebar.logout}</span>
						</Link>

						<input
							ref={fileInputRef}
							type="file"
							accept=".json"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>

						{importError && <p className="sidebar-import-error">{importError}</p>}
					</div>
				)}
			</div>
		</>
	);

	// Mobile: usa Sheet como drawer
	if (isMobile) {
		return (
			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetContent side="left" showCloseButton={false} className="app-sidebar-mobile">
					{sidebarContent}
				</SheetContent>
			</Sheet>
		);
	}

	// Desktop: sidebar fixa
	return (
		<aside className="app-sidebar" data-expanded={expanded}>
			{sidebarContent}
		</aside>
	);
};
