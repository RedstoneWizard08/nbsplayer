import harp_sound from "@/assets/instruments/audio/harp.ogg";
import harp_icon from "@/assets/instruments/icon/harp.png";
import harp_texture from "@/assets/instruments/textures/harp.png";
import harp_toolbar from "@/assets/toolbar/instruments/Harp.png";

import dbass_sound from "@/assets/instruments/audio/dbass.ogg";
import dbass_icon from "@/assets/instruments/icon/dbass.png";
import dbass_texture from "@/assets/instruments/textures/dbass.png";
import dbass_toolbar from "@/assets/toolbar/instruments/Double Bass.png";

import bdrum_sound from "@/assets/instruments/audio/bdrum.ogg";
import bdrum_icon from "@/assets/instruments/icon/bdrum.png";
import bdrum_texture from "@/assets/instruments/textures/bdrum.png";
import bdrum_toolbar from "@/assets/toolbar/instruments/Bass Drum.png";

import sdrum_sound from "@/assets/instruments/audio/sdrum.ogg";
import sdrum_icon from "@/assets/instruments/icon/sdrum.png";
import sdrum_texture from "@/assets/instruments/textures/sdrum.png";
import sdrum_toolbar from "@/assets/toolbar/instruments/Snare Drum.png";

import click_sound from "@/assets/instruments/audio/click.ogg";
import click_icon from "@/assets/instruments/icon/click.png";
import click_texture from "@/assets/instruments/textures/click.png";
import click_toolbar from "@/assets/toolbar/instruments/Click.png";

import guitar_sound from "@/assets/instruments/audio/guitar.ogg";
import guitar_icon from "@/assets/instruments/icon/guitar.png";
import guitar_texture from "@/assets/instruments/textures/guitar.png";
import guitar_toolbar from "@/assets/toolbar/instruments/Guitar.png";

import flute_sound from "@/assets/instruments/audio/flute.ogg";
import flute_icon from "@/assets/instruments/icon/flute.png";
import flute_texture from "@/assets/instruments/textures/flute.png";
import flute_toolbar from "@/assets/toolbar/instruments/Flute.png";

import bell_sound from "@/assets/instruments/audio/bell.ogg";
import bell_icon from "@/assets/instruments/icon/bell.png";
import bell_texture from "@/assets/instruments/textures/bell.png";
import bell_toolbar from "@/assets/toolbar/instruments/Bell.png";

import chime_sound from "@/assets/instruments/audio/chime.ogg";
import chime_icon from "@/assets/instruments/icon/chime.png";
import chime_texture from "@/assets/instruments/textures/chime.png";
import chime_toolbar from "@/assets/toolbar/instruments/Chime.png";

import xylophone_sound from "@/assets/instruments/audio/xylophone.ogg";
import xylophone_icon from "@/assets/instruments/icon/xylophone.png";
import xylophone_texture from "@/assets/instruments/textures/xylophone.png";
import xylophone_toolbar from "@/assets/toolbar/instruments/Xylophone.png";

import iron_xylophone_sound from "@/assets/instruments/audio/iron_xylophone.ogg";
import iron_xylophone_icon from "@/assets/instruments/icon/iron_xylophone.png";
import iron_xylophone_texture from "@/assets/instruments/textures/iron_xylophone.png";
import iron_xylophone_toolbar from "@/assets/toolbar/instruments/Iron Xylophone.png";

import cow_bell_sound from "@/assets/instruments/audio/cow_bell.ogg";
import cow_bell_icon from "@/assets/instruments/icon/cow_bell.png";
import cow_bell_texture from "@/assets/instruments/textures/cow_bell.png";
import cow_bell_toolbar from "@/assets/toolbar/instruments/Cow Bell.png";

import didgeridoo_sound from "@/assets/instruments/audio/didgeridoo.ogg";
import didgeridoo_icon from "@/assets/instruments/icon/didgeridoo.png";
import didgeridoo_texture from "@/assets/instruments/textures/didgeridoo.png";
import didgeridoo_toolbar from "@/assets/toolbar/instruments/Didgeridoo.png";

import bit_sound from "@/assets/instruments/audio/bit.ogg";
import bit_icon from "@/assets/instruments/icon/bit.png";
import bit_texture from "@/assets/instruments/textures/bit.png";
import bit_toolbar from "@/assets/toolbar/instruments/Bit.png";

import banjo_sound from "@/assets/instruments/audio/banjo.ogg";
import banjo_icon from "@/assets/instruments/icon/banjo.png";
import banjo_texture from "@/assets/instruments/textures/banjo.png";
import banjo_toolbar from "@/assets/toolbar/instruments/Banjo.png";

import pling_sound from "@/assets/instruments/audio/pling.ogg";
import pling_icon from "@/assets/instruments/icon/pling.png";
import pling_texture from "@/assets/instruments/textures/pling.png";
import pling_toolbar from "@/assets/toolbar/instruments/Pling.png";
import { Instrument } from "./instrument";

export const instruments = [
    new Instrument(
        "Harp",
        0,
        harp_sound,
        harp_texture,
        harp_icon,
        harp_toolbar,
        true,
    ),
    new Instrument(
        "Double Bass",
        1,
        dbass_sound,
        dbass_texture,
        dbass_icon,
        dbass_toolbar,
        false,
    ),
    new Instrument(
        "Bass Drum",
        2,
        bdrum_sound,
        bdrum_texture,
        bdrum_icon,
        bdrum_toolbar,
        false,
    ),
    new Instrument(
        "Snare Drum",
        3,
        sdrum_sound,
        sdrum_texture,
        sdrum_icon,
        sdrum_toolbar,
        false,
    ),
    new Instrument(
        "Click",
        4,
        click_sound,
        click_texture,
        click_icon,
        click_toolbar,
        false,
    ),
    new Instrument(
        "Guitar",
        5,
        guitar_sound,
        guitar_texture,
        guitar_icon,
        guitar_toolbar,
        false,
    ),
    new Instrument(
        "Flute",
        6,
        flute_sound,
        flute_texture,
        flute_icon,
        flute_toolbar,
        false,
    ),
    new Instrument(
        "Bell",
        7,
        bell_sound,
        bell_texture,
        bell_icon,
        bell_toolbar,
        false,
    ),
    new Instrument(
        "Chime",
        8,
        chime_sound,
        chime_texture,
        chime_icon,
        chime_toolbar,
        false,
    ),
    new Instrument(
        "Xylophone",
        9,
        xylophone_sound,
        xylophone_texture,
        xylophone_icon,
        xylophone_toolbar,
        false,
    ),
    new Instrument(
        "Iron Xylophone",
        10,
        iron_xylophone_sound,
        iron_xylophone_texture,
        iron_xylophone_icon,
        iron_xylophone_toolbar,
        false,
    ),
    new Instrument(
        "Cow Bell",
        11,
        cow_bell_sound,
        cow_bell_texture,
        cow_bell_icon,
        cow_bell_toolbar,
        false,
    ),
    new Instrument(
        "Didgeridoo",
        12,
        didgeridoo_sound,
        didgeridoo_texture,
        didgeridoo_icon,
        didgeridoo_toolbar,
        false,
    ),
    new Instrument(
        "Bit",
        13,
        bit_sound,
        bit_texture,
        bit_icon,
        bit_toolbar,
        false,
    ),
    new Instrument(
        "Banjo",
        14,
        banjo_sound,
        banjo_texture,
        banjo_icon,
        banjo_toolbar,
        false,
    ),
    new Instrument(
        "Pling",
        15,
        pling_sound,
        pling_texture,
        pling_icon,
        pling_toolbar,
        false,
    ),
];