import { WebAudioNotePlayer } from "@/audio";

/**
 * Represents an instrument
 */
export class Instrument {
  constructor(name, id, audioSrc, textureSrc, iconSrc, pressKey) {
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
    this.iconSrc = iconSrc;
    this.pressKey = pressKey;
    /**
     * The resulting audio buffer that will contain the sound
     * Set by loadAudio() or load()
     */
    this.audioBuffer = null;
  }

  load() {
    return Promise.all([this.loadAudio(), this.loadTexture(), this.loadIcon()]);
  }

  /**
   * Fetches the sound from the internet
   */
  loadAudio() {
    return fetch(this.audioSrc)
      .then((data) => data.arrayBuffer())
      .then((audioData) => WebAudioNotePlayer.decodeAudioData(audioData))
      .then((buffer) => (this.audioBuffer = buffer));
  }

  /**
   * Fetchs the texture from the internet
   */
  loadTexture() {
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
  loadIcon() {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = this.iconSrc;
      this.iconTexture = image;
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
    });
  }
}

/**
 * Builtin instruments
 */
Instrument.builtin = [
  // Vue will set the correct sources and sometimes inline images using require()
  new Instrument(
    "Harp",
    0,
    require("../assets/instruments/audio/harp.ogg"),
    require("../assets/instruments/textures/harp.png"),
    require("../assets/instruments/icon/harp.png"),
    true
  ),
  new Instrument(
    "Double Bass",
    1,
    require("../assets/instruments/audio/dbass.ogg"),
    require("../assets/instruments/textures/dbass.png"),
    require("../assets/instruments/icon/dbass.png"),
    false
  ),
  new Instrument(
    "Bass Drum",
    2,
    require("../assets/instruments/audio/bdrum.ogg"),
    require("../assets/instruments/textures/bdrum.png"),
    require("../assets/instruments/icon/bdrum.png"),
    false
  ),
  new Instrument(
    "Snare Drum",
    3,
    require("../assets/instruments/audio/sdrum.ogg"),
    require("../assets/instruments/textures/sdrum.png"),
    require("../assets/instruments/icon/sdrum.png"),
    false
  ),
  new Instrument(
    "Click",
    4,
    require("../assets/instruments/audio/click.ogg"),
    require("../assets/instruments/textures/click.png"),
    require("../assets/instruments/icon/click.png"),
    false
  ),
  new Instrument(
    "Guitar",
    5,
    require("../assets/instruments/audio/guitar.ogg"),
    require("../assets/instruments/textures/guitar.png"),
    require("../assets/instruments/icon/guitar.png"),
    false
  ),
  new Instrument(
    "Flute",
    6,
    require("../assets/instruments/audio/flute.ogg"),
    require("../assets/instruments/textures/flute.png"),
    require("../assets/instruments/icon/flute.png"),
    false
  ),
  new Instrument(
    "Bell",
    7,
    require("../assets/instruments/audio/bell.ogg"),
    require("../assets/instruments/textures/bell.png"),
    require("../assets/instruments/icon/bell.png"),
    false
  ),
  new Instrument(
    "Chime",
    8,
    require("../assets/instruments/audio/chime.ogg"),
    require("../assets/instruments/textures/chime.png"),
    require("../assets/instruments/icon/chime.png"),
    false
  ),
  new Instrument(
    "Xylophone",
    9,
    require("../assets/instruments/audio/xylophone.ogg"),
    require("../assets/instruments/textures/xylophone.png"),
    require("../assets/instruments/icon/xylophone.png"),
    false
  ),
  new Instrument(
    "Iron Xylophone",
    10,
    require("../assets/instruments/audio/iron_xylophone.ogg"),
    require("../assets/instruments/textures/iron_xylophone.png"),
    require("../assets/instruments/icon/iron_xylophone.png")
  ),
  new Instrument(
    "Cow Bell",
    11,
    require("../assets/instruments/audio/cow_bell.ogg"),
    require("../assets/instruments/textures/cow_bell.png"),
    require("../assets/instruments/icon/cow_bell.png")
  ),
  new Instrument(
    "Didgeridoo",
    12,
    require("../assets/instruments/audio/didgeridoo.ogg"),
    require("../assets/instruments/textures/didgeridoo.png"),
    require("../assets/instruments/icon/didgeridoo.png")
  ),
  new Instrument(
    "Bit",
    13,
    require("../assets/instruments/audio/bit.ogg"),
    require("../assets/instruments/textures/bit.png"),
    require("../assets/instruments/icon/bit.png")
  ),
  new Instrument(
    "Banjo",
    14,
    require("../assets/instruments/audio/banjo.ogg"),
    require("../assets/instruments/textures/banjo.png"),
    require("../assets/instruments/icon/banjo.png")
  ),
  new Instrument(
    "Pling",
    15,
    require("../assets/instruments/audio/pling.ogg"),
    require("../assets/instruments/textures/pling.png"),
    require("../assets/instruments/icon/pling.png")
  ),
];
