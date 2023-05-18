import { NOTE_SIZE } from "../config";
import { EditorLine } from "./line";
import type { VM } from "./vm";

/**
 * The "seeker line", shows the current position in the song and allows you to seek to different parts.
 */
export class SeekerLine extends EditorLine {
    public update(vm: VM) {
        this.value = vm.song.currentTick;
        this.draggable = true;

        super.update(vm);
    }

    dragged(vm: VM, dx: number) {
        const ticksMoved = dx / NOTE_SIZE;

        vm.song.currentTick += ticksMoved;
        vm.song.pause();
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
