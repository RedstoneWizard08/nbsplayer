<template>
  <div>
    <h3>{{ lang.getTranslationKey("settings") }}</h3>
    <div>
      <label
        >{{ lang.getTranslationKey("settings.keyOffset")
        }}<input type="number" v-model.number="options.keyOffset"
      /></label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="options.coloredBlock" />{{
          lang.getTranslationKey("settings.coloreBlock")
        }}
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="options.smallIcon" />{{
          lang.getTranslationKey("settings.smallIcon")
        }}
      </label>
    </div>
    <div>
      <label
        >{{ lang.getTranslationKey("settings.language")
        }}<select
          @change="
            lang.setLanguage($event.target.value);
            options.language = $event.target.value;
          "
        >
          <option
            v-for="opt in lang.available"
            :value="opt.code"
            :selected="options.language == opt.code ? 'true' : 'false'"
          >
            {{ opt.name }}
          </option>
        </select></label
      >
    </div>
    <button @click="hide">Close</button>
  </div>
</template>

<script>
import { state } from "@/state.js";
export default {
  data() {
    return { lang: state.lang };
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
      state.editor.textureCache = {};
    },
  },
};
</script>

<style></style>
