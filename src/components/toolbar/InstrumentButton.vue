<template>
    <a class="button" @click="activate" :value="active" :title="title">
        <img :src="icon || ''" />
    </a>
</template>

<script lang="ts">
import { Instrument } from "@/lib/nbs";
import { SongEditor } from "@/components/editor/editor";
import { useAppState } from "@/stores/app";

export default {
    props: {
        instrument: Instrument,
        editor: SongEditor,
    },

    data() {
        return {
            state: useAppState(),
            icon: null as string | null,
        };
    },

    computed: {
        /*text() {
        const words = this.instrument.name.split(" ");
        if (words.length === 1) {
          return this.instrument.name.substr(0, 2);
        } else {
          return words.slice(0, 2).map((i) => i[0]).join("");
        }
      },*/
        active() {
            return this.editor?.currentInstrument === this.instrument;
        },
        title() {
            return "Set Instrument to " + this.instrument?.name;
        },
    },

    mounted() {
        this.icon = this.instrument?.toolbarSrc || "";
    },

    methods: {
        async activate() {
            this.editor!.currentInstrument = this.instrument!;

            this.state.playNote(this.editor?.currentKey || -1, this.instrument!);
        },
    },
};
</script>

<style scoped>
.button {
    position: relative;
}
.instrument-body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
