import { WebAudioNotePlayer } from "@/audio";
import { globalState, NBSPlayer } from "@/NBSPlayer";
import { RefObject } from "preact";
import { NOTE_SIZE } from "./config";
import { SongEditor } from "./editor";
import { Editor } from "./Editor";

export interface Vec2 {
    x: number;
    y: number;
}

export const isVec2 = (obj: object) => {
    return Object.hasOwn(obj, "x") && Object.hasOwn(obj, "y");
};

/**
 * An object in the editor.
 */
export class EditorObject {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.height = 0;
        this.width = 0;
    }

    /**
     * Updates the sprite in some way.
     */
    update(vm: Editor) {
        // left to implementations
    }

    /**
     * Determines if this object intersects a point.
     * If both `a` and `b` are provided, the point to be tested is (a, b)
     * If only `a` is provided, the point to be tested is (a.x, a.y)
     */
    intersectsPoint(a: Vec2 | number, b?: number) {
        let x2: number, y2: number;

        if (!b) {
            if (!isVec2(a as object))
                throw new ReferenceError(
                    "Argument 'a' is not a Vec2 and 'b' was not provided!"
                );

            x2 = (a as Vec2).x;
            y2 = (a as Vec2).y;
        } else {
            if (typeof a !== "number")
                throw new ReferenceError(
                    "Both arguments 'a' and 'b' were provided, but argument 'a' was a Vec2!"
                );

            x2 = a as number;
            y2 = b;
        }

        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        return x2 >= x && x2 <= x + w && y2 >= y && y2 <= y + h;
    }

    /**
     * Render this object on a 2d canvas.
     */
    render(ctx: CanvasRenderingContext2D, time?: number) {
        throw new Error("EditorObject did not implement `render(ctx) { ... }`");
    }

    /**
     * Attempt to begin an interaction with this object.
     * `true` indicates that the interaction has successfully started, `false` indicates that it has not.
     * `false` does not mean an error has occurred, just that this object does not want to be interacted with.
     */
    interact(vm: Editor, b?: number) {
        return false;
    }

    /**
     * The object has been dragged after the interaction has started.
     * Is given the delta x and delta y (movement in x and y direction)
     */
    dragged(vm: Editor, dx: number, dy: number) {
        // left to implementations
    }

    /**
     * Indicates the object is no longer being interacted with.
     */
    interactEnd(vm: Editor, button?: number) {
        // left to implementations
    }

    get centerX() {
        return this.x + this.width / 2;
    }
}

/**
 * A horizontal scrollbar for the song.
 */
export class Scrollbar extends EditorObject {
    public color: string;
    public mouseHover: boolean;
    public active: boolean;
    public visible: boolean;

    constructor() {
        super();
        this.color = "black";
        this.height = 16;
        this.mouseHover = false;
        this.active = false;
        this.visible = true;
    }

    update(vm: Editor) {
        this.width = Math.max(
            ((globalState.value.editor?.viewport.width || 0) /
                globalState.value.song.size) *
                (vm.state.canvas.current?.width || 0),
            12
        );
        this.x =
            ((globalState.value.editor?.viewport.firstTick || 0) /
                globalState.value.song.size) *
            (vm.state.ctx?.canvas.width || 0);
        this.y = (vm.state.canvas.current?.height || 0) - this.height;
        this.visible =
            globalState.value.song.size >
            (globalState.value.editor?.viewport.width || 0);

        if (this.active) {
            this.color = "#555";
        } else if (this.intersectsPoint(vm.state.mouse)) {
            this.color = "#666";
        } else {
            this.color = "#777";
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    interact(vm: Editor, button: number) {
        if (button === 0) {
            this.active = true;
            return true;
        }

        return false;
    }

    interactEnd(vm: Editor) {
        this.active = false;
    }

    dragged(vm: Editor, dx: number, dy: number) {
        const ticksMoved =
            (dx / (vm.state.canvas.current?.width || 0)) *
            globalState.value.song.size;
        const newTick = globalState.value.song.currentTick + ticksMoved;
        globalState.value.song.currentTick = newTick;

        const editor = globalState.value.editor;

        if (editor) editor.viewport.firstTick = Math.floor(newTick) - 1;

        globalState.value.song.pause();
    }
}

/**
 * A vertical line in the editor.
 */
export class EditorLine extends EditorObject {
    public value: number;
    public visualWidth: number;
    public draggable: boolean;
    public dragging: boolean;
    public color: string;

    constructor() {
        super();
        /**
         * The tick that this line will display at.
         */
        this.value = 0;
        /**
         * The thickness of the line visually. Does not affect hitbox.
         */
        this.visualWidth = 2;
        /**
         * The real width of the line used in collision detection with the mouse. Does not affect visual appearance.
         */
        this.width = 4;
        /**
         * Is this line draggable?
         */
        this.draggable = false;
        /**
         * Is this line currently being dragged?
         */
        this.dragging = false;
        /**
         * The color of the line.
         */
        this.color = "black";
    }

    update(vm: Editor) {
        // Note to children: you **must** call super.update
        this.x =
            (this.value -
                (globalState.value.editor?.viewport.firstTick || 0)) *
                NOTE_SIZE -
            this.width / 2;
        this.height = vm.state.ctx?.canvas.height || 0;
        if (
            this.draggable &&
            (this.dragging || this.intersectsPoint(vm.state.mouse))
        ) {
            vm.setState({ cursor: "ew-resize" });
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        // Note to children: you **must** call super.render
        const x = this.centerX - this.visualWidth / 2;
        if (x + this.width < 0 || x > ctx.canvas.width) {
            return;
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(x, 0, this.visualWidth, this.height);
    }

    interact(vm: Editor, button: number) {
        if (button === 0 && this.draggable) {
            this.dragging = true;
            return true;
        }
        return false;
    }

    interactEnd(vm: Editor) {
        // Note to children: you **must** call super.interactEnd
        this.dragging = false;
    }
}

/**
 * The "seeker line", shows the current position in the song and allows you to seek to different parts.
 */
export class SeekerLine extends EditorLine {
    update(vm: Editor) {
        this.value = globalState.value.song.currentTick;
        this.draggable = true;
        super.update(vm);
    }

    dragged(vm: Editor, dx: number, dy: number) {
        const ticksMoved = dx / NOTE_SIZE;
        globalState.value.song.currentTick += ticksMoved;
        globalState.value.song.pause();
    }

    render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
        ctx.beginPath();
        ctx.moveTo(this.centerX - 8, 0);
        ctx.lineTo(this.centerX + 8, 0);
        ctx.lineTo(this.centerX, 8);
        ctx.fill();
    }
}

/**
 * Shows the start of the song.
 */
export class SongStartLine extends EditorLine {
    constructor() {
        super();
        this.value = 0;
        this.visualWidth = 1;
        this.color = "#999";
    }
}

/**
 * Shows the end of the song.
 */
export class SongEndLine extends EditorLine {
    constructor() {
        super();
        this.visualWidth = 1;
        this.color = "#999";
        this.draggable = true;
    }

    update(vm: Editor) {
        if (!this.dragging) {
            this.value = globalState.value.song.size;
        }
        super.update(vm);
    }

    dragged(vm: Editor, dx: number, dy: number) {
        this.value += dx / NOTE_SIZE;
    }

    interactEnd(vm: Editor) {
        this.value = Math.round(this.value);
        globalState.value.song.size = this.value;
        super.interactEnd(vm);
    }

    render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
    }
}

export class EditorWrapper extends EditorObject {
    public button?: number;
    public moved?: boolean;

    constructor() {
        super();

        this.reset();
    }

    intersectsPoint() {
        // we are everywhere.
        return true;
    }

    render() {
        // do nothing
    }

    reset() {
        this.button = 0;
        this.moved = false;
    }

    interact(vm: Editor, button: number) {
        this.button = button;
        const tick =
            Math.floor(vm.state.mouse.x / NOTE_SIZE) +
            (globalState.value.editor?.viewport.firstTick || 0);
        const layer = Math.floor(vm.state.mouse.y / NOTE_SIZE) - 1;

        if (this.button === 0) {
            const note = globalState.value.editor?.placeNote(layer, tick);

            // eslint-disable-next-line
            WebAudioNotePlayer.playNote(note!);
        } else if (button === 1) {
            const note = globalState.value.editor?.getNote(layer, tick);
            if (note) {
                globalState.value.editor?.pickNote(note);
            }
        } else if (button === 2) {
            globalState.value.editor?.deleteNote(layer, tick);
        }
        return true;
    }
}

export const Objects = {
    EditorLine,
    EditorObject,
    EditorWrapper,
    Scrollbar,
    SeekerLine,
    SongEndLine,
    SongStartLine,
};
