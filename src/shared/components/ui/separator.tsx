import { cx } from "@client/shared/utils/utils";
import { Separator as SeparatorPrimitive } from "radix-ui";
import "@client/styles/components/separator.css";
import type * as React from "react";

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cx(className)}
			{...props}
		/>
	);
}

export { Separator };
