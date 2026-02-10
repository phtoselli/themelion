import { Skeleton } from "@client/shared/components/ui/skeleton";

export const SidebarSkeleton = () => {
	return (
		<div className="space-y-2 px-2">
			{[1, 2, 3, 4, 5].map((i) => (
				<Skeleton
					key={i}
					className="h-7 w-full rounded-md"
					style={{ animationDelay: `${i * 0.08}s` }}
				/>
			))}
		</div>
	);
};

export const PageSkeleton = () => {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<Skeleton className="h-8 w-72 rounded-lg" />
				<Skeleton className="h-4 w-96 rounded-md" />
				<Skeleton className="h-4 w-64 rounded-md" style={{ animationDelay: "0.1s" }} />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Skeleton
						key={i}
						className="h-36 rounded-xl"
						style={{ animationDelay: `${i * 0.06}s` }}
					/>
				))}
			</div>
		</div>
	);
};
