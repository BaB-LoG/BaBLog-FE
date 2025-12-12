// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        user: null,
        isAuthenticated: false,
    }),
    actions: {
        saveUser({ token, user }) {
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;
        },
        logout() {
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;
        },
    },
});
