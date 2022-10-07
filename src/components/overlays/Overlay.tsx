import "./Overlay.scss";
import { FunctionComponent, ComponentChildren, h, Fragment } from "preact";

export interface OverlayProps {
    children?: ComponentChildren;
}

export const Overlay: FunctionComponent<OverlayProps> = (props) => {
    return (
        <div className="overlay-container">
            <div className="overlay">{props.children}</div>
        </div>
    );
};
