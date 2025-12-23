<template>
  <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-800">달력</h3>
      <div class="flex items-center gap-4">
        <button @click="prevMonth" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <span class="text-lg font-bold text-gray-900 tracking-tight">{{ format(currentMonth, 'yyyy년 M월') }}</span>
        <button @click="nextMonth" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
        class="relative flex flex-col items-center justify-center h-14 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
        :class="{
          'bg-green-50 text-green-600 font-bold border border-green-200': isSelected(date),
          'text-gray-700': !isSelected(date),
          'opacity-50': !isSameMonth(date, currentMonth) // shouldn't happen with current logic but good for consistency
        }"
        @click="selectDate(date)"
      >
        <span class="text-xm">{{ format(date, 'd') }}</span>
        
        <!-- Dot indicator (Optional: requires logic passed from parent or fetched) -->
        <!-- Currently just placeholder or if parent passes 'activeDates' map -->
        <div v-if="hasHistory(date)" class="mt-1 w-1.5 h-1.5 rounded-full bg-green-500"></div>
      </div>
    </div>

    <!-- 범례 -->
    <!-- 범례 -->
    <div class="flex justify-end gap-5 mt-8 text-[11px] font-medium text-gray-500">
      <div class="flex items-center gap-2">
        <div class="w-6 h-1 bg-green-500 rounded-full"></div>
        <span>완벽 달성</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-6 h-1 bg-orange-400 rounded-full"></div>
        <span>부분 달성</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';

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

const hasHistory = (date) => {
  // Check if date string exists in historyDates prop
  const dateStr = format(date, 'yyyy-MM-dd');
  return !!props.historyDates[dateStr]; // Assuming map or object
};

// Initial emit to load today's history (don't open modal on mount)
emit('dateClick', selectedDate.value, false);
</script>
