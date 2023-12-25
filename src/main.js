import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import api from "@/api";
import store from "@/store";
import VueAxios from "vue-axios";
import axios from "./plugins/axios";
import Toaster from "@meforma/vue-toaster";

const app = createApp(App);
app.use(VueAxios, axios);

app.use(store);
app.use(router);
app.use(api);
app.use(Toaster);
app.mount("#truongdev-gelogistic");
