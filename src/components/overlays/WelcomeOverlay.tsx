import { globalState, NBSPlayer } from "@/NBSPlayer";
import { Song } from "@/NBS";
import { loadFileState } from "@/state";
import { Component, h, Fragment } from "preact";
import { TargetedEvent } from "preact/compat";
// import { FontAwesomeIcon } from "../FontAwesomeIcon";

import "./WelcomeOverlay.scss";

export class WelcomeOverlay extends Component {
    private handleFileInput(event: TargetedEvent<HTMLInputElement, Event>) {
        const target = event.target as HTMLInputElement;

        if (!target.files || target.files?.length === 0) {
            return;
        }
        const file = target.files[0];

        loadFileState(file).then(() => this.hide());
    }

    private newSong() {
        globalState.value.song = Song.new();

        this.hide();
    }

    public hide() {
        globalState.value = { ...globalState.value, showWelcome: false };
    }

    public show() {
        globalState.value = { ...globalState.value, showWelcome: true };
    }

    public render() {
        return (
            <div className="flex flex-row">
                <div className="about section">
                    <h1>nbsplayer</h1>
                    <p>It's like Note Block Studio.</p>
                    <p>
                        Note sounds and textures are owned by Mojang. Not
                        approved by or associated with Mojang.
                    </p>
                </div>

                <div className="actions section">
                    <div className="load-song button flex flex-row flex-center">
                        {/* <FontAwesomeIcon
                            icon="folder-open"
                            fixed-width
                            size="2x"
                        /> */}
                        <div className="button-body">Load a song</div>
                        <input
                            className="file-input"
                            type="file"
                            accept=".nbs"
                            onChange={this.handleFileInput}
                        />
                    </div>
                    <div
                        className="new-song button flex flex-row flex-center"
                        onClick={this.newSong}
                    >
                        {/* <FontAwesomeIcon icon="file" fixed-width size="2x" /> */}
                        <div className="button-body">Create a new song</div>
                    </div>
                    <div
                        className="new-song button flex flex-row flex-center"
                        onClick={this.hide}
                        id="dismiss"
                    >
                        {/* <FontAwesomeIcon
                            icon="times-circle"
                            fixed-width
                            size="2x"
                        /> */}
                        <div className="button-body">Dismiss</div>
                    </div>
                </div>
            </div>
        );
    }
}
