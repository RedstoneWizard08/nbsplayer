import { ref } from "vue";
import { defineStore } from "pinia";

export const useOptions = defineStore("options", () => {
    const keyOffset = ref(45);
    const loop = ref(false);
    const volume = ref(1);
    const coloredBlock = ref(true);
    const smallIcon = ref(true);
    const language = ref("en_US");

    return { keyOffset, loop, volume, coloredBlock, smallIcon, language };
});
