// Initialises the root components of Popcorn.

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueSSE from "vue-sse";
import "./registerServiceWorker";

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(VueSSE).mount("#app");
