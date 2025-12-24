<template>
  <div class="w-80 shrink-0 space-y-6">
    <!-- 오늘의 요약 카드 -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
      <h3 class="text-lg font-extrabold text-gray-900">오늘의 요약</h3>
      
      <!-- 요약 그리드 -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-green-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
          <div class="bg-green-500 rounded-full p-1 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-[11px] text-gray-400 font-bold mb-1">완료</p>
          <p class="text-sm font-extrabold text-gray-900">{{ dailyCompletedCount }}<span class="text-xs font-bold text-gray-500 ml-0.5">개</span></p>
        </div>
        
        <div class="bg-blue-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-blue-50">
          <div class="bg-blue-400 rounded-full p-1 mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
               <circle cx="10" cy="10" r="3" />
               <circle cx="5" cy="10" r="1.5" opacity="0.6"/>
               <circle cx="15" cy="10" r="1.5" opacity="0.6"/>
             </svg>
          </div>
          <p class="text-[11px] text-gray-400 font-bold mb-1">진행 중</p>
          <p class="text-sm font-extrabold text-gray-900">{{ dailyInProgressCount }}<span class="text-xs font-bold text-gray-500 ml-0.5">개</span></p>
        </div>

        <div class="bg-indigo-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-indigo-50">
          <div class="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p class="text-[11px] text-gray-400 font-bold mb-1">오늘의 목표 달성률</p>
          <p class="text-sm font-extrabold text-gray-900">{{ dailyAchievementRate }}<span class="text-xs font-bold text-gray-500 ml-0.5">%</span></p>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-6 space-y-6">
        <!-- 이번 달 베스트 목표 -->
        <div v-if="bestGoal" class="space-y-3">
          <h4 class="text-sm font-extrabold text-gray-900">이번 달 베스트 목표</h4>
          <div class="bg-blue-50/60 p-4 rounded-2xl flex items-center gap-4">
            <div class="bg-white p-2.5 rounded-2xl shadow-sm">
               <span class="text-xl">💧</span>
            </div>
            <div>
              <p class="text-sm font-extrabold text-gray-900">{{ bestGoal.title }}</p>
              <p class="text-[11px] text-blue-600 font-bold">연속 달성 6일 🔥</p>
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
                    :style="{ width: `${(hardestGoal.progressValue / hardestGoal.targetValue) * 100}%` }"
                  ></div>
                </div>
                <span class="text-[11px] font-bold text-red-600 whitespace-nowrap">달성률 {{ Math.round((hardestGoal.progressValue / hardestGoal.targetValue) * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>
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
          <span class="text-sm font-extrabold text-gray-900">{{ weeklyTotalCount }}<span class="text-xs ml-0.5">개</span></span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-bold text-gray-500">달성</span>
          </div>
          <span class="text-sm font-extrabold text-green-600">{{ weeklyCompletedCount }}<span class="text-xs ml-0.5">개</span></span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" />
            </svg>
            <span class="text-xs font-bold text-gray-500">달성률</span>
          </div>
          <span class="text-sm font-extrabold text-blue-600">{{ weeklyAchievementRate }}<span class="text-xs ml-0.5">%</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGoalStore } from '@/stores/goal';

const goalStore = useGoalStore();

// 일일 목표 통계
const dailyCompletedCount = computed(() => goalStore.dailyGoals.filter(g => g.isCompleted).length);
const dailyInProgressCount = computed(() => goalStore.dailyGoals.filter(g => !g.isCompleted).length);
const dailyAchievementRate = computed(() => {
  const goals = goalStore.dailyGoals;
  if (goals.length === 0) return 0;
  const totalPercent = goals.reduce((acc, g) => {
    const p = g.targetValue > 0 ? (g.progressValue / g.targetValue) : 0;
    return acc + Math.min(p, 1);
  }, 0);
  return Math.round((totalPercent / goals.length) * 100);
});

// 주간 목표 통계
const weeklyTotalCount = computed(() => goalStore.weeklyGoals.length);
const weeklyCompletedCount = computed(() => goalStore.weeklyGoals.filter(g => g.isCompleted).length);
const weeklyAchievementRate = computed(() => {
  if (weeklyTotalCount.value === 0) return 0;
  return Math.round((weeklyCompletedCount.value / weeklyTotalCount.value) * 100);
});

// 베스트/워스트 목표 (일일 목표 중에서만 선별)
const bestGoal = computed(() => {
  const goals = goalStore.dailyGoals;
  if (goals.length === 0) return null;
  return goals.reduce((prev, curr) => {
    const prevRate = prev.targetValue > 0 ? (prev.progressValue / prev.targetValue) : 0;
    const currRate = curr.targetValue > 0 ? (curr.progressValue / curr.targetValue) : 0;
    return (currRate >= prevRate) ? curr : prev;
  });
});

const hardestGoal = computed(() => {
  const goals = goalStore.dailyGoals.filter(g => !g.isCompleted);
  if (goals.length === 0) return null;
  return goals.reduce((prev, curr) => {
    const prevRate = prev.targetValue > 0 ? (prev.progressValue / prev.targetValue) : 0;
    const currRate = curr.targetValue > 0 ? (curr.progressValue / curr.targetValue) : 0;
    return (currRate < prevRate) ? curr : prev;
  });
});

</script>
