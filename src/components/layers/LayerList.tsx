import { Song } from "@/NBS";
import { FunctionComponent, h, Fragment } from "preact";
import { LayerMeta } from "./LayerMeta";
import { TimeBox } from "./TimeBox";

import "./LayerList.scss";
import { globalState } from "@/NBSPlayer";

export const LayerList: FunctionComponent<{ id?: string }> = (props) => {
    return (
        <div className="layer-list" id={props.id}>
            <TimeBox />

            {globalState.value.song.layers.map((layer) => (
                <LayerMeta layer={layer} key={layer.id} />
            ))}

            <button onClick={globalState.value.song.addLayer} className="row">
                + layer
            </button>
        </div>
    );
};
