import { useNavigation } from "@client/contexts/navigation-context";
import { AppSidebar } from "@client/modules/layout/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@client/shared/components/ui/breadcrumb";
import type { Room } from "@client/shared/types";
import type { ReactNode } from "react";
import { Link } from "react-router";

export interface BreadcrumbItemData {
	label: string;
	href?: string;
}

interface PageLayoutProps {
	children: ReactNode;
	breadcrumbs?: BreadcrumbItemData[];
	room?: Room | null;
	activeTopicSlug?: string;
	fullWidth?: boolean;
}

export const PageLayout = ({
	children,
	breadcrumbs,
	room,
	activeTopicSlug,
	fullWidth = false,
}: PageLayoutProps) => {
	const { expanded } = useNavigation();

	const marginLeft = expanded
		? "ml-[var(--spacing-sidebar-expanded)]"
		: "ml-[var(--spacing-sidebar-collapsed)]";

	return (
		<div className="min-h-screen bg-surface gradient-mesh-subtle">
			<AppSidebar room={room} activeTopicSlug={activeTopicSlug} />

			<main className={`${marginLeft} transition-[margin] duration-300 ease-out`}>
				<div className={fullWidth ? "p-6 lg:p-8" : "max-w-4xl mx-auto p-6 lg:p-10"}>
					{breadcrumbs && breadcrumbs.length > 0 && (
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
