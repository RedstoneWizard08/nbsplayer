import type { Plugin } from "rollup";

import fs from "fs";
import path from "path";
// import path from "path";

export interface NBSExportOptions {}

export const NBSExportDefaultOptions: NBSExportOptions = {};

export const NBSExportPlugin = (
    options: NBSExportOptions = NBSExportDefaultOptions
): Plugin => {
    return {
        name: "nbs-export-plugin",

        transform(src, id) {
            const filePath = id.split("?")[0];
            if (!filePath.endsWith("NBS.ts")) return null;

            const regex =
                /const\s([^\s]+)\s=\s"\@(assets\/instruments[^"]+)";/gm;
            const matches = [];

            let match = regex.exec(src);

            while (match != null) {
                matches.push({
                    name: match[1],
                    source: path.join("src", match[2]),
                    type: match[2].endsWith(".png") ? "image/png" : "audio/ogg",
                    script: match[0],
                });

                match = regex.exec(src);
            }

            const files: { [key: string]: { script: string; url: string } } =
                {};

            matches.forEach(
                (val) =>
                    (files[val.name] = {
                        script: val.script,
                        url: `data:${val.type};base64,${fs.readFileSync(
                            val.source,
                            "base64"
                        )}`,
                    })
            );

            let script = src;

            Object.keys(files).forEach(
                (file) =>
                    (script = script.replace(
                        files[file].script,
                        `const ${file} = "${files[file].url}";`
                    ))
            );

            return {
                code: script,
            };
        },
    };
};

export default NBSExportPlugin;
