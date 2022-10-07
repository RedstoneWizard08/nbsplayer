import { Song } from "@/NBS";
import { globalState } from "@/NBSPlayer";
import { createRef, RefObject, Component, h, Fragment } from "preact";
import { TargetedEvent } from "preact/compat";

import "./TimeBox.scss";

export class TimeBox extends Component<
    unknown,
    { tempoRef: RefObject<HTMLInputElement> }
> {
    private VANILLA_FRIENDLY_TEMPOS = [2.5, 5, 10];

    public constructor() {
        super();

        this.state = { tempoRef: createRef() };
    }

    private focusTempo(event: TargetedEvent<HTMLDivElement, Event>) {
        if ((event.target as HTMLElement).tagName.toLowerCase() != "div")
            return;

        this.state.tempoRef.current?.focus();
    }

    public formatTime(ms: number) {
        const time = Math.abs(ms) / 1000;
        const hours = Math.floor(time / 3600)
            .toString()
            .padStart(2, "0");
        const minutes = Math.floor((time / 60) % 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        const millis = Math.floor(Math.abs(ms) % 1000)
            .toString()
            .padStart(3, "0");
        const formatted = `${hours}:${minutes}:${seconds}.${millis}`;

        if (ms < 0) {
            return `-${formatted}`;
        }

        return formatted;
    }

    public render() {
        return (
            <div className="row flex flex-row flex-center timebox">
                <div className="times">
                    <div className="current">
                        {globalState.value.song.currentTime}
                    </div>
                    <div className="end">{globalState.value.song.endTime}</div>
                </div>

                <div
                    data-vanilla-friendly={this.VANILLA_FRIENDLY_TEMPOS.includes(
                        globalState.value.song.tempo
                    )}
                    onClick={this.focusTempo}
                    className="tempo-container"
                    title="Tempo in ticks per second"
                >
                    <input
                        ref={this.state.tempoRef}
                        type="number"
                        value={globalState.value.song.tempo}
                        className="no-spinners"
                        name="tempo"
                        step="0.25"
                    />
                    t/s
                </div>
            </div>
        );
    }
}
