<script lang="ts">
// https://stackoverflow.com/a/40388120

export default {
    name: "vue-title",
    props: {
        title: String,
    },

    created() {
        document.title = this.title!;
    },

    watch: {
        title() {
            document.title = this.title!;
        },
    },
};
</script>
