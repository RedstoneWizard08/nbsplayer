<template>
    <div>
        <h3>{{ lang.getTranslationKey("settings") }}</h3>
        <div>
            <label
                >{{ lang.getTranslationKey("settings.keyOffset")
                }}<input type="number" v-model.number="options!.keyOffset"
            /></label>
        </div>
        <div>
            <label>
                <input type="checkbox" v-model="options!.coloredBlock" />{{
                    lang.getTranslationKey("settings.coloreBlock")
                }}
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" v-model="options!.smallIcon" />{{
                    lang.getTranslationKey("settings.smallIcon")
                }}
            </label>
        </div>
        <div>
            <label
                >{{ lang.getTranslationKey("settings.language")
                }}<select
                    @change="
                        lang.setLanguage(($event.target as any).value);
                        options!.language = ($event.target as any).value;
                    "
                >
                    <option
                        v-for="opt in lang.available"
                        :value="opt.code"
                        :selected="options?.language == opt.code ? 'true' : 'false'"
                        v-bind:key="opt.code"
                    >
                        {{ opt.name }}
                    </option>
                </select></label
            >
        </div>
        <button @click="__hide">Close</button>
    </div>
</template>

<script lang="ts">
import { useAppState } from "@/stores/app";

export default {
    data() {
        const state = useAppState();

        return { lang: state.lang, state };
    },

    inject: ["hide"],

    props: {
        options: Object,
    },

    methods: {
        /**
         * Reload texture cache.
         */
        // FIXME: Cannot reload texture.
        reloadTextureCache() {
            this.state.editor!.textureCache = {};
        },

        __hide() {
            (this as any).hide();
        },
    },
};
</script>

<style></style>
