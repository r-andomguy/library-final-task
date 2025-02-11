import { defineStore } from "pinia";
import api from "../api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || null,
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await api.post("/login", credentials);
                this.token = response.data.token;
                localStorage.setItem("token", this.token);

                await this.fetchUser();
                return true;
            } catch (error) {
                console.error("Erro no login", error);
                return false;
            }
        },
        async fetchUser() {
            if (!this.token) return;

            try {
                const response = await api.get("/user", {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
                this.user = response.data;
            } catch (error) {
                console.error("Erro ao buscar usuário", error);
                this.logout();
            }
        },
        async logout() {
            try {
                await api.post("/logout", {
                    headers: { Authorization: `Bearer ${this.token}` },
                });
            } catch (error) {
                console.error("Erro no logout", error);
            }

            this.user = null;
            this.token = null;
            localStorage.removeItem("token");
        },
    },
});
