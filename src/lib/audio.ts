// TODO: <audio> elements as fallback
// TODO: handle audio loading here

import type { Instrument } from "./nbs";

const audioContext = new AudioContext();
const audioDestination = audioContext.createGain();
audioDestination.connect(audioContext.destination);

export class WebAudioNotePlayer {
    public static setVolume(volume: number) {
        audioDestination.gain.value = volume;
    }

    public static playNote(key: number, instrument: Instrument, volume: number) {
        const playbackRate = 2 ** (key / 12);

        const source = audioContext.createBufferSource();

        source.playbackRate.value = playbackRate;
        source.buffer = instrument.audioBuffer;

        source.start(0);

        let gain;

        if (volume !== 100) {
            const gainNode = audioContext.createGain();

            gainNode.gain.value = volume;

            source.connect(gainNode);

            gain = gainNode;
        }

        gain?.connect(audioDestination);
    }

    public static decodeAudioData(buffer: ArrayBuffer) {
        return audioContext.decodeAudioData(buffer);
    }
}
