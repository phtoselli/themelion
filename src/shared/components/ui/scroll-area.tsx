import { cx } from "@client/shared/utils/utils";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import "@client/styles/components/scroll-area.css";
import type * as React from "react";

function ScrollArea({
	className,
	children,
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
	return (
		<ScrollAreaPrimitive.Root data-slot="scroll-area" className={cx(className)} {...props}>
			<ScrollAreaPrimitive.Viewport data-slot="scroll-area-viewport">
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cx(className)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb data-slot="scroll-area-thumb" />
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}

export { ScrollArea, ScrollBar };
