import { NBSPlayer } from "@/NBSPlayer";
import { RefObject, FunctionComponent, h, Fragment } from "preact";
import { SongEditor } from "../editor/editor";
import { Octave } from "./Octave";

import "./Keyboard.scss";

export const Keyboard: FunctionComponent<{
    id?: string;
}> = (props) => {
    return (
        <div className="keyboard flex flex-row" id={props.id}>
            <Octave start={21} />
            <Octave start={33} />
            <Octave start={45} />
            <Octave start={57} />
        </div>
    );
};
