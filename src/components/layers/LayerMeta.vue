<template>
  <div class="row layer">
    <div class="child">
      <input
        type="text"
        v-model="layer.name"
        :placeholder="layer.placeholder"
        name="name"
      />
      <input
        type="number"
        v-model="layer.volume"
        name="volume"
        class="no-spinners"
      />
      <!-- Janky ['delete'] allows it to call delete() without using the word delete because vue errors if you do that -->
      <a
        @click="layer.locked = !layer.locked"
        :value="layer.locked"
        class="button"
        title="Lock"
      >
        <img class="button-image" alt="Lock" :src="layer.getLockIcon" />
      </a>
      <a class="delete-button" @click="layer['delete']()" title="Delete layer"
        >&times;</a
      >
    </div>
  </div>
</template>

<script>
import * as NBS from "@/NBS.js";

export default {
  props: {
    layer: NBS.Layer,
  },
  /*computed: {
    volume: {
      get() {
        return this.layer.volume * 100;
      },
      set(volume) {
        this.layer.volume = volume / 100;
      }
    }
  }*/
};
</script>

<style scoped>
.button {
  border: 1px solid transparent;
  border-radius: 3px;
  display: inline-block;
  padding: 2px;
  width: 20px;
  height: 20px;
  margin: 2px;
  text-decoration: none;
}
.button:hover,
.button[value="true"] {
  border: 1px solid #999;
}
.button[value="true"] {
  background-image: linear-gradient(#eee, #ccc);
}
.button-image {
  width: 100%;
  height: 100%;
}
.layer {
  position: relative;
  font-size: 11px;
}
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.child > * {
  display: inline-block;
  vertical-align: middle;
}
.delete-button {
  font-size: 12pt;
  margin: 0 2px;
}
input {
  font-size: inherit;
}
input[name="name"] {
  width: 100px;
}
input[name="volume"] {
  width: 20px;
}
</style>
