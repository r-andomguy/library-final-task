import "./bootstrap.js";
import "../sass/app.scss";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import 'bootstrap-icons/font/bootstrap-icons.css';


const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount("#app");
