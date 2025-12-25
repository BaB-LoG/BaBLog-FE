<template>
  <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div class="flex justify-center items-center mb-6">
      <div class="flex items-center gap-6">
        <button @click="prevMonth" class="text-gray-400 hover:text-green-600 transition-colors p-1 hover:bg-green-50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <span class="text-xl font-bold text-gray-900 tracking-tight min-w-[140px] text-center">{{ format(currentMonth, 'yyyy년 M월') }}</span>
        <button @click="nextMonth" class="text-gray-400 hover:text-green-600 transition-colors p-1 hover:bg-green-50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-gray-400 py-2">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-y-2">
      <!-- Empty cells for start of month -->
      <div v-for="i in startPadding" :key="`pad-${i}`"></div>
      
      <!-- Days -->
      <div 
        v-for="date in daysInMonth" 
        :key="date.toISOString()" 
        class="relative flex flex-col items-center justify-center h-14 rounded-lg cursor-pointer transition-all hover:opacity-80"
        :class="[
          isSelected(date) ? 'ring-2 ring-green-500 ring-offset-1 z-10' : '',
          getDayStyle(date)
        ]"
        @click="selectDate(date)"
      >
        <span class="text-sm font-semibold" :class="isSelected(date) ? 'text-green-600' : ''">{{ format(date, 'd') }}</span>
        
        <!-- Weekly Status Dots -->
        <div v-if="getWeeklyDotStyle(date)" class="absolute bottom-2 flex gap-1">
          <div 
            class="w-1.5 h-1.5 rounded-full" 
            :class="getWeeklyDotStyle(date)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 범례 -->
    <div class="mt-8 pt-6 border-t border-gray-100">
      <div class="flex flex-wrap gap-x-6 gap-y-3">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded bg-green-50 border border-green-200"></div>
          <span class="text-[11px] font-medium text-gray-500">완벽 달성</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded bg-orange-50 border border-orange-200"></div>
          <span class="text-[11px] font-medium text-gray-500">일부 달성</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span class="text-[11px] font-medium text-gray-500">주간 달성</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
          <span class="text-[11px] font-medium text-gray-500">주간 진행 중</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import { useGoalStore } from '@/stores/goal';

const props = defineProps({
  // Optional: Pass a Set or Map of dates that have history to show dots
  // e.g. '2023-10-25' -> true
  historyDates: {
    type: Object, // or Set
    default: () => ({})
  }
});

const emit = defineEmits(['dateClick']);

const currentMonth = ref(new Date());
const selectedDate = ref(new Date());

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const daysInMonth = computed(() => {
  const start = startOfMonth(currentMonth.value);
  const end = endOfMonth(currentMonth.value);
  return eachDayOfInterval({ start, end });
});

const startPadding = computed(() => {
  return getDay(startOfMonth(currentMonth.value));
});

const prevMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1);
};

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1);
};

const selectDate = (date) => {
  selectedDate.value = date;
  emit('dateClick', date);
};

const isSelected = (date) => {
  return isSameDay(date, selectedDate.value);
};

const goalStore = useGoalStore();

const getDaySummary = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return goalStore.calendarSummary.find(s => s.date === dateStr);
};

const getDayStyle = (date) => {
  const summary = getDaySummary(date);
  if (!summary || summary.dailyTotal === 0) return 'bg-gray-50 text-gray-500';
  
  if (summary.dailyCompleted === summary.dailyTotal) {
    return 'bg-green-50 text-green-700 border border-green-100';
  } else if (summary.hasDailyProgress || summary.dailyCompleted > 0) {
    return 'bg-orange-50 text-orange-700 border border-orange-100';
  }
  return 'bg-gray-100 text-gray-600';
};

const getWeeklyDotStyle = (date) => {
  const summary = getDaySummary(date);
  if (!summary || summary.weeklyStatus === 'NONE') return null;
  
  if (summary.weeklyStatus === 'COMPLETED') {
    return 'bg-green-500';
  } else if (summary.weeklyStatus === 'IN_PROGRESS') {
    return 'bg-orange-500';
  }
  return null;
};

// Month change handling
watch(currentMonth, () => {
  emit('monthChange', {
    start: format(startOfMonth(currentMonth.value), 'yyyy-MM-dd'),
    end: format(endOfMonth(currentMonth.value), 'yyyy-MM-dd')
  });
}, { immediate: true });

// Initial emit to load today's history
emit('dateClick', selectedDate.value, false);
</script>
