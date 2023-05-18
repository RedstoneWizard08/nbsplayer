import { Instrument } from "./instrument";
import { instruments } from "./instruments";
import { Layer } from "./layer";
import { DataReader } from "./reader";
import { DataWriter, NoopDataWriter, type IDataWriter } from "./writer";

const MAX_VERSION = 5;

/**
 * Represents a song.
 */
export class Song {
    public version: number;
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

    public constructor() {
        this.version = 0;

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
        this.instruments = instruments;
    }

    /**
     * Adds a new layer to the song and returns it.
     */
    public addLayer() {
        const layer = new Layer(this, this.layers.length + 1);

        this.layers.push(layer);

        return layer;
    }

    /**
     * Deletes a layer from the song.
     */
    public deleteLayer(layer: Layer) {
        const index = this.layers.indexOf(layer);

        this.layers.splice(index, 1);
        this.resetLayerID();
    }

    /**
     * Reset layer ID.
     */
    public resetLayerID() {
        this.layers.forEach((layer, i) => {
            layer.id = i + 1;
        });
    }

    /**
     * Plays the song.
     * If the song is ended then it will be restarted.
     */
    public play() {
        if (this.currentTick >= this.size) {
            this.currentTick = 0;
        }

        this.paused = false;
    }

    /**
     * Pauses the song
     */
    public pause() {
        this.paused = true;
    }

    /**
     * The time that each takes, in milliseconds.
     */
    public get timePerTick() {
        return (20 / this.tempo) * 50;
    }

    /**
     * The current time, in milliseconds, of the song.
     */
    public get currentTime() {
        return this.currentTick * this.timePerTick;
    }

    /**
     * The length of the song in milliseconds.
     */
    public get endTime() {
        return this.size * this.timePerTick;
    }

    /**
     * Gets the currently active tick in the song.
     * Will not contain decimals.
     */
    public get tick() {
        return Math.floor(this.currentTick);
    }

    /**
     * Parses an array buffer containg the bytes of a .nbs file as a Song.
     */
    public static fromArrayBuffer(arrayBuffer: ArrayBuffer) {
        // https://www.stuffbydavid.com/mcnbs/format

        const song = new Song();
        const viewer = new DataView(arrayBuffer);
        const reader = new DataReader(viewer);

        // Header
        song.size = reader.readShort();

        if (song.size == 0) {
            song.version = reader.readByte();
            reader.currentByte += 1;

            if (song.version >= 3) {
                song.size = reader.readShort();
            }
        }

        const totalLayers = reader.readShort();

        song.name = reader.readString();
        song.author = reader.readString();
        song.originalAuthor = reader.readString();
        song.description = reader.readString();
        song.tempo = reader.readShort() / 100; // tempo is stored as real tempo * 100

        reader.readByte(); // auto save enabled (0/1), unused by nbs.js
        reader.readByte(); // auto save duration in minutes, unused by nbs.js

        song.timeSignature = reader.readByte();
        song.minutesSpent = reader.readInt();
        song.leftClicks = reader.readInt();
        song.rightClicks = reader.readInt();
        song.blocksAdded = reader.readInt();
        song.blocksRemoved = reader.readInt();
        song.midiName = reader.readString();

        if (song.version >= 4) {
            // TODO: loop
            reader.currentByte += 4;
        }

        // Note Blocks
        // The format website linked somewhere above does a much better job at explaining this than I could.
        let currentTick = -1;

        const rawNotes = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const jumpsToNextTick = reader.readShort();

            if (jumpsToNextTick === 0) {
                break;
            }

            currentTick += jumpsToNextTick;
            let currentLayer = -1;

            // eslint-disable-next-line no-constant-condition
            while (true) {
                const jumpsToNextLayer = reader.readShort();

                if (jumpsToNextLayer === 0) {
                    break;
                }

                currentLayer += jumpsToNextLayer;

                const instrumentId = reader.readByte();
                const key = reader.readByte();

                let vel, pan, pit;

                if (song.version >= 4) {
                    vel = reader.readByte();
                    pan = reader.readByte();
                    pit = reader.readShort();
                } else {
                    vel = 100;
                    pan = 100;
                    pit = 0;
                }

                // We'll process the raw note into a real Note object later.
                rawNotes.push({
                    instrument: instrumentId,
                    key,
                    layer: currentLayer,
                    tick: currentTick,
                    velocity: vel,
                    panning: pan,
                    pitch: pit,
                });
            }
        }

        // Layers (optional section)
        if (arrayBuffer.byteLength > reader.currentByte) {
            // FIXME: EOF
            for (let i = 0; i < totalLayers; i++) {
                const layer = song.addLayer();

                layer.name = reader.readString();

                if (song.version >= 4) {
                    layer.locked = reader.readByte() == 1;
                }

                layer.volume = reader.readByte();

                if (song.version >= 2) reader.currentByte += 1;
            }
        }
        // TODO: Read instruments

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

            layer.setNote(tick, key, instrument, rn.velocity, rn.panning, rn.pitch);
        }

        return song;
    }

    public toArrayBuffer() {
        return Song.toArrayBuffer(this);
    }

    /**
     * Converts a song to an array buffer containing the bytes of the corresponding .nbs file
     */
    public static toArrayBuffer(song: Song) {
        const version: number = MAX_VERSION;

        // https://www.stuffbydavid.com/mcnbs/format

        // Writing to a buffer involves 2 "passes".
        // 1 to determine the size of the buffer, and the other to actually write the file.
        // There are probably better ways to do this, but this works.

        /**
         * Uses provided data operations to write the data of the song.
         */
        function write({ writeString, writeByte, writeShort, writeInt }: IDataWriter) {
            // Part 1 - Header
            if (version == 0) {
                writeShort(song.size);
            } else {
                writeShort(0);
                writeByte(version);
                writeByte(15);
                if (version >= 3) {
                    writeShort(song.size);
                }
            }

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

            if (version >= 4) {
                writeInt(0); // Loop, length: 4 bytes
            }

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
                        writeByte(note.instrument!.id); // Part 2 step 3 - instrument
                        writeByte(note.key); // Part 2 step 4 - key

                        if (version >= 4) {
                            writeByte(note.velocity);
                            writeByte(note.panning);
                            writeShort(note.pitch);
                        }
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
                if (version >= 4) {
                    writeByte(layer.locked ? 1 : 0);
                }
                writeByte(layer.volume);
                if (version >= 2) {
                    writeByte(100);
                }
            }

            // Part 4 - Custom Instruments.
            // Since custom instruments are not supported, we use just 0 custom instruments.
            writeByte(0);
        }

        // In the first pass all the writing operations just accumlate to the bufferSize.
        // We'll use this to make the array buffer later for the actual writing.
        const nooper = new NoopDataWriter();
        write(nooper);

        // Use the determined size to actually do the writing.
        const arrayBuffer = new ArrayBuffer(nooper.bufferSize);
        const dataView = new DataView(arrayBuffer);
        const writer = new DataWriter(dataView);

        write(writer);

        return arrayBuffer;
    }

    /**
     * Creates a new song that is setup to be used.
     */
    public static new() {
        const song = new Song();

        song.addLayer();

        return song;
    }
}
