import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the app talks to the API through this proxy, so the browser
// sees one origin and the session cookie is sent without any CORS setup.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },
});
