<template>
  <div>
    <h3>Settings</h3>
    <div><label>Key Offset <input type="number" v-model.number="options.keyOffset"></label></div>
    <div><label>
      <input type="checkbox" v-model="options.coloredBlock">Show colored note block.
    </label></div>
    <div><label>
      <input type="checkbox" v-model="options.smallIcon">Show small icon.
    </label></div>
    <button @click="hide">Close</button>
  </div>
</template>

<script>
import { state } from "@/state.js";
export default {
  inject: ["hide"],
  props: {
    options: Object,
  },
  methods: {
    /**
     * Reload texture cache.
     */
    reloadTextureCache() {
        state.editor.textureCache = {}
    }
  }
}
</script>

<style>

</style>
