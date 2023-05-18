import { useAppState } from "@/stores/app";
import { EditorObject } from "./object";
import { NOTE_SIZE } from "../config";
import type { VM } from "./vm";

export class EditorWrapper extends EditorObject {
    public button?: number;
    public moved?: boolean;

    public constructor() {
        super();
        this.reset();
    }

    public intersectsPoint() {
        // we are everywhere.
        return true;
    }

    public render() {
        // do nothing
    }

    public reset() {
        this.button = 0;
        this.moved = false;
    }

    public interact(vm: VM, button: number) {
        this.button = button;

        const tick = Math.floor(vm.mouse.x / NOTE_SIZE) + (vm.editor?.viewport.firstTick || 0);
        const layer = Math.floor(vm.mouse.y / NOTE_SIZE) - 1;

        if (this.button === 0) {
            const note = vm.editor?.placeNote(layer, tick);

            if (note) useAppState().playNote(note);
        } else if (button === 1) {
            const note = vm.editor?.getNote(layer, tick);

            if (note) vm.editor?.pickNote(note);
        } else if (button === 2) {
            vm.editor?.deleteNote(layer, tick);
        }

        return true;
    }
}
