import { cx } from "@client/shared/utils/utils";
import { Slot } from "radix-ui";
import "@client/styles/components/button.css";
import type * as React from "react";

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> & {
	asChild?: boolean;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cx(className)}
			{...props}
		/>
	);
}

export { Button };
