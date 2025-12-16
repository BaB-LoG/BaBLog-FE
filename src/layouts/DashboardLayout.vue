<template>
  <div class="flex h-screen overflow-hidden bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
    <aside class="sticky top-0 flex h-screen w-64 shrink-0 flex-col gap-4 border-r border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
      <div class="text-lg font-bold">BaBLog</div>
      <nav class="flex flex-col gap-2">
        <router-link
          to="/dashboard"
          class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/10"
          active-class="bg-primary/15 text-primary font-semibold"
          exact-active-class="bg-primary/15 text-primary font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span>대시보드</span>
        </router-link>
        <router-link
          to="/meal-log"
          class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/10"
          active-class="bg-primary/15 text-primary font-semibold"
          exact-active-class="bg-primary/15 text-primary font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-icon lucide-notebook"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/></svg>
          <span>식단 기록</span>
        </router-link>
        <router-link
          to="/reports"
          class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/10"
          active-class="bg-primary/15 text-primary font-semibold"
          exact-active-class="bg-primary/15 text-primary font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-search-icon lucide-book-search"><path d="M11 22H5.5a1 1 0 0 1 0-5h4.501"/><path d="m21 22-1.879-1.878"/><path d="M3 19.5v-15A2.5 2.5 0 0 1 5.5 2H18a1 1 0 0 1 1 1v8"/><circle cx="17" cy="18" r="3"/></svg>
          <span>리포트</span>
        </router-link>
        <router-link
          to="/goals"
          class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-primary/10"
          active-class="bg-primary/15 text-primary font-semibold"
          exact-active-class="bg-primary/15 text-primary font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-goal-icon lucide-goal"><path d="M12 13V2l8 4-8 4"/><path d="M20.561 10.222a9 9 0 1 1-12.55-5.29"/><path d="M8.002 9.997a5 5 0 1 0 8.9 2.02"/></svg>
          <span>목표 설정</span>
        </router-link>
      </nav>
      <div class="mt-auto">
        <hr>
        <div class="flex items-center gap-3 rounded-lg px-3 py-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-text-light dark:text-text-dark">{{ displayName }}</span>
            <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark">{{ displayEmail }}</span>
          </div>
        </div>
      </div>
    </aside>
    <main class="flex-1 overflow-y-auto overflow-x-auto bg-background-light dark:bg-background-dark">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

// 사용자 정보가 없을 때도 깔끔한 플레이스홀더를 보여줍니다.
const displayName = computed(() => userStore.member?.name || '사용자');
const displayEmail = computed(() => userStore.member?.email || 'email@example.com');
</script>
