<template>
  <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
    <h3 class="text-lg font-extrabold text-gray-900">오늘의 목표 요약</h3>
    
    <!-- 요약 그리드 -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-green-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
        <div class="bg-green-500 rounded-full p-1 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-[11px] text-gray-400 font-bold mb-1">완료</p>
        <p class="text-sm font-extrabold text-gray-900">{{ dailyStats.completed }}<span class="text-xs font-bold text-gray-500 ml-0.5">개</span></p>
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
        <p class="text-sm font-extrabold text-gray-900">{{ dailyStats.inProgress }}<span class="text-xs font-bold text-gray-500 ml-0.5">개</span></p>
      </div>

      <div class="bg-indigo-50/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-indigo-50">
        <div class="mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p class="text-[11px] text-gray-400 font-bold mb-1">오늘의 목표 달성률</p>
        <p class="text-sm font-extrabold text-gray-900">{{ dailyStats.achievementRate }}<span class="text-xs font-bold text-gray-500 ml-0.5">%</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGoalStore } from '@/stores/goal';

const goalStore = useGoalStore();

const dailyStats = computed(() => goalStore.dailyStats);
</script>
