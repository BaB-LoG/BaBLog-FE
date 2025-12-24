<template>
  <div class="mt-8 max-w-7xl mx-auto min-w-[1200px]">
    <!-- Header & Add Goal Button -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">목표 설정 및 관리</h1>
      <div class="text-sm text-gray-500">
         <!-- Optional breadcrumbs or info -->
      </div>
    </div>

    <div class="flex gap-8">
      
      <!-- Main Content Area -->
      <div class="flex-none w-[800px] space-y-8">

        <!-- Section 1: Goal List -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold text-gray-800">나의 목표 목록</h2>
          </div>
          
          <div class="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
            <div class="flex gap-6">
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
            
            <button 
              @click="isModalOpen = true"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              목표 등록
            </button>
          </div>

          <!-- Goal List Component -->
          <GoalList 
            :goals="currentGoals" 
            :type="currentTab" 
            @goalClick="openDetailModal($event, currentTab)"
          />
        </div>

        <!-- Section 2: Calendar -->
        <GoalCalendar @dateClick="handleDateClick" @monthChange="handleMonthChange" />
        
      </div>

      <!-- Right Sidebar -->
      <GoalSidebar />

    </div>

    <!-- Registration/Edit Modal -->
    <GoalModal 
      :is-open="isModalOpen" 
      :default-goal-type="currentTab"
      :goal-to-edit="goalToEdit"
      @close="closeRegistrationModal" 
      @saved="handleGoalSaved"
    />

    <!-- Detail Modal -->
    <GoalDetailModal
      :is-open="isDetailModalOpen"
      :goal="selectedGoal"
      :context-type="selectedGoalType"
      :is-readonly="selectedGoalType === 'HISTORY'"
      @close="isDetailModalOpen = false"
      @edit="openEditModalFromDetail"
      @deleted="handleGoalDeleted"
    />

    <!-- History Modal -->
    <GoalHistoryModal
      :is-open="isHistoryModalOpen"
      :date="selectedDate"
      :histories="selectedDateHistories"
      @close="isHistoryModalOpen = false"
      @goalClick="openDetailFromHistory"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useGoalStore } from '@/stores/goal';
import { useUserStore } from '@/stores/userStore';
import { format } from 'date-fns';
import GoalList from '@/components/Goal/GoalList.vue';
import GoalModal from '@/components/Goal/GoalModal.vue';
import GoalDetailModal from '@/components/Goal/GoalDetailModal.vue';
import GoalCalendar from '@/components/Goal/GoalCalendar.vue';
import GoalHistoryModal from '@/components/Goal/GoalHistoryModal.vue';
import GoalSidebar from '@/components/Goal/GoalSidebar.vue';

const goalStore = useGoalStore();
const userStore = useUserStore();

const currentTab = ref('DAILY');
const isModalOpen = ref(false); // For registration/edit
const isDetailModalOpen = ref(false);
const isHistoryModalOpen = ref(false);
const selectedDate = ref(new Date());

const selectedGoalId = ref(null);
const selectedGoalType = ref(null); // 'DAILY', 'WEEKLY', or 'HISTORY'

const selectedGoal = computed(() => {
    if (!selectedGoalId.value) return null;
    
    let list = [];
    if (selectedGoalType.value === 'DAILY') list = goalStore.dailyGoals;
    else if (selectedGoalType.value === 'WEEKLY') list = goalStore.weeklyGoals;
    else if (selectedGoalType.value === 'HISTORY') list = goalStore.calendarHistories;
    
    return list.find(g => g.id === selectedGoalId.value);
});

const goalToEdit = ref(null);

const currentGoals = computed(() => {
  return currentTab.value === 'DAILY' ? goalStore.dailyGoals : goalStore.weeklyGoals;
});

const currentMonthRange = ref({ start: '', end: '' });

const selectedDateHistories = computed(() => goalStore.calendarHistories);

// overallProgress and completedCount logic can stay if needed, 
// but sidebar now calculates its own for encapsulation.

// Fetch goals when tab changes
watch(currentTab, (newTab) => {
  goalStore.fetchGoals(newTab);
});

// Watch for goal changes to refresh calendar summary (live updates)
watch(() => [goalStore.dailyGoals, goalStore.weeklyGoals], () => {
  refreshCalendarSummary();
}, { deep: true });

const openDetailModal = (goal, contextType) => {
    selectedGoalId.value = goal.id;
    selectedGoalType.value = contextType;
    isDetailModalOpen.value = true;
};

const openEditModalFromDetail = () => {
    goalToEdit.value = selectedGoal.value;
    isDetailModalOpen.value = false;
    isModalOpen.value = true;
};

const closeRegistrationModal = () => {
    isModalOpen.value = false;
    goalToEdit.value = null; // Reset edit mode
};

const openDetailFromHistory = (goal) => {
    isHistoryModalOpen.value = false;
    openDetailModal(goal, 'HISTORY');
};

const handleGoalSaved = async () => {
    await goalStore.fetchGoals(currentTab.value);
    refreshCalendarSummary();
};

const handleGoalDeleted = async () => {
    await goalStore.fetchGoals(currentTab.value);
    refreshCalendarSummary();
};

const handleMonthChange = (range) => {
  currentMonthRange.value = range;
  refreshCalendarSummary();
};

const refreshCalendarSummary = () => {
  const memberId = userStore.member?.id;
  if (memberId && currentMonthRange.value.start) {
    goalStore.fetchCalendarSummary(memberId, currentMonthRange.value.start, currentMonthRange.value.end);
  }
};

const handleDateClick = async (date, shouldOpenModal = true) => {
  selectedDate.value = date;
  const memberId = userStore.member?.id;
  if(memberId) {
    const dateStr = format(date, 'yyyy-MM-dd');
    await goalStore.fetchGoalHistories(memberId, dateStr);
    
    if (shouldOpenModal) {
      isHistoryModalOpen.value = true;
    }
  }
};

onMounted(() => {
  goalStore.fetchGoals('DAILY');
  // Initial fetch for today but don't open modal
  const memberId = userStore.member?.id;
  if(memberId) {
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      goalStore.fetchGoalHistories(memberId, dateStr);
  }
});
</script>
