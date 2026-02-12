import { HomePage } from "@client/routes/home-page";
import { LandingPage } from "@client/routes/landing-page";
import { ProjectsPage } from "@client/routes/projects-page";
import { RoadmapPage } from "@client/routes/roadmap-page";
import { RoadmapsPage } from "@client/routes/roadmaps-page";
import { RoomPage } from "@client/routes/room-page";
import { RoomsPage } from "@client/routes/rooms-page";
import { TopicPage } from "@client/routes/topic-page";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";

const ScrollToTop = () => {
	const location = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll reset precisa reagir a mudancas de rota
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return null;
};

export const AppRoutes = () => {
	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/modules" element={<RoomsPage />} />
				<Route path="/room/:roomSlug" element={<RoomPage />} />
				<Route path="/topic/:topicSlug" element={<TopicPage />} />
				<Route path="/roadmaps" element={<RoadmapsPage />} />
				<Route path="/roadmap/:roadmapSlug" element={<RoadmapPage />} />
				<Route path="/projects" element={<ProjectsPage />} />
			</Routes>
		</>
	);
};
