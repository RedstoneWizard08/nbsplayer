import { Song } from "@/NBS";
import { globalState } from "@/NBSPlayer";
import { FunctionComponent, h, Fragment } from "preact";

import "./SongDetailsOverlay.scss";

export const SongDetailsOverlay: FunctionComponent<{
    song: Song;
}> = (props) => {
    return (
        <div className="details">
            <h2 className="title">
                {props.song.name.toString() || "Unnamed Song"}
            </h2>
            <div
                style={{
                    display: props.song.author ? "block" : "none",
                }}
            >
                Created by{" "}
                <b className="author">{props.song.author.toString()}</b>
            </div>
            <div
                style={{
                    display: props.song.originalAuthor ? "block" : "none",
                }}
            >
                Originally created by
                <b className="original-author">
                    {props.song.originalAuthor.toString()}
                </b>
            </div>

            <div>
                {props.song.description && (
                    <textarea
                        readOnly
                        className="description"
                        style={{
                            display: props.song.description ? "block" : "none",
                        }}
                        value={props.song.description}
                    />
                )}
            </div>

            <div>
                <button
                    onClick={() => (globalState.value.showSongDetails = false)}
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};
