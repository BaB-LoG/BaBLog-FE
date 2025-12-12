<template>
  <main>
    <!-- Hero Section -->
    <div class="py-10">
      <div class="@container">
        <div class="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
          <!-- Hero Text + CTA -->
          <div class="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
            <div class="flex flex-col gap-2 text-left">
              <h1 class="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                당신만의 건강 식단을 시작하세요
              </h1>
              <h2 class="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal @[480px]:text-lg">
                개인 맞춤형 식단 계획으로 건강 목표를 쉽게 달성하세요.
              </h2>
            </div>
            <!-- "Start for free" button -->
            <router-link to="/dashboard" class="flex max-w-[480px] items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold hover:opacity-90 transition-opacity">
              <span class="truncate">식단 관리 시작하기</span>
            </router-link>
          </div>
          <!-- Hero Image -->
          <div class="bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
               style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAKyWt88AddjCtz1XuGnYMCj_hnLR5HQw22-vt2I_T2aDlULBl4tA68xd3FivMQXtvRJEAGR0CTj_VsiFcYJyCicrFdfRLBHf7tz0jjdPrhhXno_acqW7cpz6RHO_i0_sqqtOEvUiLyRC2kFXQfiDeL46Uh_bUAoCB7lTYo4wxHp7TE-J2GbY0ZuSqNphe90i0AM6aDtUZheFb2f4L4BZxmLlqgb_LAwcYUSdvgD6MZrckRKVg-fFiSQdiL6Gzz9d1o9cDPqlw76CU");'
               data-alt="A vibrant and colorful bowl of fresh salad with various vegetables.">
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Section -->
    <div class="flex flex-col gap-10 px-4 py-10 @container">
      <div class="flex flex-col gap-4 text-center">
        <h1 class="text-text-light dark:text-text-dark text-2xl font-bold leading-tight @[480px]:text-4xl @[480px]:font-black">
          주요 기능
        </h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark text-base max-w-[720px] mx-auto">
          저희 서비스는 여러분의 건강한 삶을 위해 다음과 같은 기능들을 제공합니다.
        </p>
      </div>
      <!-- Feature Cards Grid -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <!-- Feature 1: 맞춤형 식단 -->
        <div class="flex flex-1 flex-col items-center text-center gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
            <span class="material-symbols-outlined">restaurant_menu</span>
          </div>
          <h2 class="text-text-light dark:text-text-dark text-lg font-bold leading-tight">맞춤형 식단</h2>
          <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            개인의 목표와 취향에 맞는 식단을 추천받으세요.
          </p>
        </div>
        <!-- Feature 2: 간편한 기록 -->
        <div class="flex flex-1 flex-col items-center text-center gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
            <span class="material-symbols-outlined">edit_calendar</span>
          </div>
          <h2 class="text-text-light dark:text-text-dark text-lg font-bold leading-tight">간편한 기록</h2>
          <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            매일의 식사를 손쉽게 기록하고 칼로리를 추적하세요.
          </p>
        </div>
        <!-- Feature 3: 전문가 조언 -->
        <div class="flex flex-1 flex-col items-center text-center gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
            <span class="material-symbols-outlined">support_agent</span>
          </div>
          <h2 class="text-text-light dark:text-text-dark text-lg font-bold leading-tight">전문가 조언</h2>
          <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            영양 전문가의 조언을 통해 더 건강한 선택을 하세요.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  // (Optional) If you want to dynamically add any JS or track something on mount.
});
</script>
