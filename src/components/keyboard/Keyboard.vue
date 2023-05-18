<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="keyboard flex flex-row">
        <octave :editor="editor" :start="21"></octave>
        <octave :editor="editor" :start="33"></octave>
        <octave :editor="editor" :start="45"></octave>
        <octave :editor="editor" :start="57"></octave>
    </div>
</template>

<script lang="ts">
import { SongEditor } from "@/components/editor/editor";
import Octave from "./Octave.vue";

export default {
    props: {
        editor: SongEditor,
    },

    components: {
        Octave,
    },
};
</script>

<style scoped>
.keyboard {
    position: relative;
    justify-content: center;
    overflow-x: auto;
    padding: 2px 0;
}
</style>
