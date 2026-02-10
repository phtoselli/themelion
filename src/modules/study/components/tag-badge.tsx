import { Badge } from "@client/shared/components/ui/badge";
import type { ReactNode } from "react";

export const TagBadge = ({ children }: { children: ReactNode }) => {
	return (
		<Badge variant="secondary" className="rounded-md font-normal text-[10px]">
			{children}
		</Badge>
	);
};
