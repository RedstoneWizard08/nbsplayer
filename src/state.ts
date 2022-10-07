import { RefObject, createRef } from "preact";
import { globalState, NBSPlayer } from "./NBSPlayer";
import { Editor } from "./components/editor/Editor";
import { SongEditor } from "./components/editor/editor";
import { Overlay } from "./components/overlays/Overlay";
import { Instrument, Layer, Note, Song } from "./NBS";
import { WebAudioNotePlayer } from "./audio";

export interface EditorState {
    /**
     * Is something still loading?
     */
    loading: boolean;

    /**
     * Currently loaded song
     */
    song: Song;

    /**
     * Allows you to edit the song.
     */
    editor?: SongEditor;

    /**
     * Show the welcome message?
     */
    showWelcome: boolean;

    /**
     * Show the song details overlay?
     */
    showSongDetails: boolean;

    /**
     * Show the settings overlay?
     */
    showSettings: boolean;

    /**
     * Somewhat-global options.
     */
    options: {
        /**
         * Offset of note key to the actual sound that is played.
         */
        keyOffset: number;

        /**
         * Loop the song
         */
        loop: boolean;

        /**
         * Global volume of the song. (0-1)
         */
        volume: number;
    };

    previousTime: number;
    lastPlayedTick: number;
    interval?: NodeJS.Timer;

    editorNeedsUpdate: boolean;
}

export const getDefaultState = (): EditorState => {
    return {
        loading: true,
        song: Song.new(),
        editor: undefined,
        showWelcome: false,
        showSongDetails: false,
        showSettings: false,

        options: {
            keyOffset: 45, // F#4
            loop: false,
            volume: 1,
        },

        previousTime: -1,
        lastPlayedTick: -1,

        editorNeedsUpdate: false,
    };
};

export const loadFileState = async (file: File) => {
    globalState.value = { ...globalState.value, loading: true };

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    return await new Promise((resolve, reject) => {
        fileReader.onload = (event) => {
            let song: Song;

            try {
                song = Song.fromArrayBuffer(
                    event.target?.result as ArrayBuffer
                );
            } catch (err) {
                return reject(err);
            }

            globalState.value = {
                ...globalState.value,
                loading: false,
                song: song,
                editor: new SongEditor(song),
            };

            if (
                song.name ||
                song.author ||
                song.originalAuthor ||
                song.description
            ) {
                globalState.value = { ...globalState.value, showSongDetails: true };
            }

            return resolve(song);
        };

        fileReader.onerror = (err) => reject(err);
    });
};
