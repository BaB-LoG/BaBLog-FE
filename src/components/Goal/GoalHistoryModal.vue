<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            appear
          >
            <div v-if="isOpen" class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ formattedDate }} 기록
                  </h3>
                  <button
                    @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="flex gap-6 mb-6 border-b border-gray-100 pb-2">
                  <button 
                    @click="currentTab = 'DAILY'"
                    class="pb-2 text-sm font-bold transition-colors relative"
                    :class="currentTab === 'DAILY' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'"
                  >
                    오늘의 목표
                    <div v-if="currentTab === 'DAILY'" class="absolute bottom-[-9px] left-0 w-full h-0.5 bg-green-500 rounded-t-full"></div>
                  </button>
                  <button 
                    @click="currentTab = 'WEEKLY'"
                    class="pb-2 text-sm font-bold transition-colors relative"
                    :class="currentTab === 'WEEKLY' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'"
                  >
                    주간 목표
                    <div v-if="currentTab === 'WEEKLY'" class="absolute bottom-[-9px] left-0 w-full h-0.5 bg-green-500 rounded-t-full"></div>
                  </button>
                </div>

                <div class="max-h-[60vh] overflow-y-auto pr-2">
                  <div v-if="filteredHistories.length > 0">
                    <GoalList 
                      :goals="filteredHistories" 
                      type="HISTORY" 
                      :readonly="true" 
                      @goalClick="$emit('goalClick', $event)"
                    />
                  </div>
                  <div v-else class="py-12 text-center text-gray-400">
                    <p class="text-sm">기록이 없습니다.</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="$emit('close')"
                >
                  닫기
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import GoalList from './GoalList.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: () => new Date()
  },
  histories: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'goalClick']);

const currentTab = ref('DAILY');

const filteredHistories = computed(() => {
  if (!props.histories) return [];
  return props.histories.filter(h => h.goalType === currentTab.value);
});

const formattedDate = computed(() => {
  if (!props.date) return '';
  return format(props.date, 'yyyy년 M월 d일');
});
</script>
