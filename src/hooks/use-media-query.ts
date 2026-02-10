import { useEffect, useState } from "react";

export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		const media = window.matchMedia(query);
		const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

		media.addEventListener("change", handler);
		setMatches(media.matches);

		return () => media.removeEventListener("change", handler);
	}, [query]);

	return matches;
};

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
