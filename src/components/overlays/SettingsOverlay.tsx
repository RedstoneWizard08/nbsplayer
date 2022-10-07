import { globalState } from "@/NBSPlayer";
import { FunctionComponent, h, Fragment } from "preact";

export const SettingsOverlay: FunctionComponent<{
    keyOffset: number;
}> = (props) => {
    return (
        <div>
            <h3>Settings</h3>
            <div>
                <label>
                    Key Offset
                    <input type="number" value={props.keyOffset} />
                </label>
            </div>
            <button onClick={() => (globalState.value.showSettings = false)}>
                Close
            </button>
        </div>
    );
};
