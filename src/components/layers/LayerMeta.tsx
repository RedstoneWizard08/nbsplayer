import { Layer } from "@/NBS";
import { Component, h, Fragment } from "preact";
import { TargetedEvent } from "preact/compat";

import "./LayerMeta.scss";

export class LayerMeta extends Component<{ layer: Layer }> {
    private onChange(event: TargetedEvent<HTMLInputElement, Event>) {
        this.props.layer.volume =
            parseInt((event.target as HTMLInputElement).value) / 100;
    }

    public render() {
        return (
            <div className="row layer">
                <div className="child">
                    <input
                        type="text"
                        value={this.props.layer.name}
                        placeholder={this.props.layer.placeholder}
                        name="name"
                    />

                    <input
                        type="number"
                        value={this.props.layer.volume * 100}
                        name="volume"
                        className="no-spinners"
                        onChange={this.onChange}
                    />

                    <a
                        className="delete-button"
                        onClick={this.props.layer.delete}
                        title="Delete layer"
                    >
                        &times;
                    </a>
                </div>
            </div>
        );
    }
}
