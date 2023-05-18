import { NOTE_SIZE } from "../config";
import { EditorObject } from "./object";
import type { VM } from "./vm";

/**
 * A vertical line in the editor.
 */
export class EditorLine extends EditorObject {
    public value: number;
    public visualWidth: number;
    public draggable: boolean;
    public dragging: boolean;
    public color: string;

    public constructor() {
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

    public update(vm: VM) {
        // Note to children: you **must** call super.update
        this.x = (this.value - (vm.editor?.viewport.firstTick || 0)) * NOTE_SIZE - this.width / 2;
        this.height = vm.ctx?.canvas.height || 0;

        if (this.draggable && (this.dragging || this.intersectsPoint(vm.mouse))) {
            vm.cursor = "ew-resize";
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        // Note to children: you **must** call super.render
        const x = this.centerX - this.visualWidth / 2;
        if (x + this.width < 0 || x > ctx.canvas.width) {
            return;
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(x, 0, this.visualWidth, this.height);
    }

    public interact(_vm: VM, button: number) {
        if (button === 0 && this.draggable) {
            this.dragging = true;

            return true;
        }

        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public interactEnd(_vm: VM, _button: number) {
        // Note to children: you **must** call super.interactEnd
        this.dragging = false;
    }
}
