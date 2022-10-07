import { globalState, NBSPlayer } from "@/NBSPlayer";
import { Instrument } from "@/NBS";
import { Component, RefObject, h, Fragment } from "preact";
import { SongEditor } from "../editor/editor";

import "./InstrumentButton.scss";
import { WebAudioNotePlayer } from "@/audio";

export interface InstrumentButtonProps {
    instrument: Instrument;
    id?: string;
}

export class InstrumentButton extends Component<InstrumentButtonProps> {
    private text() {
        const words = this.props.instrument.name.split(" ");

        if (words.length === 1) return this.props.instrument.name.substr(0, 2);
        else {
            return words
                .slice(0, 2)
                .map((i) => i[0])
                .join("");
        }
    }

    public activate() {
        const editor = globalState.value.editor;
        if (editor) editor.currentInstrument = this.props.instrument;

        WebAudioNotePlayer
            .playNote(editor?.currentKey || 0, this.props.instrument);
    }

    public render() {
        return (
            <a
                className="instrument-button"
                onClick={this.activate}
                value={(
                    globalState.value.editor?.currentInstrument ===
                    this.props.instrument
                ).toString()}
                title={`Set Instrument to ${this.props.instrument.name}`}
                id={this.props.id}
            >
                <div className="instrument-body">{this.text().toString()}</div>
            </a>
        );
    }
}
