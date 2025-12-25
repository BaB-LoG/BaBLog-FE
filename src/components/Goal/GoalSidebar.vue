<template>
  <div class="w-80 shrink-0 space-y-6">
    <!-- 오늘의 요약 카드 -->
    <TodaySummaryCard />

    <!-- 이번 달 베스트/워스트 목표 카드 -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
      <!-- 이번 달 베스트 목표 -->
      <div v-if="bestGoal" class="space-y-3">
        <h4 class="text-sm font-extrabold text-gray-900">이번 달 베스트 목표</h4>
        <div class="bg-blue-50/60 p-4 rounded-2xl flex items-center gap-4">
          <div class="bg-white p-2.5 rounded-2xl shadow-sm">
             <span class="text-xl">💧</span>
          </div>
          <div>
            <p class="text-sm font-extrabold text-gray-900">{{ bestGoal.title }}</p>
            <p class="text-[11px] text-blue-600 font-bold">연속 달성 {{ bestGoal.maxStreak }}일 🔥</p>
          </div>
        </div>
      </div>

      <!-- 이번 달 가장 어려운 목표 -->
      <div v-if="hardestGoal" class="space-y-3">
        <h4 class="text-sm font-extrabold text-gray-900">이번 달 가장 어려운 목표</h4>
        <div class="bg-red-50/60 p-4 rounded-2xl flex items-center gap-4">
          <div class="bg-white p-2.5 rounded-2xl shadow-sm">
             <span class="text-xl">🏃</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-extrabold text-gray-900 mb-2">{{ hardestGoal.title }}</p>
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-red-500 rounded-full transition-all duration-500"
                  :style="{ width: `${hardestGoal.avgAchievementRate}%` }"
                ></div>
              </div>
              <span class="text-[11px] font-bold text-red-600 whitespace-nowrap">달성률 {{ Math.round(hardestGoal.avgAchievementRate) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!bestGoal && !hardestGoal" class="py-4 text-center text-gray-400 text-sm">
        이번 달 목표 통계가 없습니다.
      </div>
    </div>

    <!-- 주간 목표 요약 카드 -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
      <h3 class="text-lg font-extrabold text-gray-900">주간 목표 요약</h3>
      
      <div class="bg-gray-50/60 rounded-3xl p-6 space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-bold text-gray-500">목표</span>
          </div>
          <span class="text-sm font-extrabold text-gray-900">{{ weeklyStats.total }}<span class="text-xs ml-0.5">개</span></span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-bold text-gray-500">달성</span>
          </div>
          <span class="text-sm font-extrabold text-green-600">{{ weeklyStats.completed }}<span class="text-xs ml-0.5">개</span></span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" />
            </svg>
            <span class="text-xs font-bold text-gray-500">달성률</span>
          </div>
          <span class="text-sm font-extrabold text-blue-600">{{ weeklyStats.achievementRate }}<span class="text-xs ml-0.5">%</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useGoalStore } from '@/stores/goal';
import { useUserStore } from '@/stores/userStore';
import TodaySummaryCard from './TodaySummaryCard.vue';

const goalStore = useGoalStore();
const userStore = useUserStore();

// 베스트/워스트 목표 데이터 로드 (백엔드 API)
const loadHighlights = async () => {
  const memberId = userStore.member?.id;
  if (!memberId) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  await goalStore.fetchStatsHighlights(memberId, year, month);
};

onMounted(() => {
  loadHighlights();
});

// memberId 변경 시 다시 로드
watch(() => userStore.member?.id, (newId) => {
  if (newId) loadHighlights();
});

// 주간 목표 통계 (Pinia getters - 실시간 반영)
const weeklyStats = computed(() => goalStore.weeklyStats);

// 베스트/워스트 목표 (백엔드 API)
const bestGoal = computed(() => goalStore.statsHighlights?.bestGoal ?? null);
const hardestGoal = computed(() => goalStore.statsHighlights?.hardestGoal ?? null);

</script>
