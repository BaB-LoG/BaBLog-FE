<template>
  <Header @open-login="showLoginModal = true" @open-signup="showSignUpModal = true" />
  <router-view />
  <Footer />
  <!-- Modals placed globally so they can overlay any page -->
  <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  <SignUpModal v-if="showSignUpModal" @close="showSignUpModal = false" />
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import LoginModal from '@/components/LoginModal.vue';
import SignUpModal from '@/components/SignUpModal.vue';

const showLoginModal = ref(false);
const showSignUpModal = ref(false);
</script>
