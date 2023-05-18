import { EditorObject } from "./object";
import type { VM } from "./vm";

/**
 * A horizontal scrollbar for the song.
 */
export class Scrollbar extends EditorObject {
    public color: string;
    public mouseHover: boolean;
    public active: boolean;
    public visible: boolean;

    public constructor() {
        super();
        this.color = "black";
        this.height = 16;
        this.mouseHover = false;
        this.active = false;
        this.visible = true;
    }

    public update(vm: VM) {
        this.width = Math.max(
            ((vm.editor?.viewport.width || 0) / (vm.song?.size || 0)) * (vm.canvas?.width || 0),
            12
        );
        this.x =
            ((vm.editor?.viewport.firstTick || 0) / (vm.song?.size || 0)) *
            (vm.ctx?.canvas.width || 0);
        this.y = (vm.canvas?.height || 0) - this.height;
        this.visible = (vm.song?.size || 0) > (vm.editor?.viewport.width || 0);

        if (this.active) {
            this.color = "#555";
        } else if (this.intersectsPoint(vm.mouse)) {
            this.color = "#666";
        } else {
            this.color = "#777";
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (this.visible) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    public interact(_vm: VM, button: number) {
        if (button === 0) {
            this.active = true;
            return true;
        }

        return false;
    }

    public interactEnd() {
        this.active = false;
    }

    public dragged(vm: VM, dx: number) {
        const ticksMoved = (dx / (vm.canvas?.width || 0)) * (vm.song?.size || 0);
        const newTick = (vm.song?.currentTick || 0) + ticksMoved;

        if (vm.song) vm.song.currentTick = newTick;

        if (vm.editor) vm.editor.viewport.firstTick = Math.floor(newTick) - 1;

        vm.song?.pause();
    }
}
