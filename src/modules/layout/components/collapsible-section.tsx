import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@client/shared/components/ui/collapsible";
import "@client/styles/modules/collapsible-section.css";
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
			<CollapsibleTrigger className="collapsible-trigger">
				<ChevronRight size={12} className="collapsible-chevron" data-open={open} />
				<span className="collapsible-title">{title}</span>
				{count !== undefined && <span className="collapsible-count">{count}</span>}
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className={open ? "collapsible-children" : ""}>{children}</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
