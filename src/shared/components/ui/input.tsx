import { cx } from "@client/shared/utils/utils";
import "@client/styles/components/input.css";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return <input type={type} data-slot="input" className={cx(className)} {...props} />;
}

export { Input };
