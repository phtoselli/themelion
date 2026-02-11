import { Skeleton } from "@client/shared/components/ui/skeleton";
import "@client/styles/modules/skeletons.css";

export const SidebarSkeleton = () => {
	return (
		<div className="sidebar-skeleton">
			{[1, 2, 3, 4, 5].map((i) => (
				<Skeleton
					key={i}
					style={{
						height: "1.75rem",
						width: "100%",
						borderRadius: "var(--radius-md)",
						animationDelay: `${i * 0.08}s`,
					}}
				/>
			))}
		</div>
	);
};

export const PageSkeleton = () => {
	return (
		<div className="page-skeleton">
			<div className="page-skeleton-header">
				<Skeleton style={{ height: "2rem", width: "12rem", borderRadius: "var(--radius-lg)" }} />
				<Skeleton
					style={{
						height: "1rem",
						width: "100%",
						maxWidth: "24rem",
						borderRadius: "var(--radius-md)",
					}}
				/>
				<Skeleton
					style={{
						height: "1rem",
						width: "10rem",
						borderRadius: "var(--radius-md)",
						animationDelay: "0.1s",
					}}
				/>
			</div>
			<div className="page-skeleton-grid">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Skeleton
						key={i}
						style={{
							height: "9rem",
							borderRadius: "var(--radius-xl)",
							animationDelay: `${i * 0.06}s`,
						}}
					/>
				))}
			</div>
		</div>
	);
};
