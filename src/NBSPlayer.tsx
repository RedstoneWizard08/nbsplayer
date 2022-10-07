import { Component, createRef, RefObject, h, Fragment } from "preact";
import { Editor } from "./components/editor/Editor";
import { SongEditor } from "./components/editor/editor";
import { Keyboard } from "./components/keyboard/Keyboard";
import { LayerList } from "./components/layers/LayerList";
import { Overlay } from "./components/overlays/Overlay";
import { SettingsOverlay } from "./components/overlays/SettingsOverlay";
import { SongDetailsOverlay } from "./components/overlays/SongDetailsOverlay";
import { WelcomeOverlay } from "./components/overlays/WelcomeOverlay";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Instrument, Layer, Note, Song } from "./NBS";
import { getDefaultState, type EditorState } from "./state";
import { WebAudioNotePlayer } from "./audio";

import "./NBSPlayer.scss";
import { signal } from "@preact/signals";

export type OverlayName = "settings" | "songdetails" | "welcome";

export const globalState = signal<EditorState>(getDefaultState());

export class NBSPlayer extends Component {
    public componentDidMount() {
        const instruments = Instrument.builtin;

        Promise.all(instruments.map((i: Instrument) => i.load())).then(
            (() => {
                globalState.value.loading = false;
                globalState.value.showWelcome = true;
                globalState.value.interval = setInterval(this.tick.bind(this), 50);

                globalState.value = { ...globalState.value, loading: false, showWelcome: true, interval: setInterval(() => this.tick) };

                if (!globalState.value.editor)
                    globalState.value.editor = new SongEditor(
                        globalState.value.song
                    );
                
                console.log("Fully loaded!");
            }).bind(this)
        );

        window.onbeforeunload = () => {
            if (globalState.value.editor?.modified) {
                return "Your changes might not be saved";
            }
        };
    }

    public componentWillUnmount() {
        if (globalState.value.interval)
            clearInterval(globalState.value.interval);
    }

    public advanceSong(time: number, timePassed: number) {
        const song = globalState.value.song;

        if (song.paused) {
            return;
        }

        if (song.currentTick >= song.size) {
            if (globalState.value.options.loop) {
                song.currentTick = 0;
            } else {
                song.paused = true;
            }
            return;
        }

        const ticksPassed = timePassed / song.timePerTick;
        song.currentTick += ticksPassed;

        if (song.tick === globalState.value.lastPlayedTick) {
            return;
        }

        globalState.value.lastPlayedTick = song.tick;

        for (const layer of song.layers) {
            const note = layer.notes[song.tick];
            if (note) {
                WebAudioNotePlayer.playNote(note, layer);
                note.lastPlayed = time;
            }
        }
    }

    public tick() {
        const time = performance.now();

        const timePassed = Math.min(
            time - globalState.value.previousTime,
            500
        );

        globalState.value.previousTime = time;

        this.advanceSong(time, timePassed);

        globalState.value = { ...globalState.value, editorNeedsUpdate: true };
    }

    public render() {
        return (
            <>
                <div id="app">
                    {globalState.value.showWelcome && (
                        <Overlay>
                            <WelcomeOverlay />
                        </Overlay>
                    )}

                    {globalState.value.loading && (
                        <Overlay>
                            <div>
                                <b>Loading...</b>
                            </div>
                        </Overlay>
                    )}

                    {globalState.value.showSongDetails && (
                        <Overlay>
                            <SongDetailsOverlay
                                song={globalState.value.song}
                            />
                        </Overlay>
                    )}

                    {globalState.value.showSettings && (
                        <Overlay>
                            <SettingsOverlay
                                keyOffset={globalState.value.options.keyOffset}
                            />
                        </Overlay>
                    )}

                    <div id="main">
                        <Toolbar id="toolbar" />

                        <div id="middle">
                            <LayerList id="layer-list" />

                            <Editor id="editor" />
                        </div>

                        <Keyboard id="keyboard" />
                    </div>
                </div>
            </>
        );
    }
}
