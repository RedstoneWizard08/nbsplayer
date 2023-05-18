import { Vec2 } from "./vec";
import type { VM } from "./vm";

/**
 * An object in the editor.
 */
export class EditorObject {
    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.height = 0;
        this.width = 0;
    }

    /**
     * Updates the sprite in some way.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(vm: VM) {
        // left to implementations
    }

    /**
     * Determines if this object intersects a point.
     * If both `a` and `b` are provided, the point to be tested is (a, b)
     * If only `a` is provided, the point to be tested is (a.x, a.y)
     */
    public intersectsPoint(a: Vec2): boolean;
    public intersectsPoint(a: number, b: number): boolean;
    public intersectsPoint(a: Vec2 | number, b?: number): boolean {
        let x2: number, y2: number;

        if (!b && a instanceof Vec2) {
            x2 = a.x;
            y2 = a.y;
        } else {
            x2 = a as number;
            y2 = b as number;
        }

        const { x, y, width: w, height: h } = this;

        return x2 >= x && x2 <= x + w && y2 >= y && y2 <= y + h;
    }

    /**
     * Render this object on a 2d canvas.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public render(_ctx: CanvasRenderingContext2D, _time: number) {
        throw new Error("EditorObject did not implement `render(ctx) { ... }`");
    }

    /**
     * Attempt to begin an interaction with this object.
     * `true` indicates that the interaction has successfully started, `false` indicates that it has not.
     * `false` does not mean an error has occurred, just that this object does not want to be interacted with.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public interact(_vm: VM, button: number) {
        return false;
    }

    /**
     * The object has been dragged after the interaction has started.
     * Is given the delta x and delta y (movement in x and y direction)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public dragged(vm: VM, _dx: number, _dy: number) {
        // left to implementations
    }

    /**
     * Indicates the object is no longer being interacted with.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public interactEnd(vm: VM, _button?: number) {
        // left to implementations
    }

    public get centerX() {
        return this.x + this.width / 2;
    }
}
