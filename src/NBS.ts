import { WebAudioNotePlayer } from "./audio";

const harpAudio = "@assets/instruments/audio/harp.ogg";
const harpTexture = "@assets/instruments/textures/harp.png";
const doubleBassAudio = "@assets/instruments/audio/dbass.ogg";
const doubleBassTexture = "@assets/instruments/textures/dbass.png";
const bassDrumAudio = "@assets/instruments/audio/bdrum.ogg";
const bassDrumTexture = "@assets/instruments/textures/bdrum.png";
const snareDrumAudio = "@assets/instruments/audio/sdrum.ogg";
const snareDrumTexture = "@assets/instruments/textures/sdrum.png";
const clickAudio = "@assets/instruments/audio/click.ogg";
const clickTexture = "@assets/instruments/textures/click.png";
const guitarAudio = "@assets/instruments/audio/guitar.ogg";
const guitarTexture = "@assets/instruments/textures/guitar.png";
const fluteAudio = "@assets/instruments/audio/flute.ogg";
const fluteTexture = "@assets/instruments/textures/flute.png";
const bellAudio = "@assets/instruments/audio/bell.ogg";
const bellTexture = "@assets/instruments/textures/bell.png";
const chimeAudio = "@assets/instruments/audio/chime.ogg";
const chimeTexture = "@assets/instruments/textures/chime.png";
const xylophoneAudio = "@assets/instruments/audio/xylophone.ogg";
const xylophoneTexture = "@assets/instruments/textures/xylophone.png";
const ironXylophoneAudio = "@assets/instruments/audio/iron_xylophone.ogg";
const ironXylophoneTexture = "@assets/instruments/textures/iron_xylophone.png";
const cowBellAudio = "@assets/instruments/audio/cow_bell.ogg";
const cowBellTexture = "@assets/instruments/textures/cow_bell.png";
const didgeridooAudio = "@assets/instruments/audio/didgeridoo.ogg";
const didgeridooTexture = "@assets/instruments/textures/didgeridoo.png";
const bitAudio = "@assets/instruments/audio/bit.ogg";
const bitTexture = "@assets/instruments/textures/bit.png";
const banjoAudio = "@assets/instruments/audio/banjo.ogg";
const banjoTexture = "@assets/instruments/textures/banjo.png";
const plingAudio = "@assets/instruments/audio/pling.ogg";
const plingTexture = "@assets/instruments/textures/pling.png";

/**
 * NBS.js: JavaScript implementation of parsing, saving, and abstracting .nbs files.
 */

export interface WriterInfo {
    writeShort: (value: number) => void;
    writeString: (value: string) => void;
    writeByte: (value: number) => void;
    writeInt: (value: number) => void;
}

/**
 * Represents a song.
 */
export class Song {
    public name: string;
    public author: string;
    public originalAuthor: string;
    public description: string;
    public layers: Layer[];
    public tempo: number;
    public size: number;
    public currentTick: number;
    public paused: boolean;
    public timeSignature: number;
    public minutesSpent: number;
    public leftClicks: number;
    public rightClicks: number;
    public blocksAdded: number;
    public blocksRemoved: number;
    public midiName: string;
    public instruments: Instrument[];

    /**
     * Creates a new song that is setup to be used.
     */
    static new() {
        const song = new Song();

        song.addLayer();

        return song;
    }

    /**
     * Converts a song to an array buffer containing the bytes of the corresponding .nbs file
     */
    static toArrayBuffer(song: Song) {
        // https://www.stuffbydavid.com/mcnbs/format

        // Writing to a buffer involves 2 "passes".
        // 1 to determine the size of the buffer, and the other to actually write the file.
        // There are probably better ways to do this, but this works.

        /**
         * Uses provided data operations to write the data of the song.
         */
        function write({
            writeString,
            writeByte,
            writeShort,
            writeInt,
        }: WriterInfo) {
            // Part 1 - Header
            writeShort(song.size);
            writeShort(song.layers.length);
            writeString(song.name);
            writeString(song.author);
            writeString(song.originalAuthor);
            writeString(song.description);
            writeShort(song.tempo * 100); // tempo is stored as the real tempo * 100
            writeByte(0); // auto save enabled
            writeByte(0); // auto save duration
            writeByte(song.timeSignature); // time signature
            writeInt(song.minutesSpent); // minutes spent
            writeInt(song.leftClicks); // left clicks
            writeInt(song.rightClicks); // right clicks
            writeInt(song.blocksAdded); // blocks added
            writeInt(song.blocksRemoved); // blocks removed
            writeString(song.midiName); // midi/schematic name

            // Part 2 - Notes
            let currentTick = -1;
            for (let i = 0; i < song.size; i++) {
                // Determine if there are any notes in this tick.
                let hasNotes = false;
                for (const layer of song.layers) {
                    if (layer.notes[i]) {
                        hasNotes = true;
                        break;
                    }
                }

                if (!hasNotes) {
                    continue;
                }

                const jumpsToNextTick = i - currentTick;
                currentTick = i;

                // Part 2 step 1
                writeShort(jumpsToNextTick);

                let currentLayer = -1;

                for (let j = 0; j < song.layers.length; j++) {
                    const layer = song.layers[j];
                    const note = layer.notes[i];
                    if (note) {
                        const jumpsToNextLayer = j - currentLayer;
                        currentLayer = j;
                        writeShort(jumpsToNextLayer); // Part 2 step 2 - jumps to next layer
                        writeByte(note.instrument?.id || 0); // Part 2 step 3 - instrument
                        writeByte(note.key); // Part 2 step 4 - key
                    }
                }

                // Part 2 step 2 - end tick
                writeShort(0);
            }
            // Part 2 step 1 - end note section
            writeShort(0);

            // Part 3 - Layers
            for (const layer of song.layers) {
                writeString(layer.name);
                writeByte(Math.floor(layer.volume * 100)); // we store volume as 0-1 but it the format needs 0-100
            }

            // Part 4 - Custom Instruments.
            // Since custom instruments are not supported, we use just 0 custom instruments.
            writeByte(0);
        }

        // In the first pass all the writing operations just accumlate to the bufferSize.
        // We'll use this to make the array buffer later for the actual writing.
        let bufferSize = 0;
        write({
            writeString(str: string) {
                // 1 byte for each character + 4 bytes for length
                bufferSize += str.length + 4;
            },
            writeByte() {
                bufferSize += 1;
            },
            writeShort() {
                bufferSize += 2;
            },
            writeInt() {
                bufferSize += 4;
            },
        });

        // Use the determined size to actually do the writing.
        const arrayBuffer = new ArrayBuffer(bufferSize);
        const dataView = new DataView(arrayBuffer);
        let currentByte = 0;
        write({
            // pass real byte writing methods.
            writeByte,
            writeShort,
            writeInt,
            writeString,
        });

        function writeByte(byte: number) {
            // @ts-ignore
            dataView.setInt8(currentByte, byte, true);
            currentByte += 1;
        }

        function writeUnsignedByte(byte: number) {
            dataView.setUint16(currentByte, byte, true);
            currentByte += 1;
        }

        function writeShort(short: number) {
            dataView.setInt16(currentByte, short, true);
            currentByte += 2;
        }

        function writeInt(int: number) {
            dataView.setInt32(currentByte, int, true);
            currentByte += 4;
        }

        function writeString(string: string) {
            writeInt(string.length);
            for (const i of string) {
                writeUnsignedByte(i.charCodeAt(0));
            }
        }

        return arrayBuffer;
    }

    /**
     * Parses an array buffer containg the bytes of a .nbs file as a Song.
     */
    static fromArrayBuffer(arrayBuffer: ArrayBuffer) {
        // https://www.stuffbydavid.com/mcnbs/format

        const song: Song = new Song();
        const viewer = new DataView(arrayBuffer);
        let currentByte = 0;

        /**
         * Reads a signed byte from the buffer and advances the current byte by 1.
         */
        function readByte() {
            // @ts-ignore
            const result = viewer.getInt8(currentByte, true);
            currentByte += 1;
            return result;
        }

        /**
         * Reads an unsigned byte form the buffer and advances the current byte by 1.
         */
        function readUnsignedByte() {
            const result = viewer.getUint16(currentByte, true);
            currentByte += 1;
            return result;
        }

        /**
         * Reads a signed 2 byte number (eg. a short) from the buffer and advanced the current byte by 2.
         */
        function readShort() {
            const result = viewer.getInt16(currentByte, true);
            currentByte += 2;
            return result;
        }

        /**
         * Reads a signed 4 byte number (eg. an integer) from the buffer and advanced the current byte by 4.
         */
        function readInt() {
            const result = viewer.getInt32(currentByte, true);
            currentByte += 4;
            return result;
        }

        /**
         * Reads a string from the buffer and advanced the current byte until the end of the string.
         * Strings begin with a signed integer (the length), followed by that many bytes of the string's data.
         */
        function readString() {
            const length = readInt();
            let result = "";
            for (let i = 0; i < length; i++) {
                const byte = readUnsignedByte();
                result += String.fromCharCode(byte);
            }
            return result;
        }

        // Header
        song.size = readShort();
        const totalLayers = readShort();
        song.name = readString();
        song.author = readString();
        song.originalAuthor = readString();
        song.description = readString();
        song.tempo = readShort() / 100; // tempo is stored as real tempo * 100
        readByte(); // auto save enabled (0/1), unused by nbs.js
        readByte(); // auto save duration in minutes, unused by nbs.js
        song.timeSignature = readByte();
        song.minutesSpent = readInt();
        song.leftClicks = readInt();
        song.rightClicks = readInt();
        song.blocksAdded = readInt();
        song.blocksRemoved = readInt();
        song.midiName = readString();

        // Note Blocks
        // The format website linked somewhere above does a much better job at explaining this than I could.
        let currentTick = -1;
        const rawNotes = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const jumpsToNextTick = readShort();
            if (jumpsToNextTick === 0) {
                break;
            }
            currentTick += jumpsToNextTick;
            let currentLayer = -1;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const jumpsToNextLayer = readShort();
                if (jumpsToNextLayer === 0) {
                    break;
                }
                currentLayer += jumpsToNextLayer;
                const instrumentId = readByte();
                const key = readByte();

                // We'll process the raw note into a real Note object later.
                rawNotes.push({
                    instrument: instrumentId,
                    key,
                    layer: currentLayer,
                    tick: currentTick,
                });
            }
        }

        // Layers (optional section)
        if (arrayBuffer.byteLength > currentByte) {
            for (let i = 0; i < totalLayers; i++) {
                const layer = song.addLayer();
                layer.name = readString();
                layer.volume = readByte() / 100;
            }
        }

        // Process raw notes and convert them to real Note objects.
        // Cannot be done while parsing because information about layers and other things might not exist yet.
        for (const rn of rawNotes) {
            // If a note is in a layer that doesn't exist, we will have to create the layers for it.
            // For an example file that does this, see Friday.nbs in any NBS installation
            if (rn.layer >= song.layers.length) {
                while (rn.layer >= song.layers.length) {
                    song.addLayer();
                }
            }

            const layer = song.layers[rn.layer];
            const key = rn.key;
            const tick = rn.tick;
            const instrument = song.instruments[rn.instrument];

            layer.setNote(tick, key, instrument);
        }

        return song;
    }

    constructor() {
        /**
         * The name (or title) of this song.
         */
        this.name = "";
        /**
         * The author of this song.
         */
        this.author = "";
        /**
         * The original author of this song.
         */
        this.originalAuthor = "";
        /**
         * The song's description.
         */
        this.description = "";

        /**
         * Layers of the song
         */
        this.layers = [];
        /**
         * The tempo of the song in ticks per second.
         */
        this.tempo = 5;
        /**
         * The length of the longest layer of the song.
         */
        this.size = 0;

        /**
         * The current playing tick of a song.
         * Can contain decimals.
         */
        this.currentTick = 0;
        /**
         * Is the song paused? (as in, not playing)
         */
        this.paused = true;
        /**
         * The song's time signature.
         */
        this.timeSignature = 4;
        /**
         * The minutes spent editing the song.
         */
        this.minutesSpent = 0;
        /**
         * The total left clicks of the song.
         */
        this.leftClicks = 0;
        /**
         * The total right clicks of the song.
         */
        this.rightClicks = 0;
        /**
         * Blocks added to the song.
         */
        this.blocksAdded = 0;
        /**
         * Blocks removed from the song.
         */
        this.blocksRemoved = 0;
        /**
         * The name of the MIDI or schematic that this song was imported from.
         */
        this.midiName = "";
        /**
         * The instruments of the song.
         */
        this.instruments = Instrument.builtin;
    }

    /**
     * Adds a new layer to the song and returns it.
     */
    addLayer() {
        const layer = new Layer(this, this.layers.length + 1);
        this.layers.push(layer);
        return layer;
    }

    /**
     * Deletes a layer from the song.
     */
    deleteLayer(layer: Layer) {
        const index = this.layers.indexOf(layer);
        this.layers.splice(index, 1);
    }

    /**
     * Plays the song.
     * If the song is ended then it will be restarted.
     */
    play() {
        if (this.currentTick >= this.size) {
            this.currentTick = 0;
        }
        this.paused = false;
    }

    /**
     * Pauses the song
     */
    pause() {
        this.paused = true;
    }

    /**
     * The time that each takes, in milliseconds.
     */
    get timePerTick() {
        return (20 / this.tempo) * 50;
    }

    /**
     * The current time, in milliseconds, of the song.
     */
    get currentTime() {
        return this.currentTick * this.timePerTick;
    }

    /**
     * The length of the song in milliseconds.
     */
    get endTime() {
        return this.size * this.timePerTick;
    }

    /**
     * Gets the currently active tick in the song.
     * Will not contain decimals.
     */
    get tick() {
        return Math.floor(this.currentTick);
    }
}

/**
 * Represents a layer in a song
 */
export class Layer {
    public song: Song;
    public name: string;
    public volume: number;
    public notes: Note[];
    public id: number;

    constructor(song: Song, id: number) {
        /**
         * The parent song of this layer.
         */
        this.song = song;
        /**
         * The name of this layer.
         */
        this.name = "";
        /**
         * The volume of this layer.
         * A number between 0 and 1.
         */
        this.volume = 1;
        /**
         * The notes within this layer.
         * Not all indexes will have a note.
         */
        this.notes = [];
        /**
         * The ID of this layer.
         * Is not guaranteed to be unique.
         */
        this.id = id;
    }

    /**
     * Deletes this layer.
     */
    delete() {
        this.song.deleteLayer(this);
    }

    /**
     * Sets the note at a given tick with a given key and instrument.
     * Automatically expands the song's size if it has now grown.
     */
    setNote(tick: number, key: number, instrument: Instrument) {
        if (tick + 1 > this.song.size) {
            this.song.size = tick + 1;
        }
        const note = new Note(this, tick);
        note.key = key;
        note.instrument = instrument;
        this.notes[tick] = note;
        return note;
    }

    /**
     * Deletes the tick at a given tick in the song.
     * Does not automatically shrink the song if it has now shrunk in size.
     */
    deleteNote(tick: number) {
        delete this.notes[tick];
    }

    /**
     * The placeholder name of this layer.
     */
    get placeholder() {
        return `Layer ${this.id}`;
    }
}

/**
 * Represents a note in a song
 */
export class Note {
    public layer: Layer;
    public tick: number;
    public key: number;
    public instrument?: Instrument;
    public lastPlayed?: number;

    constructor(layer: Layer, tick: number) {
        /**
         * The layer this note is in
         */
        this.layer = layer;
        /**
         * The tick that the note lives in
         */
        this.tick = tick;
        /**
         * The key of the note.
         */
        this.key = 45; // F#4
        /**
         * The instrument of the note.
         * TODO: null is not a good default value
         */
        this.instrument = undefined;
        /**
         * The last time the note was played.
         * TODO: does this need to be here?
         */
        this.lastPlayed = undefined;
    }
}

/**
 * Represents an instrument
 */
export class Instrument {
    public name: string;
    public id: number;
    public audioSrc: string;
    public textureSrc: string;
    public pressKey?: boolean;
    public baseTexture?: HTMLImageElement;
    public audioBuffer?: AudioBuffer;

    public static builtin = [
        // Vue will set the correct sources and sometimes inline images using require()
        new Instrument("Harp", 0, harpAudio, harpTexture, true),
        new Instrument(
            "Double Bass",
            1,
            doubleBassAudio,
            doubleBassTexture,
            false
        ),
        new Instrument("Bass Drum", 2, bassDrumAudio, bassDrumTexture, false),
        new Instrument(
            "Snare Drum",
            3,
            snareDrumAudio,
            snareDrumTexture,
            false
        ),
        new Instrument("Click", 4, clickAudio, clickTexture, false),
        new Instrument("Guitar", 5, guitarAudio, guitarTexture, false),
        new Instrument("Flute", 6, fluteAudio, fluteTexture, false),
        new Instrument("Bell", 7, bellAudio, bellTexture, false),
        new Instrument("Chime", 8, chimeAudio, chimeTexture, false),
        new Instrument("Xylophone", 9, xylophoneAudio, xylophoneTexture, false),
        new Instrument(
            "Iron Xylophone",
            10,
            ironXylophoneAudio,
            ironXylophoneTexture
        ),
        new Instrument("Cow Bell", 11, cowBellAudio, cowBellTexture),
        new Instrument("Didgeridoo", 12, didgeridooAudio, didgeridooTexture),
        new Instrument("Bit", 13, bitAudio, bitTexture),
        new Instrument("Banjo", 14, banjoAudio, banjoTexture),
        new Instrument("Pling", 15, plingAudio, plingTexture),
    ];

    constructor(
        name: string,
        id: number,
        audioSrc: string,
        textureSrc: string,
        pressKey?: boolean
    ) {
        /**
         * The name of the instrument
         */
        this.name = name;
        /**
         * The ID of the instrument
         */
        this.id = id;
        /**
         * The source to be fetched for the instrument's sound
         */
        this.audioSrc = audioSrc;
        /**
         * The image to be fetched for the instrument's image in the editor
         */
        this.textureSrc = textureSrc;
        this.pressKey = pressKey;
        /**
         * The resulting audio buffer that will contain the sound
         * Set by loadAudio() or load()
         */
        this.audioBuffer = undefined;
    }

    load() {
        return new Promise((resolve, reject) => {
            try {
                this.loadAudio();
            } catch (e) {
                reject(e);
            }

            try {
                this.loadTexture();
            } catch (e) {
                reject(e);
            }

            resolve(this);
        });
    }

    /**
     * A polyfill for fetching in data URIs.
     */
    _fetch(uri: string): Promise<Blob> {
        return new Promise((resolve, reject) => {
            try {
                const byteString = atob(uri.toString().split(",")[1]);
                const mime = uri
                    .toString()
                    .split(",")[0]
                    .split(":")[1]
                    .split(";")[0];

                const buf = new ArrayBuffer(byteString.length);
                const arr = new Uint8Array(buf);

                for (let i = 0; i < byteString.length; i++)
                    arr[i] = byteString.charCodeAt(i);

                const blob = new Blob([buf], { type: mime });

                resolve(blob);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Fetches the sound from the internet
     */
    loadAudio() {
        return this._fetch(this.audioSrc)
            .then((data: Blob) => data.arrayBuffer())
            .then((audioData: ArrayBuffer) =>
                WebAudioNotePlayer.decodeAudioData(audioData)
            )
            .then((buffer: AudioBuffer) => (this.audioBuffer = buffer));
    }

    /**
     * Fetchs the texture from the internet
     */
    loadTexture() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.textureSrc;
            this.baseTexture = image;

            image.onload = () => resolve(image);
            image.onerror = (e: string | Event) => reject(e);
        });
    }
}