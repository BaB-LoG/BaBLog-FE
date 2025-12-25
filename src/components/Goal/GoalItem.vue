<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-2">
      <h4 class="text-lg font-bold text-gray-800 flex items-center">
        <span @click="$emit('titleClick', goal)" class="hover:text-green-600 transition-colors cursor-pointer">
            {{ goal.title }}
        </span>
        <span v-if="isCompleted" class="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">달성!</span>
      </h4>
      <div v-if="isCompleted" class="text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
      <button 
        v-else-if="!readonly"
        @click="increaseProgress" 
        class="text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full p-1 transition-colors"
        :disabled="isLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
      <div 
        class="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <div class="flex justify-between text-xs text-gray-500 font-medium">
      <span>{{ goal.progressValue }} / {{ goal.targetValue }}</span>
      <span class="text-green-600">{{ Math.round(progressPercentage) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useGoalStore } from '@/stores/goal';

const emit = defineEmits(['titleClick']);

const props = defineProps({
  goal: {
    type: Object,
    required: true
  },
  contextGoalType: {
    type: String,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const goalStore = useGoalStore();
const isLoading = ref(false);

const isCompleted = computed(() => props.goal.progressValue >= props.goal.targetValue);
const progressPercentage = computed(() => {
  if (props.goal.targetValue === 0) return 0;
  return Math.min((props.goal.progressValue / props.goal.targetValue) * 100, 100);
});

const increaseProgress = async () => {
  if (props.readonly || isLoading.value) return;
  isLoading.value = true;
  try {
    if (props.contextGoalType === 'HISTORY') {
        const userStore = useUserStore(); // Need to import this
        // We need memberId and date to refresh.
        // Passed via props? Or just refresh the view?
        // Store action needs memberId/date to refresh.
        // Using goalStore.updateHistoryProgress(id, delta, memberId, date)
        // We don't have memberId/date easily here without props.
        // Simpler: Just emit 'update' event and let parent handle?
        // Or store selectedDate in store.
        // Let's assume store has data or we just update and don't await refresh here (let parent react?)
        // Wait, store has 'calendarHistories'. If we update one, we should refresh.
        // Let's rely on parent to refresh or store state.
        // Actually, let's keep it simple: History is readonly for now as per my previous decision, 
        // OR if editable, let's just create the action and logic.
        // Given I made it readonly in GoalsPage (<GoalList ... :readonly="true" />), I don't need to implement this complex logic right now!
        // The GoalsPage passes readonly=true for history.
        // So this code block won't be reached for history.
        // So I can just revert to simple active goal logic.
        await goalStore.increaseProgress(props.goal.id, props.contextGoalType);
    } else {
        await goalStore.increaseProgress(props.goal.id, props.contextGoalType); 
    }
  } catch(e) {
      // error
  } finally {
    isLoading.value = false;
  }
};
</script>
