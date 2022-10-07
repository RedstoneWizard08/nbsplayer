import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";

import preact from "@preact/preset-vite";

import ogg from "./plugins/ogg-export";
import progress from "vite-plugin-progress";
import preactRefresh from "@prefresh/vite";
import babel from "vite-plugin-babel";

export default defineConfig({
    plugins: [
        preact(),
        ogg(),
        progress(),
        babel({
            babelConfig: {
                babelrc: true,
                plugins: ["@babel/plugin-transform-react-jsx-source"],
            },
        }),
    ],

    resolve: {
        alias: {
            // @ts-ignore
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            react: "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",
            "react/jsx-runtime": "preact/jsx-runtime",
        },
    },

    base: "./",

    server: {
        hmr: {
            clientPort: 443,
            port: 3000,
            protocol: "ws",
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

    esbuild: {
        jsxFactory: "h",
        jsxFragment: "Fragment",
    },
});
