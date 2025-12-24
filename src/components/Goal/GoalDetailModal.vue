<template>
  <div v-if="isOpen && goal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative overflow-hidden">
      <!-- Background Accent -->
      <div class="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

      <!-- Close Button -->
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
           <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
              :class="goal.goalType === 'DAILY' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'"
           >
             {{ goal.goalType === 'DAILY' ? '일일 목표' : '주간 목표' }}
           </span>
           <span v-if="isCompleted" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600">
             달성 완료!
           </span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">{{ goal.title }}</h2>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-xs text-gray-500 font-medium mb-1 uppercase tracking-tighter">현재 진행도</p>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-black text-gray-900">{{ goal.progressValue }}</span>
            <span class="text-sm text-gray-400">/ {{ goal.targetValue }}</span>
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-xs text-gray-500 font-medium mb-1 uppercase tracking-tighter">달성률</p>
          <p class="text-2xl font-black" :class="isCompleted ? 'text-green-600' : 'text-gray-900'">
            {{ progressPercentage }}%
          </p>
        </div>
      </div>

      <!-- Progress Adjuster -->
      <div class="mb-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-inner">
        <div class="flex justify-between items-center mb-4">
           <p class="text-sm font-bold text-gray-700">진행도 조절 <span class="text-xs font-normal text-gray-400 ml-1">클릭당 {{ goal.clickPerProgress }}씩 변화</span></p>
        </div>
        
        <div class="flex items-center justify-center gap-8">
           <!-- Decrease Button -->
           <button 
             @click="decreaseProgress"
             class="group flex flex-col items-center gap-2"
             :disabled="goal.progressValue <= 0 || isLoading"
           >
             <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
               </svg>
             </div>
             <span class="text-xs font-bold text-gray-400 group-hover:text-red-500 transition-colors">감소</span>
           </button>

           <div class="flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center relative shadow-sm border-2 border-green-100 overflow-hidden">
                <div class="absolute inset-0 bg-green-500 transition-all duration-700 ease-out origin-bottom" :style="{ height: `${progressPercentage}%`, opacity: 0.1 }"></div>
                <span class="text-2xl font-black text-green-700 z-10">{{ progressPercentage }}%</span>
              </div>
           </div>

           <!-- Increase Button -->
           <button 
             @click="increaseProgress"
             class="group flex flex-col items-center gap-2"
             :disabled="goal.isCompleted || isLoading"
           >
             <div class="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
               </svg>
             </div>
             <span class="text-xs font-bold text-gray-400 group-hover:text-green-500 transition-colors">증가</span>
           </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button 
          v-if="!isReadonly"
          @click="$emit('edit')"
          class="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold transition-colors border border-gray-100 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          수정하기
        </button>
        <button 
          @click="handleDelete"
          class="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          삭제
        </button>
        <button 
          @click="$emit('close')"
          class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors flex items-center justify-center"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useGoalStore } from '@/stores/goal';

const props = defineProps({
  isOpen: Boolean,
  goal: Object,
  contextType: String,
  isReadonly: Boolean
});

const emit = defineEmits(['close', 'edit', 'deleted']);
const goalStore = useGoalStore();
const isLoading = ref(false);

const isCompleted = computed(() => {
  if (!props.goal) return false;
  return props.goal.progressValue >= props.goal.targetValue;
});

const progressPercentage = computed(() => {
  if (!props.goal || props.goal.targetValue === 0) return 0;
  return Math.min(Math.round((props.goal.progressValue / props.goal.targetValue) * 100), 100);
});

const increaseProgress = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    await goalStore.increaseProgress(props.goal.id, props.contextType);
  } catch (e) {
    console.error(e);
    alert('진행도 증가 실패: ' + (e.response?.data?.message || e.message));
  } finally {
    isLoading.value = false;
  }
};

const decreaseProgress = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    await goalStore.decreaseProgress(props.goal.id, props.contextType);
  } catch (e) {
    console.error(e);
    alert('진행도 감소 실패: ' + (e.response?.data?.message || e.message));
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('정말로 이 목표를 삭제하시겠습니까?')) return;
  try {
    await goalStore.deleteGoal(props.goal.id);
    emit('deleted');
    emit('close');
  } catch (e) {
    console.error(e);
    alert('삭제 실패: ' + (e.response?.data?.message || e.message));
  }
};
</script>
