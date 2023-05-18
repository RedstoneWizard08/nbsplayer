import type { Instrument } from "./instrument";
import type { Layer } from "./layer";

/**
 * Represents a note in a song
 */
export class Note {
    public layer: Layer;
    public tick: number;
    public key: number;

    /**
     * The instrument of the note.
     * TODO: null is not a good default value
     */
    public instrument?: Instrument;

    /**
     * The last time the note was played.
     * TODO: does this need to be here?
     */
    public lastPlayed?: number;

    public velocity: number;
    public panning: number;
    public pitch: number;

    public constructor(layer: Layer, tick: number) {
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

        this.velocity = 100;
        this.panning = 100;
        this.pitch = 0;
    }
}
