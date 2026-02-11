import { useNavigation } from "@client/contexts/navigation-context";
import { useLocale } from "@client/hooks/use-locale";
import { useIsMobile } from "@client/hooks/use-media-query";
import { AppSidebar } from "@client/modules/layout/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@client/shared/components/ui/breadcrumb";
import "@client/styles/layout/page-layout.css";
import { Landmark, Menu } from "lucide-react";
import { Fragment, type ReactNode } from "react";
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
		? undefined
		: expanded
			? "var(--spacing-sidebar-expanded)"
			: "var(--spacing-sidebar-collapsed)";

	return (
		<div className="page-layout gradient-mesh-subtle">
			<AppSidebar />

			{/* Header mobile com hamburger */}
			{isMobile && (
				<header className="page-header-mobile">
					<div className="page-header-mobile-inner">
						<button
							type="button"
							onClick={() => setMobileOpen(true)}
							className="page-header-hamburger"
							aria-label={t.common.openMenu}
						>
							<Menu size={20} />
						</button>

						<div className="page-header-logo">
							<Landmark size={16} />
							<span>Themelion</span>
						</div>
					</div>

					{/* Breadcrumbs mobile */}
					{breadcrumbs && breadcrumbs.length > 0 && (
						<div className="page-header-breadcrumbs">
							<Breadcrumb>
								<BreadcrumbList>
									{breadcrumbs.map((item, index) => {
										const isLast = index === breadcrumbs.length - 1;
										return (
											<Fragment key={item.label}>
												<BreadcrumbItem>
													{!isLast && item.href ? (
														<BreadcrumbLink asChild>
															<Link
																to={item.href}
																className="breadcrumb-link breadcrumb-link-mobile"
															>
																{item.label}
															</Link>
														</BreadcrumbLink>
													) : (
														<BreadcrumbPage className="breadcrumb-current breadcrumb-current-mobile">
															{item.label}
														</BreadcrumbPage>
													)}
												</BreadcrumbItem>
												{!isLast && <BreadcrumbSeparator className="breadcrumb-sep" />}
											</Fragment>
										);
									})}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					)}
				</header>
			)}

			<main className="page-main" style={{ marginLeft }}>
				<div className="page-main-inner" data-full-width={fullWidth}>
					{/* Breadcrumbs desktop */}
					{!isMobile && breadcrumbs && breadcrumbs.length > 0 && (
						<Breadcrumb className="page-breadcrumbs-desktop">
							<BreadcrumbList>
								{breadcrumbs.map((item, index) => {
									const isLast = index === breadcrumbs.length - 1;
									return (
										<Fragment key={item.label}>
											<BreadcrumbItem>
												{!isLast && item.href ? (
													<BreadcrumbLink asChild>
														<Link to={item.href} className="breadcrumb-link">
															{item.label}
														</Link>
													</BreadcrumbLink>
												) : (
													<BreadcrumbPage className="breadcrumb-current">
														{item.label}
													</BreadcrumbPage>
												)}
											</BreadcrumbItem>
											{!isLast && <BreadcrumbSeparator className="breadcrumb-sep" />}
										</Fragment>
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
