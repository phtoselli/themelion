import { NavigationProvider } from "@client/contexts/navigation-context";
import { TooltipProvider } from "@client/shared/components/ui/tooltip";
import type { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<NavigationProvider>
			<TooltipProvider>{children}</TooltipProvider>
		</NavigationProvider>
	);
};
