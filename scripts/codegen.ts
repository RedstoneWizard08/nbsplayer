import fs from "fs";
import path from "path";

const instruments: [string, number, string, boolean][] = [
    ["Harp", 0, "harp", true],
    ["Double Bass", 1, "dbass", false],
    ["Bass Drum", 2, "bdrum", false],
    ["Snare Drum", 3, "sdrum", false],
    ["Click", 4, "click", false],
    ["Guitar", 5, "guitar", false],
    ["Flute", 6, "flute", false],
    ["Bell", 7, "bell", false],
    ["Chime", 8, "chime", false],
    ["Xylophone", 9, "xylophone", false],
    ["Iron Xylophone", 10, "iron_xylophone", false],
    ["Cow Bell", 11, "cow_bell", false],
    ["Didgeridoo", 12, "didgeridoo", false],
    ["Bit", 13, "bit", false],
    ["Banjo", 14, "banjo", false],
    ["Pling", 15, "pling", false],
];

const tab = "    ";

const baseAudioPath = "@/assets/instruments/audio";
const baseIconPath = "@/assets/instruments/icon";
const baseTexturePath = "@/assets/instruments/textures";
const baseToolbarPath = "@/assets/toolbar/instruments";

const audioFormat = "ogg";
const imageFormat = "png";

const generateImportPaths = (name: string, id: string) => {
    const audio = `${baseAudioPath}/${id}.${audioFormat}`;
    const icon = `${baseIconPath}/${id}.${imageFormat}`;
    const texture = `${baseTexturePath}/${id}.${imageFormat}`;
    const toolbar = `${baseToolbarPath}/${name}.${imageFormat}`;

    return [audio, icon, texture, toolbar];
};

const generateVarImports = (name: string, id: string) => {
    const audioVar = `${id}_sound`;
    const iconVar = `${id}_icon`;
    const textureVar = `${id}_texture`;
    const toolbarVar = `${id}_toolbar`;
    const paths = generateImportPaths(name, id);

    const audio = `import ${audioVar} from "${paths[0]}";`;
    const icon = `import ${iconVar} from "${paths[1]}";`;
    const texture = `import ${textureVar} from "${paths[2]}";`;
    const toolbar = `import ${toolbarVar} from "${paths[3]}";`;

    return [audio, icon, texture, toolbar].join("\n");
};

const generateConstructor = (name: string, id: number, id_s: string, key: boolean) => {
    const audioVar = `${id_s}_sound`;
    const iconVar = `${id_s}_icon`;
    const textureVar = `${id_s}_texture`;
    const toolbarVar = `${id_s}_toolbar`;

    const name_ = `\n${tab}"${name}"`;
    const id_ = `\n${tab}${id}`;
    const audio_ = `\n${tab}${audioVar}`;
    const icon_ = `\n${tab}${iconVar}`;
    const texture_ = `\n${tab}${textureVar}`;
    const toolbar_ = `\n${tab}${toolbarVar}`;
    const key_ = `\n${tab}${key}`;

    const constructor = `new Instrument(${name_},${id_},${audio_},${texture_},${icon_},${toolbar_},${key_},\n)`;

    return constructor;
};

const generateImports = () => {
    const imports = [];

    for (const instrument of instruments) {
        const imports_ = generateVarImports(instrument[0], instrument[2]);
        
        imports.push(imports_);
    }

    return imports.join("\n\n");
};

const generateConstructors = () => {
    const constructors = [];

    for (const instrument of instruments) {
        const constructor = generateConstructor(...instrument);

        constructors.push(constructor);
    }

    return "export const instruments = [\n" + constructors.map((v) => v.split("\n").map((v) => tab + v).join("\n")).join(",\n") + ",\n];";
};

const imports = generateImports();
const constructors = generateConstructors();
const code = [imports, constructors].join("\n\n");

fs.writeFileSync(path.join(__dirname, "..", "src", "lib", "instruments.ts"), code);
