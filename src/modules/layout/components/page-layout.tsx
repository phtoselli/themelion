import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { useIsMobile } from "@client/hooks/use-mobile";
import { AppSidebar } from "@client/modules/layout/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@client/shared/components/ui/breadcrumb";
import { Landmark, Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

export interface BreadcrumbItemData {
	label: string;
	href?: string;
}

interface PageLayoutProps {
	children: ReactNode;
	breadcrumbs?: BreadcrumbItemData[];
	fullWidth?: boolean;
}

export const PageLayout = ({ children, breadcrumbs, fullWidth = false }: PageLayoutProps) => {
	const { t } = useLocale();
	const { expanded, setMobileOpen } = useNavigation();
	const isMobile = useIsMobile();

	const marginLeft = isMobile
		? ""
		: expanded
			? "ml-[var(--spacing-sidebar-expanded)]"
			: "ml-[var(--spacing-sidebar-collapsed)]";

	return (
		<div className="min-h-screen bg-surface gradient-mesh-subtle">
			<AppSidebar />

			{/* Header mobile com hamburger */}
			{isMobile && (
				<header className="sticky top-0 z-30 glass border-b border-sidebar-border">
					<div className="flex items-center gap-3 h-14 px-4">
						<button
							type="button"
							onClick={() => setMobileOpen(true)}
							className="flex items-center justify-center rounded-lg p-2 -ml-1 text-text-muted hover:text-text hover:bg-surface-hover transition-all duration-200"
							aria-label={t.common.openMenu}
						>
							<Menu size={20} />
						</button>

						<div className="flex items-center gap-2">
							<Landmark size={16} className="text-primary" />
							<span className="font-display font-bold text-sm text-text tracking-tight">
								Themelion
							</span>
						</div>
					</div>

					{/* Breadcrumbs mobile */}
					{breadcrumbs && breadcrumbs.length > 0 && (
						<div className="px-4 pb-2.5 -mt-1">
							<Breadcrumb>
								<BreadcrumbList>
									{breadcrumbs.map((item, index) => {
										const isLast = index === breadcrumbs.length - 1;
										return (
											<BreadcrumbItem key={item.label}>
												{!isLast && item.href ? (
													<BreadcrumbLink asChild>
														<Link
															to={item.href}
															className="text-text-faint hover:text-primary transition-colors duration-200 text-xs"
														>
															{item.label}
														</Link>
													</BreadcrumbLink>
												) : (
													<BreadcrumbPage className="text-text-muted font-medium text-xs">
														{item.label}
													</BreadcrumbPage>
												)}
												{!isLast && <BreadcrumbSeparator className="text-text-faint/40" />}
											</BreadcrumbItem>
										);
									})}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					)}
				</header>
			)}

			<main className={`${marginLeft} transition-[margin] duration-300 ease-out`}>
				<div className={fullWidth ? "p-4 md:p-6 lg:p-8" : "max-w-4xl mx-auto p-4 md:p-6 lg:p-10"}>
					{/* Breadcrumbs desktop */}
					{!isMobile && breadcrumbs && breadcrumbs.length > 0 && (
						<Breadcrumb className="mb-8 animate-fade-in">
							<BreadcrumbList>
								{breadcrumbs.map((item, index) => {
									const isLast = index === breadcrumbs.length - 1;
									return (
										<BreadcrumbItem key={item.label}>
											{!isLast && item.href ? (
												<BreadcrumbLink asChild>
													<Link
														to={item.href}
														className="text-text-faint hover:text-primary transition-colors duration-200"
													>
														{item.label}
													</Link>
												</BreadcrumbLink>
											) : (
												<BreadcrumbPage className="text-text-muted font-medium">
													{item.label}
												</BreadcrumbPage>
											)}
											{!isLast && <BreadcrumbSeparator className="text-text-faint/40" />}
										</BreadcrumbItem>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
					)}
					{children}
				</div>
			</main>
		</div>
	);
};
