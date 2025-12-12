<template>
  <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-10 py-3">
    <!-- Logo and title -->
    <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
      <img src="/src/assets/bablog_logo.png" alt="logo" width="100px">
    </div>
    <!-- Action buttons -->
    <div class="flex gap-2">
      <!-- Sign Up button -->
      <button
          class="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity"
          @click="$emit('open-signup')">
        <span class="truncate">회원가입</span>
      </button>
      <!-- Login button -->
      <button
          class="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          @click="$emit('open-login')">
        <span class="truncate">로그인</span>
      </button>
    </div>
  </header>
</template>

<script setup>
defineEmits(['open-login', 'open-signup']);
</script>
