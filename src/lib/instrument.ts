import { WebAudioNotePlayer } from "./audio";

/**
 * Represents an instrument
 */
export class Instrument {
    public name: string;
    public id: number;
    public audioSrc: string;
    public textureSrc: string;
    public iconSrc: string;
    public toolbarSrc: string;
    public pressKey?: boolean;
    public baseTexture?: HTMLImageElement;
    public iconTexture?: HTMLImageElement;
    public toolbarTexture?: HTMLImageElement;

    /**
     * The resulting audio buffer that will contain the sound
     * Set by loadAudio() or load()
     */
    public audioBuffer?: AudioBuffer;

    public constructor(
        name: string,
        id: number,
        audioSrc: string,
        textureSrc: string,
        iconSrc: string,
        toolbarSrc: string,
        pressKey?: boolean
    ) {
        /**
         * The name of the instrument
         */
        this.name = name;

        /**
         * The ID of the instrument
         */
        this.id = id;

        /**
         * The source to be fetched for the instrument's sound
         */
        this.audioSrc = audioSrc;

        /**
         * The image to be fetched for the instrument's image in the editor
         */
        this.textureSrc = textureSrc;
        this.toolbarSrc = toolbarSrc;

        this.iconSrc = iconSrc;
        this.pressKey = pressKey;
    }

    public load() {
        return Promise.all([this.loadAudio(), this.loadTexture(), this.loadIcon()]);
    }

    /**
     * Fetches the sound from the internet
     */
    public loadAudio() {
        return fetch(this.audioSrc)
            .then((data) => data.arrayBuffer())
            .then((audioData) => WebAudioNotePlayer.decodeAudioData(audioData))
            .then((buffer) => (this.audioBuffer = buffer));
    }

    /**
     * Fetchs the texture from the internet
     */
    public loadTexture() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.textureSrc;
            this.baseTexture = image;
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
        });
    }
    /**
     * Fetch small icon from Internet.
     */
    public loadIcon() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.iconSrc;
            this.iconTexture = image;
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
        });
    }
    /**
     * Fetch toolbar icon from Internet.
     */
    public loadToolbar() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = this.toolbarSrc;
            this.toolbarTexture = image;
            image.onload = () => resolve(image);
            image.onerror = (e) => reject(e);
        });
    }
}
