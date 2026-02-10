import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@client/shared/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { type ReactNode, useState } from "react";

interface CollapsibleSectionProps {
	title: string;
	count?: number;
	defaultOpen?: boolean;
	children: ReactNode;
}

export const CollapsibleSection = ({
	title,
	count,
	defaultOpen = false,
	children,
}: CollapsibleSectionProps) => {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text transition-all duration-200 rounded-md hover:bg-surface-hover group">
				<ChevronRight
					size={12}
					className={`shrink-0 transition-transform duration-200 text-text-faint group-hover:text-text-muted ${open ? "rotate-90" : ""}`}
				/>
				<span className="truncate text-xs">{title}</span>
				{count !== undefined && (
					<span className="ml-auto text-[10px] text-text-faint tabular-nums">{count}</span>
				)}
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className={open ? "border-l border-border/50 ml-2 pl-1.5" : ""}>{children}</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
