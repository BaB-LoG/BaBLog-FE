// src/stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    tokenType: 'Bearer',
    accessToken: null,
    member: null,
    isAuthenticated: false,
  }),
  getters: {
    authHeader: (state) =>
      state.accessToken ? `${state.tokenType || 'Bearer'} ${state.accessToken}` : null,
  },
  actions: {
    saveUser({ tokenType = 'Bearer', accessToken, member }) {
      this.tokenType = tokenType || 'Bearer';
      this.accessToken = accessToken;
      this.member = member;
      this.isAuthenticated = Boolean(accessToken);
    },
    logout() {
      this.tokenType = 'Bearer';
      this.accessToken = null;
      this.member = null;
      this.isAuthenticated = false;
    },
  },
});
