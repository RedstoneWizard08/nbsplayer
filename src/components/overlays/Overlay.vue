<!-- eslint-disable vue/multi-word-component-names -->
<!-- TODO: Overlay is very weird, should be refactored. -->

<template>
    <div class="overlay-container" v-if="modelValue" @click.self="dismiss">
        <div class="overlay">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: true,
        },
    },

    emits: ["update:modelValue"],

    data() {
        return {
            dismissable: false,
        };
    },

    // Give control to hide or show to children if they want
    provide() {
        return {
            hide: this.hide,
            show: this.show,
        };
    },

    mounted() {
        if ("dismissable" in this.$attrs) {
            this.dismissable = true;
        }
    },

    methods: {
        hide() {
            this.$emit("update:modelValue", false);
        },
        show() {
            this.$emit("update:modelValue", true);
        },
        dismiss() {
            if (this.dismissable) {
                this.hide();
            }
        },
    },
};
</script>

<style scoped>
.overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.3);
}

.overlay {
    /* always centered */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* make it look half decent */
    background-color: #ededed;
    border-left: 1px solid #e4e4e4;
    border-top: 1px solid #e4e4e4;
    border-radius: 7px;
    padding: 15px 30px;
    box-shadow: 3px 3px #111;
}
</style>
