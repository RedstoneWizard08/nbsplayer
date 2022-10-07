import { RefObject, FunctionComponent, h, Fragment } from "preact";
import { SongEditor } from "../editor/editor";
import { Key } from "./Key";

import "./Octave.scss";

export const Octave: FunctionComponent<{
    start: number;
}> = (props) => {
    return (
        <div className="octave">
            <div className="keyboard-key">
                <Key note={props.start + 1} sharp={false} />
                <Key note={props.start + 2} sharp={true} />
            </div>
            <div className="keyboard-key">
                <Key note={props.start + 3} sharp={false} />
                <Key note={props.start + 4} sharp={true} />
            </div>
            <div className="keyboard-key">
                <Key note={props.start + 5} sharp={false} />
            </div>
            <div className="keyboard-key">
                <Key note={props.start + 6} sharp={false} />
                <Key note={props.start + 7} sharp={true} />
            </div>
            <div className="keyboard-key">
                <Key note={props.start + 8} sharp={false} />
                <Key note={props.start + 9} sharp={true} />
            </div>
            <div className="keyboard-key">
                <Key note={props.start + 10} sharp={false} />
            </div>
            <div className="keyboard-key">
                <Key note={props.start + 11} sharp={false} />
                <Key note={props.start + 12} sharp={true} />
            </div>
        </div>
    );
};
