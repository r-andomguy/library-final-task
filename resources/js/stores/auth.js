import api from '../api';
import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await api.post("/login", credentials);

                localStorage.setItem("token", response.data.token);

                this.token = response.data.token;

                await this.fetchUser();

                return true;
            } catch (error) {
                return false;
            }
        },

        async fetchUser() {
            try {
                const response = await api.get("/user");
                this.user = response.data;
            } catch (error) {
                this.user = null;
            }
        },

        logout() {
            localStorage.removeItem("token");
            this.token = null;
            this.user = null;
        }
    },
});
