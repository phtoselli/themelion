import { cx } from "@client/shared/utils/utils";
import { Slot } from "radix-ui";
import "@client/styles/components/badge.css";
import type * as React from "react";

function Badge({
	className,
	variant = "default",
	asChild = false,
	...props
}: React.ComponentProps<"span"> & {
	variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
	asChild?: boolean;
}) {
	const Comp = asChild ? Slot.Root : "span";

	return <Comp data-slot="badge" data-variant={variant} className={cx(className)} {...props} />;
}

export { Badge };
