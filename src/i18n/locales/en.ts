import type { Locale } from "./pt-BR";

export const en: Locale = {
	common: {
		rooms: "Rooms",
		topics: "Topics",
		languages: "Languages",
		categories: "categories",
		explore: "Explore",
		comingSoon: "Coming soon",
		home: "Home",
		previous: "Previous",
		next: "Next",
		stages: "stages",
		openMenu: "Open menu",
		closeMenu: "Close menu",
	},

	nav: {
		home: "Home",
		studyRooms: "Study Rooms",
		roadmaps: "Roadmaps",
	},

	sidebar: {
		collapse: "Collapse menu",
		expand: "Expand menu",
		settings: "Settings",
		downloadProgress: "Download progress",
		uploadProgress: "Upload progress",
		importSuccess: (count: number) => `${count} topic${count !== 1 ? "s" : ""} imported.`,
		importError: "Import failed.",
		theme: "Theme",
		darkMode: "Dark mode",
		lightMode: "Light mode",
	},

	difficulty: {
		beginner: "Beginner",
		intermediate: "Intermediate",
		advanced: "Advanced",
	},

	status: {
		implemented: "Available",
		planned: "Coming soon",
		unregistered: "Unregistered",
	},

	homePage: {
		badge: "Timeless Fundamentals",
		heading: "Learn the fundamentals that",
		headingHighlight: "never change",
		subtitle:
			'From the Greek \u03B8\u03B5\u03BC\u03AD\u03BB\u03B9\u03BF\u03BD, "foundation" \u2014 like Greek temples that withstand time, learn programming concepts that transcend any framework.',
		studyRoomsTitle: "Study Rooms",
		roomStats: (categories: number, topics: number) =>
			`${categories} categories \u00B7 ${topics} topics`,
		learningModesTitle: "Two ways to learn",
		studyMode: "Study Mode",
		studyModeDescription:
			"Straight-to-the-point content with examples in 5 languages. No fluff, no frameworks \u2014 just concepts that matter.",
		practiceMode: "Practice Mode",
		practiceModeDescription:
			"Challenges in ephemeral Docker containers with real-time performance feedback. Write, run, learn.",
		careerTracksTitle: "Career Tracks",
		viewAllTracks: "View all tracks",
		careerTracksSubtitle: "Structured paths from zero to professional",
	},

	roomsPage: {
		title: "Study Rooms",
		description:
			"Each room groups topics by knowledge area. Choose a room to explore its contents and start learning.",
	},

	roomPage: {
		notFound: "Room not found",
	},

	topicPage: {
		notFound: "Topic not found",
		prerequisites: "Before you start, read:",
		comingSoonTitle: "Coming Soon",
		comingSoonDescription: "This content is being prepared and will be available soon.",
		mdxPlaceholder: "MDX content will be rendered here",
		markCompleted: "Mark as completed",
		completed: "Completed",
		completedAt: (date: string) => `Completed on ${date}`,
	},

	roadmapsPage: {
		title: "Career Tracks",
		availableTracks: (count: number) => `${count} track${count !== 1 ? "s" : ""} available`,
		description:
			"Structured paths to guide your learning from zero to professional. Each track connects topics in the right order so you progress without skipping steps.",
		stages: "stages",
		viewTrack: "View track",
	},

	roadmapPage: {
		notFound: "Roadmap not found",
		completed: "Completed",
		completionPercent: (percent: number) => `${percent}% completed`,
	},

	progress: {
		invalidFormat: "Invalid format: expected a JSON object.",
		tooManyEntries: (count: number, max: number) =>
			`File contains ${count} entries (maximum: ${max}).`,
		dangerousKey: (key: string) => `Dangerous key detected: "${key}".`,
		invalidSlug: (slug: string) =>
			`Invalid slug: "${slug}". Only lowercase letters, numbers and hyphens.`,
		invalidTopicData: (key: string) => `Invalid data for topic "${key}".`,
		fileTooLarge: (sizeKB: string) => `File too large (${sizeKB}KB). Maximum: 1MB.`,
		invalidFileType: "Invalid file type. Please upload a .json file.",
		readError: "Error reading file.",
		processError: "Error processing file.",
	},
} as const;
