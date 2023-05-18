import eruda from "eruda";

eruda.init();

import { createApp } from "vue";
import { createPinia } from "pinia";
import persistence from "pinia-plugin-persistedstate";

import App from "./App.vue";
import { FontAwesomeIcon } from "./components/FontAwesomeIcon";

const main = async () => {
    const pinia = createPinia();

    pinia.use(persistence);

    const app = createApp(App);

    app.use(pinia);
    app.component("font-awesome-icon", FontAwesomeIcon);

    app.config.performance = process.env.NODE_ENV !== "production";

    app.mount("#app");
};

main();
