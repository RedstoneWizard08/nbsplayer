import { Instrument, Layer, Note, Song } from "@/lib/nbs";

/**
 * A visible part of a screen.
 */
export class Viewport {
    public width: number;
    public firstTick: number;

    public constructor() {
        /**
         * The first visible tick of the song.
         * Must *not* have decimals.
         */
        this.firstTick = 0;
        this.width = 0;
    }

    /**
     * The last visible tick of the song. May have decimals.
     */
    public get lastTick() {
        return this.firstTick + this.width!;
    }

    public set lastTick(tick) {
        this.firstTick = tick - this.width!;
    }
}

/**
 * Methods related to editing or displaying the notes of a song.
 */
export class SongEditor {
    /**
     * Formats a note's key as human readable text.
     * Example results are "A#3" and "F-4"
     */
    public static formatKey(key: number) {
        const KEY_TEXT = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

        const keyText = KEY_TEXT[(key - 3) % 12];
        const octave = Math.floor((key - 3) / 12) + 1;

        return `${keyText}${octave}`;
    }

    public song: Song;
    public currentKey: number;
    public currentInstrument: Instrument;
    public viewport: Viewport;
    public modified: boolean;
    public textureCache: Record<string, HTMLImageElement>;

    public constructor(song: Song) {
        /**
         * The song being edited.
         */
        this.song = song;
        /**
         * The currently active key for newly placed notes.
         */
        this.currentKey = 45; // F#4
        /**
         * The currently active instrument for newly placed instruments.
         */
        this.currentInstrument = song.instruments[0];
        /**
         * The currently visible part of the song.
         */
        this.viewport = new Viewport();
        /**
         * Has the song been modified?
         */
        this.modified = false;
        this.textureCache = {};
    }

    /**
     * Gets a layer
     */
    public getLayer(layer: number | Layer) {
        if (layer instanceof Layer) {
            return layer;
        } else if (typeof layer === "number") {
            if (this.song.layers[layer]) {
                return this.song.layers[layer];
            }
        }

        throw new Error("Unknown layer: " + layer);
    }

    /**
     * Places a note using the currently active key and instrument
     */
    public placeNote(layer: Layer | number, tick: number) {
        this.modified = true;

        return this.setNote(layer, tick, this.currentKey, this.currentInstrument);
    }

    /**
     * Gets a note
     */
    public getNote(layer: Layer | number, tick: number) {
        return this.getLayer(layer).notes[tick];
    }

    /**
     * Sets a note in a song
     */
    public setNote(layer: Layer | number, tick: number, key: number, instrument: Instrument) {
        return this.getLayer(layer).setNote(tick, key, instrument, 100, 100, 0);
    }

    /**
     * Deletes a note of a song
     */
    public deleteNote(layer: Layer | number, tick: number) {
        this.modified = true;
        this.getLayer(layer).deleteNote(tick);
    }

    /**
     * Replaces the current settings with those of a note.
     * Similar to the "Pick Block" feature of Minecraft.
     */
    public pickNote(note: Note) {
        this.currentInstrument = note.instrument!;
        this.currentKey = note.key;
    }

    public seekTick(tick: number) {
        this.song.currentTick = tick;
        // TODO: updateViewport()?
    }

    /**
     * Updates the viewport and ensures the current tick is currently in view.
     */
    public updateViewport() {
        if (this.song.currentTick >= this.viewport.lastTick) {
            this.viewport.firstTick = this.song.tick;
        }
        if (this.song.currentTick < this.viewport.firstTick) {
            this.viewport.firstTick = this.song.tick;
        }
    }
}
