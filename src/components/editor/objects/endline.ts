import { NOTE_SIZE } from "../config";
import { EditorLine } from "./line";
import type { VM } from "./vm";

/**
 * Shows the end of the song.
 */
export class SongEndLine extends EditorLine {
    public constructor() {
        super();

        this.visualWidth = 1;
        this.color = "#999";
        this.draggable = true;
        this.value = 0;
    }

    public update(vm: VM) {
        if (!this.dragging) {
            this.value = vm.song.size;
        }
        super.update(vm);
    }

    public dragged(_vm: VM, dx: number) {
        this.value += dx / NOTE_SIZE;
    }

    public interactEnd(vm: VM, button: number) {
        this.value = Math.round(this.value);

        vm.song.size = this.value;

        super.interactEnd(vm, button);
    }
}
