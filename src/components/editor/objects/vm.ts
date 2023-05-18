import type { Song } from "@/lib/nbs";
import type { SongEditor } from "../editor";

export interface Mouse {
    x: number;
    y: number;
    right: boolean;
    left: boolean;
    middle: boolean;
}

export interface VM {
    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    cursor: string;
    song?: Song;
    editor?: SongEditor;
    mouse: Mouse;
}
