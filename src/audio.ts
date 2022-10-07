// TODO: <audio> elements as fallback
// TODO: handle audio loading here

import { Instrument, Layer, Note } from "./NBS";

const audioContext = new AudioContext();
const audioDestination = audioContext.createGain();
audioDestination.connect(audioContext.destination);

export class WebAudioNotePlayer {
    public static setVolume(volume: number) {
        audioDestination.gain.value = volume;
    }

    public static playNote(
        note: number | Note,
        instrument_?: Instrument | Layer,
        volume_?: number
    ) {
        if (!instrument_ && !(note instanceof Note))
            throw new ReferenceError("No instrument found!");

        const key = note instanceof Note ? note.key : note;

        const instrument = instrument_
            ? instrument_ instanceof Layer
                ? Instrument.builtin[0]
                : instrument_
            : (note as Note).instrument;

        const volume = volume_ || 100;

        const playbackRate = 2 ** (key / 12);

        let source: AudioBufferSourceNode | GainNode =
            audioContext.createBufferSource();

        source.playbackRate.value = playbackRate;

        if (instrument && instrument.audioBuffer)
            source.buffer = instrument.audioBuffer;
        
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
