import { cx } from "@client/shared/utils/utils";
import { Tabs as TabsPrimitive } from "radix-ui";
import "@client/styles/components/tabs.css";
import type * as React from "react";

function Tabs({
	className,
	orientation = "horizontal",
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			data-orientation={orientation}
			orientation={orientation}
			className={cx(className)}
			{...props}
		/>
	);
}

function TabsList({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
	variant?: "default" | "line";
}) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			data-variant={variant}
			className={cx(className)}
			{...props}
		/>
	);
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cx(className)} {...props} />;
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return <TabsPrimitive.Content data-slot="tabs-content" className={cx(className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
