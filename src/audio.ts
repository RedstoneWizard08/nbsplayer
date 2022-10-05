// TODO: <audio> elements as fallback
// TODO: handle audio loading here

import type { Instrument } from "./NBS";

const audioContext = new AudioContext();
const audioDestination = audioContext.createGain();
audioDestination.connect(audioContext.destination);

export class WebAudioNotePlayer {
    public static setVolume(volume: number) {
        audioDestination.gain.value = volume;
    }

    public static playNote(
        key: number,
        instrument: Instrument,
        volume: number
    ) {
        const playbackRate = 2 ** (key / 12);

        let source: AudioBufferSourceNode | GainNode =
            audioContext.createBufferSource();

        source.playbackRate.value = playbackRate;
        source.buffer = instrument.audioBuffer!;
        source.start(0);

        if (volume !== 100) {
            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            source = gainNode;
        }

        source.connect(audioDestination);
    }

    public static decodeAudioData(buffer: ArrayBuffer) {
        return audioContext.decodeAudioData(buffer);
    }
}
