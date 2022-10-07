import { globalState, NBSPlayer } from "@/NBSPlayer";
import { Song } from "@/NBS";
import { Component, RefObject, h, Fragment } from "preact";
import { SongEditor } from "../editor/editor";
import { loadFileState } from "@/state";
import { TargetedEvent } from "preact/compat";

import "./Toolbar.scss";
import { InstrumentButton } from "./InstrumentButton";

export interface ToolbarProps {
    id?: string;
}

export class Toolbar extends Component<ToolbarProps> {
    private stop() {
        globalState.value.song.pause();
        globalState.value.song.currentTick = 0;
    }

    private openSettings() {
        globalState.value.showSettings = true;
    }

    private openInfo() {
        globalState.value.showSongDetails = true;
    }

    private toggleLoop() {
        globalState.value.options.loop = !globalState.value.options.loop;
    }

    private loadFile(event: TargetedEvent<HTMLInputElement, Event>) {
        globalState.value.song.pause();

        const target = event.target as HTMLInputElement;
        if (!target || !target.files) return;

        const file = target.files[0];
        loadFileState(file);
    }

    private newSong() {
        globalState.value.song = Song.new();
    }

    private save() {
        const buffer = Song.toArrayBuffer(globalState.value.song);

        const blob = new Blob([buffer], {
            type: "application/octet-stream",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${globalState.value.song.name || "song"}.nbs`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const editor = globalState.value.editor;
        if (editor) editor.modified = false;
    }

    private play() {
        globalState.value.song.play();
    }

    public render() {
        return (
            <div className="toolbar" id={this.props.id}>
                <a onClick={this.newSong} className="button" title="New">
                    <img
                        className="button-image"
                        src="/assets/toolbar/new.svg"
                        alt="New"
                    />
                </a>

                <a onClick={this.save} className="button" title="Save">
                    <img
                        className="button-image"
                        src="/assets/toolbar/save.svg"
                        alt="Save"
                    />
                </a>

                <a className="open button" title="Open">
                    <img
                        className="button-image"
                        src="/assets/toolbar/open.svg"
                        alt="Open"
                    />
                    <input type="file" accept=".nbs" onChange={this.loadFile} />
                </a>

                <div className="separator" />

                <a
                    onClick={this.play}
                    value={(!globalState.value.song.paused).toString()}
                    className="button"
                    title="Play"
                >
                    <img
                        className="button-image"
                        src="/assets/toolbar/play.svg"
                        alt="Play"
                    />
                </a>

                <a
                    onClick={globalState.value.song.pause}
                    value={globalState.value.song.paused.toString()}
                    className="button"
                    title="Pause"
                >
                    <img
                        className="button-image"
                        src="/assets/toolbar/pause.svg"
                        alt="Pause"
                    />
                </a>

                <a
                    onClick={this.stop}
                    value={(
                        globalState.value.song.paused &&
                        globalState.value.song.currentTime === 0
                    ).toString()}
                    className="button"
                    title="Stop"
                >
                    <img
                        className="button-image"
                        src="/assets/toolbar/stop.svg"
                        alt="Stop"
                    />
                </a>

                <div className="separator" />

                <a
                    onClick={this.toggleLoop}
                    value={globalState.value.options.loop.toString()}
                    title="Loop"
                    className="button"
                >
                    <img
                        className="button-image"
                        src="/assets/toolbar/loop.svg"
                        alt="Loop"
                    />
                </a>

                <a onClick={this.openInfo} title="Info" className="button">
                    <img
                        className="button-image"
                        src="/assets/toolbar/info.svg"
                        alt="Info"
                    />
                </a>

                <a
                    onClick={this.openSettings}
                    title="Settings"
                    className="button"
                >
                    <img
                        className="button-image"
                        src="/assets/toolbar/settings.svg"
                        alt="Settings"
                    />
                </a>

                <a title="Volume" className="volume button">
                    <img
                        className="button-image"
                        src="/assets/toolbar/volume.svg"
                        alt="Volume"
                    />
                    <input
                        type="range"
                        name="volume"
                        value={globalState.value.options.volume}
                        min="0"
                        max="1"
                        step="0.01"
                    />
                    <span className="volume-amount">
                        {(globalState.value.options.volume * 100)
                            .toFixed(0)
                            .toString()}
                        %
                    </span>
                </a>

                <div className="separator" />

                {globalState.value.song.instruments.map((instrument) => (
                    <InstrumentButton
                        key={instrument.id}
                        instrument={instrument}
                    />
                ))}
            </div>
        );
    }
}
