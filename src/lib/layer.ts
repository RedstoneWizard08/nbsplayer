import type { Instrument } from "./instrument";
import { Note } from "./note";
import type { Song } from "./song";
import closedIcon from "@/assets/toolbar/lock_closed.svg";
import openIcon from "@/assets/toolbar/lock_open.svg";

/**
 * Represents a layer in a song
 */
export class Layer {
    public song: Song;
    public name: string;
    public volume: number;
    public notes: Note[];
    public id: number;
    public locked: boolean;

    public constructor(song: Song, id: number) {
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
         * A number between 0 and 100.
         */
        this.volume = 100;
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
        this.locked = false;
    }

    /**
     * Deletes this layer.
     */
    public delete() {
        this.song.deleteLayer(this);
    }

    /**
     * Sets the note at a given tick with a given key and instrument.
     * Automatically expands the song's size if it has now grown.
     */
    public setNote(
        tick: number,
        key: number,
        instrument: Instrument,
        velocity: number,
        panning: number,
        pitch: number
    ) {
        if (tick + 1 > this.song.size) {
            this.song.size = tick + 1;
        }

        const note = new Note(this, tick);

        note.key = key;
        note.instrument = instrument;
        note.velocity = velocity;
        note.panning = panning;
        note.pitch = pitch;

        this.notes[tick] = note;

        return note;
    }

    /**
     * Deletes the tick at a given tick in the song.
     * Does not automatically shrink the song if it has now shrunk in size.
     */
    public deleteNote(tick: number) {
        delete this.notes[tick];
    }

    /**
     * The placeholder name of this layer.
     */
    public get placeholder() {
        return "Layer " + this.id;
    }

    public get getLockIcon() {
        return this.locked ? closedIcon : openIcon;
    }
}
