import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { contentPlugin } from "./plugins/vite-plugin-content";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react(), tailwindcss(), contentPlugin()],
	resolve: {
		alias: {
			"@client": resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
	},
});
