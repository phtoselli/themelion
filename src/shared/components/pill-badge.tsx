import "@client/styles/components/pill-badge.css";

export const PillBadge = ({ children }: { children: string }) => {
	return (
		<div className="pill-badge">
			<span className="pill-badge-dot" />
			<span className="pill-badge-text">{children}</span>
		</div>
	);
};
