import { HomePage } from "@client/routes/home-page";
import { RoadmapPage } from "@client/routes/roadmap-page";
import { RoadmapsPage } from "@client/routes/roadmaps-page";
import { RoomPage } from "@client/routes/room-page";
import { RoomsPage } from "@client/routes/rooms-page";
import { TopicPage } from "@client/routes/topic-page";
import { Route, Routes } from "react-router";

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/rooms" element={<RoomsPage />} />
			<Route path="/room/:roomSlug" element={<RoomPage />} />
			<Route path="/topic/:topicSlug" element={<TopicPage />} />
			<Route path="/roadmaps" element={<RoadmapsPage />} />
			<Route path="/roadmap/:roadmapSlug" element={<RoadmapPage />} />
		</Routes>
	);
};
