import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import ogg from "./plugins/ogg-export";
import svg from "vite-svg-loader";
import progress from "vite-plugin-progress";

export default defineConfig({
    plugins: [vue(), vueJsx(), ogg(), progress()],

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },

    base: "./",

    server: {
        hmr: {
            clientPort: 443,
            port: 3000,
            protocol: "wss",
        },

        port: 3000,
        strictPort: true,
    },

    build: {
        rollupOptions: {
            output: {
                format: "commonjs",
            },
        },
    },
});
