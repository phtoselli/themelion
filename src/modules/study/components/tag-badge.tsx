import { Badge } from "@client/shared/components/ui/badge";
import "@client/styles/modules/badges.css";
import type { ReactNode } from "react";

export const TagBadge = ({ children }: { children: ReactNode }) => {
	return (
		<Badge variant="secondary" className="badge-tag">
			{children}
		</Badge>
	);
};
