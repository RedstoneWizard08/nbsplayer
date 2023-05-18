import { ref } from "vue";
import { defineStore } from "pinia";
import { useOptions } from "./options";
import { Instrument, WebAudioNotePlayer, type Layer, type Note, Song } from "@/lib/nbs";
import { SongEditor } from "@/components/editor/editor";
import { Language } from "@/lib/lang";

export const useAppState = defineStore("app", {
    state: () => {
        const loading = ref(true);
        const song = ref(Song.new());
        const editor = ref<SongEditor | null>(null);
        const showWelcome = ref(false);
        const showSongDetails = ref(false);
        const showSettings = ref(false);
        const lang = ref(new Language("en_US"));

        const setSong = (newSong: Song) => {
            song.value = newSong;
            editor.value = new SongEditor(newSong);
        };

        function playNote(note: Note): void;
        function playNote(note: Note | number, b: Instrument | Layer): void;
        function playNote(note: Note | number, b: Instrument, c: Layer): void;
        function playNote(note: Note | number, b?: Instrument | Layer, c?: Layer): void {
            let key;
            let instrument;
            let volume;

            if (b instanceof Instrument) {
                key = typeof note === "number" ? note : note.key;
                instrument = b;
                volume =
                    (c ? c.volume / 100 : 1) * (typeof note === "number" ? 1 : note.velocity / 100);
            } else {
                key = (note as Note).key;
                instrument = (note as Note).instrument!;
                volume = ((b ? b.volume / 100 : 1) * (note as Note).velocity) / 100;
            }

            WebAudioNotePlayer.playNote(key - useOptions().keyOffset, instrument, volume);
        }

        const loadFile = (file: Blob) => {
            loading.value = true;

            // Load the file as an arraybuffer so we can really operate on it.
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            // Promise wrapper so other functions can know if/when the loading finishes.
            return new Promise((resolve, reject) => {
                fileReader.onload = (e) => {
                    let song: Song;

                    try {
                        song = Song.fromArrayBuffer(e.target?.result as ArrayBuffer);
                    } catch (e) {
                        reject(e);
                        return;
                    }

                    loading.value = false;
                    setSong(song);

                    if (song.name || song.author || song.originalAuthor || song.description) {
                        showSongDetails.value = true;
                    }

                    resolve(song);
                };

                fileReader.onerror = (err) => reject(err);
            });
        };

        return {
            loading,
            song,
            editor,
            showWelcome,
            showSongDetails,
            showSettings,
            setSong,
            loadFile,
            playNote,
            lang,
        };
    },

    persist: true,
});
