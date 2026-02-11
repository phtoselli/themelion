import { cx } from "@client/shared/utils/utils";
import "@client/styles/components/skeleton.css";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="skeleton" className={cx(className)} {...props} />;
}

export { Skeleton };
