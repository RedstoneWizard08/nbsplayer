import { WebAudioNotePlayer } from "@/audio";
import { globalState, NBSPlayer } from "@/NBSPlayer";
import { RefObject, Component, h, Fragment } from "preact";
import { SongEditor } from "../editor/editor";

import "./Key.scss";

export class Key extends Component<{
    sharp: boolean;
    note: number;
}> {
    private vanillaFriendly() {
        return this.props.note >= 33 && this.props.note <= 59;
    }

    private selected() {
        return globalState.value.editor?.currentKey === this.props.note;
    }

    private text() {
        return SongEditor.formatKey(this.props.note);
    }

    public select() {
        const editor = globalState.value.editor;
        if (editor) editor.currentKey = this.props.note;

        WebAudioNotePlayer.playNote(this.props.note, editor?.currentInstrument);
    }

    private getClasses() {
        let classes = "key ";

        if (this.props.sharp) classes += "sharp ";
        if (this.vanillaFriendly()) classes += "vanilla ";
        if (this.selected()) classes += "selected ";

        classes.trim();

        return classes;
    }

    public render() {
        return (
            <div className={this.getClasses()} onClick={this.select}>
                <div className="text">{this.text().toString()}</div>
            </div>
        );
    }
}
