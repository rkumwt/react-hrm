/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const backendUrl = env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		server: {
			port: 5173,
			// Browser calls http://localhost:5173/api/... and Vite forwards it to Laravel.
			// Same origin for the browser => no CORS issues in development.
			proxy: {
				"/api": { target: backendUrl, changeOrigin: true },
			},
		},
		test: {
			environment: "jsdom",
			setupFiles: "./src/test/setup.ts",
			css: false,
		},
	};
});
