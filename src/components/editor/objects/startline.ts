import { EditorLine } from "./line";

/**
 * Shows the start of the song.
 */
export class SongStartLine extends EditorLine {
    public value: number;
    public visualWidth: number;
    public color: string;

    public constructor() {
        super();

        this.value = 0;
        this.visualWidth = 1;
        this.color = "#999";
    }
}
