import { globalState, NBSPlayer } from "@/NBSPlayer";
import { createRef, Component, RefObject, h, Fragment } from "preact";
import { NOTE_SIZE } from "./config";
import { SongEditor } from "./editor";
import { EditorObject, Objects } from "./objects";

import "./Editor.scss";
import { Instrument, Note, Song } from "@/NBS";
import { effect } from "@preact/signals";

export type EditorTextureCache = { [key: string]: HTMLCanvasElement };

export interface EditorMouseState {
    x: number;
    y: number;

    right: boolean;
    left: boolean;
    middle: boolean;
}

export interface EditorState {
    canvas: RefObject<HTMLCanvasElement>;
    ctx?: CanvasRenderingContext2D;
    textureCache: EditorTextureCache;
    cursor: string;
    mouse: EditorMouseState;
    boundingRects?: DOMRect;
    objects: EditorObject[];
    interaction?: EditorObject;
}

export class Editor extends Component<{ id?: string }, EditorState> {
    public constructor() {
        super();

        this.state = {
            canvas: createRef(),
            ctx: undefined,
            textureCache: {},
            cursor: "",
            mouse: {
                x: 0,
                y: 0,
                right: false,
                left: false,
                middle: false,
            },
            boundingRects: undefined,
            objects: [],
            interaction: undefined,
        };
    }

    public componentDidMount() {
        this.setState({
            ctx: this.state.canvas.current?.getContext("2d") || undefined,

            objects: [
                new Objects.EditorWrapper(),
                new Objects.SongEndLine(),
                new Objects.SongStartLine(),
                new Objects.SeekerLine(),
                new Objects.Scrollbar(),
            ],
        });
    }

    private preventDefault(event: Event) {
        event.preventDefault();
    }

    private handleMouse(event: MouseEvent) {
        this.preventDefault(event);

        if (event.type === "mouseup" || event.type === "mousedown") {
            const isDown = event.type === "mousedown";

            if (event.button === 0) {
                this.setState({ mouse: { ...this.state.mouse, left: isDown } });
            } else if (event.button === 1) {
                this.setState({
                    mouse: { ...this.state.mouse, middle: isDown },
                });
            } else if (event.button === 2) {
                this.setState({
                    mouse: { ...this.state.mouse, right: isDown },
                });
            }

            if (isDown) {
                this.findInteraction(event.button);
            } else {
                this.endInteraction();
            }
        } else if (event.type === "mousemove") {
            const prevX = this.state.mouse.x;
            const prevY = this.state.mouse.y;

            // this.state.mouse.x = event.clientX - this.state.boundingRects.left;
            // this.state.mouse.y = event.clientY - this.state.boundingRects.top;

            this.setState({
                mouse: {
                    ...this.state.mouse,
                    x: event.clientX - (this.state.boundingRects?.left || 0),
                    y: event.clientY - (this.state.boundingRects?.top || 0),
                },
            });

            if (this.state.interaction) {
                const dx = this.state.mouse.x - prevX;
                const dy = this.state.mouse.y - prevY;

                this.state.interaction.dragged(this, dx, dy);
            }
        }
    }

    private endInteraction() {
        if (!this.state.interaction) {
            return;
        }

        this.state.interaction.interactEnd(this);
        this.setState({ interaction: undefined });
    }

    private findInteraction(button: number) {
        let i = this.state.objects.length;

        while (i--) {
            const object = this.state.objects[i];

            if (object.intersectsPoint(this.state.mouse)) {
                const interaction = object.interact(this, button);

                if (interaction) {
                    this.setState({ interaction: object });
                    return true;
                }
            }
        }

        return false;
    }

    public updateObjects() {
        for (const object of this.state.objects) {
            object.update(this);
        }
    }

    public renderObjects(time: number) {
        if (!this.state.ctx) return;

        for (const object of this.state.objects) {
            object.render(this.state.ctx, time);
        }
    }

    public drawNotes(time: number) {
        const createNoteTexture = (instrument?: Instrument, key?: number) => {
            // Create a canvas that lets us do image operations
            const canvas = document.createElement("canvas");
            canvas.width = NOTE_SIZE;
            canvas.height = NOTE_SIZE;

            const ctx = canvas.getContext("2d");
            ctx?.drawImage(instrument?.baseTexture || new Image(), 0, 0);

            // Fixes the note textures to be less terrible
            // (darken and add border)
            if (ctx) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
            }

            ctx?.rect(0, 0, canvas.width, canvas.height);
            ctx?.fill();
            ctx?.stroke();

            // Draw the key text centered
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.font = "12px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
            }

            const text = SongEditor.formatKey(key || 0);
            ctx?.fillText(text, NOTE_SIZE / 2, NOTE_SIZE / 2);

            return canvas;
        };

        // Determine what we need to draw.
        const visibleTicks = globalState.value.editor?.viewport.width || 0;
        const start = globalState.value.editor?.viewport.firstTick || 0;
        const end = globalState.value.editor?.viewport.lastTick || 0;

        // The note rendering loop loops through all the layers, and then through each note we need to draw.
        for (
            let l = 0;
            l < (globalState.value.editor?.song.layers.length || 0);
            l++
        ) {
            const layer = globalState.value.editor?.song.layers[l];

            // Skip rows which do not contain enough notes to be rendered at this point
            if (!layer || layer.notes.length < start) {
                continue;
            }

            const y = l * NOTE_SIZE;

            for (let t = start; t < end; t++) {
                const x = (t - start) * NOTE_SIZE;
                const note: Note = layer.notes[t];

                // Ofcourse theres no guarantee that a note exists at any point in a layer.
                if (!note) {
                    continue;
                }

                // If the note has been played recently (1s), we will make it render slightly transparent to indicate it
                // was recently played.
                const timeSincePlayed =
                    note.lastPlayed === null
                        ? Infinity
                        : time - (note.lastPlayed || 0);
                if (timeSincePlayed < 1000) {
                    // Opacity between 1 (played exactly 1s ago) and 0.5 (played exactly 0s ago)
                    // eslint-disable-next-line react/no-direct-mutation-state
                    if (this.state.ctx)
                        this.state.ctx.globalAlpha =
                            1 - (1000 - timeSincePlayed) / 2000;
                }

                // A hopefully unique id given to this note's texture.
                // All notes with the same characteristics will have the same texture id.
                const textureId = `${note.instrument?.id}-${note.key}`;

                if (!(textureId in this.state.textureCache)) {
                    const texture = createNoteTexture(
                        note.instrument,
                        note.key
                    );

                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.state.textureCache[textureId] = texture;
                }

                // eslint-disable-next-line react/no-direct-mutation-state
                this.state.ctx?.drawImage(
                    this.state.textureCache[textureId],
                    x,
                    y
                );

                // If we mucked with the opacity, remeber to cleanup after ourselves.
                if (timeSincePlayed < 1000) {
                    // eslint-disable-next-line react/no-direct-mutation-state
                    if (this.state.ctx) this.state.ctx.globalAlpha = 1;
                }
            }
        }
    }

    private isHidden() {
        return !!(
            document.hidden ||
            // @ts-ignore - Support for Microsoft Edge / IE
            document.msHidden ||
            // @ts-ignore - Support for Chrome and other WebKit-based browsers
            document.webkitHidden ||
            // @ts-ignore - Support for Mozilla Firefox
            document.mozHidden
        );
    }

    public update(time: number) {
        if (this.isHidden()) {
            return;
        }

        // TODO: getting client rects is sometimes slow, cache it?
        const boundingClientRect =
            this.state.canvas.current?.getBoundingClientRect();

        if (this.state.canvas.current) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.canvas.current.height = boundingClientRect?.height || 0;

            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.canvas.current.width = boundingClientRect?.width || 0;
        }

        this.setState({ boundingRects: boundingClientRect });

        const editor = globalState.value.editor;

        if (editor)
            editor.viewport.width =
                (this.state.canvas.current?.width || 0) / NOTE_SIZE;

        globalState.value.editor?.updateViewport();

        this.setState({ cursor: "" });

        this.updateObjects();

        this.state.ctx?.save();
        this.state.ctx?.translate(0, NOTE_SIZE);
        this.drawNotes(time);
        this.state.ctx?.restore();

        this.renderObjects(time);

        if (this.state.canvas.current)
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.canvas.current.style.cursor = this.state.cursor;
    }

    public render() {
        effect(() => {
            if (globalState.value.editorNeedsUpdate != false) {
                this.update(performance.now());

                console.log("Update call");

                globalState.value.editorNeedsUpdate = false;
            }
        });

        return (
            <div className="editor" id={this.props.id}>
                <canvas
                    onMouseDown={this.handleMouse}
                    onMouseUp={this.handleMouse}
                    onMouseMove={this.handleMouse}
                    onContextMenu={this.preventDefault}
                />
            </div>
        );
    }
}
