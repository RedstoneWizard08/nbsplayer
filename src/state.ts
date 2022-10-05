import { reactive } from "vue";
import { WebAudioNotePlayer } from "./audio";
import { SongEditor } from "./components/editor/editor";
import { Instrument, Layer, Note, Song } from "./NBS";

export interface SongData {
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
}

export const state = reactive({
    loading: true,
    song: Song.new(),
    editor: undefined as SongEditor | undefined,
    showWelcome: false,
    showSongDetails: false,
    showSettings: false,

    options: {
        keyOffset: 45, // F#4
        loop: false,
        volume: 1,
    },

    watch: {
        "options.volume"(volume: number) {
            WebAudioNotePlayer.setVolume(volume);
        },

        "options.loop"(loop: boolean) {
            if (loop && state.song.tick === state.song.size) {
                state.song.play();
            }
        },
    },

    setSong(song: Song) {
        this.song = song;
        this.editor = new SongEditor(song);
    },

    playNote(
        note: Note | number,
        instrumentOrLayer?: Instrument | Layer,
        layer?: Layer
    ) {
        if (instrumentOrLayer instanceof Instrument) {
            const key = typeof note === "number" ? note : note.key;
            const instrument = instrumentOrLayer;
            const volume = layer ? layer.volume : 100;

            WebAudioNotePlayer.playNote(
                key - this.options.keyOffset,
                instrument,
                volume
            );
        } else {
            if (!(note instanceof Note))
                throw new ReferenceError("Invalid note type!");

            const key = note.key;
            const instrument = note.instrument;
            const volume = layer ? layer.volume : 100;

            WebAudioNotePlayer.playNote(
                key - this.options.keyOffset,
                instrument!,
                volume
            );
        }
    },

    loadFile(file: File) {
        this.loading = true;

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        return new Promise((resolve, reject) => {
            fileReader.onload = (event) => {
                let song: Song;

                try {
                    song = Song.fromArrayBuffer(event.target?.result as any);
                } catch (err) {
                    return reject(err);
                }

                this.loading = false;
                this.setSong(song);

                if (
                    song.name ||
                    song.author ||
                    song.originalAuthor ||
                    song.description
                ) {
                    this.showSongDetails = true;
                }

                return resolve(song);
            };

            fileReader.onerror = (err) => reject(err);
        });
    },

    created() {
        this.editor = new SongEditor(this.song);
    },
});

export default state;
