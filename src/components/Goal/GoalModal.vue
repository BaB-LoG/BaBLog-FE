<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">{{ isEditMode ? '목표 수정' : '새 목표 등록' }}</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- 목표 내용 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">목표 내용</label>
          <input 
            v-model="form.title" 
            type="text" 
            placeholder="예: 매일 물 2L 마시기" 
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            required
          />
          <p class="text-xs text-gray-500 mt-1">동기 부여가 될 수 있는 구체적인 목표를 적어주세요.</p>
        </div>

        <div class="flex gap-4 mb-4">
          <!-- 목표량 -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">목표량</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
              </span>
              <input 
                v-model.number="form.targetValue" 
                type="number" 
                min="0"
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>

          <!-- 증가량 -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">한 번 클릭당 증가량</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.524l.417 1.543c.11.407.087.844-.06 1.242l-.491 1.332a.86.86 0 01-.798.579c-.066 0-.131-.005-.195-.015a1 1 0 10-.329 1.973c.696.115 1.424.086 2.102-.085l.395-.099a1.001 1.001 0 01.969.26l3.05 3.051a1 1 0 00.707.293h4.343a1 1 0 100-2h-3.515l-2.585-2.586a3.001 3.001 0 00-2.122-.879H10.5h-.002a2.001 2.001 0 00-1.574-.755l-1.096-.273a.5.5 0 01-.363-.483l-.066-1.543a2.5 2.5 0 01.272-1.328l1.001-1.72zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </span>
              <input 
                v-model.number="form.clickPerProgress" 
                type="number" 
                min="0"
                class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>
        </div>

        <!-- 기간 설정 -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">기간 설정</h4>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs text-gray-500 mb-1">시작일</label>
              <input 
                v-model="form.startDate" 
                type="date" 
                class="w-full px-3 py-2 bg-white border rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm"
                required
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs text-gray-500 mb-1">종료일</label>
              <input 
                v-model="form.endDate" 
                type="date" 
                :disabled="isIndefinite"
                class="w-full px-3 py-2 bg-white border rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>
          <div class="mt-3 flex items-center">
            <input 
              id="indefinite" 
              v-model="isIndefinite" 
              type="checkbox" 
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="indefinite" class="ml-2 block text-sm text-gray-700">종료일 선택 안 함 (계속 반복)</label>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            취소
          </button>
          <button 
            type="submit" 
            class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold shadow-md transition-colors flex items-center"
            :disabled="goalStore.isLoading"
          >
            <span v-if="goalStore.isLoading" class="mr-2">...</span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ isEditMode ? '수정하기' : '등록하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useGoalStore } from '@/stores/goal';

const props = defineProps({
  isOpen: Boolean,
  defaultGoalType: {
    type: String,
    default: 'DAILY'
  },
  goalToEdit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);
const goalStore = useGoalStore();

const isIndefinite = ref(false);
const isEditMode = computed(() => !!props.goalToEdit);

const form = ref({
  title: '',
  targetValue: 10,
  clickPerProgress: 1,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  goalType: props.defaultGoalType
});

// Initialize form when opening or goalToEdit changes
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.goalToEdit) {
      // Edit Mode
      form.value = { ...props.goalToEdit };
      // endDate check
      if(!form.value.endDate) {
          isIndefinite.value = true;
          form.value.endDate = '';
      } else {
          isIndefinite.value = false;
      }
    } else {
      // Create Mode Reset
      form.value = {
        title: '',
        targetValue: 10,
        clickPerProgress: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        goalType: props.defaultGoalType
      };
      isIndefinite.value = false;
    }
  }
});

watch(() => props.defaultGoalType, (newType) => {
  if (!isEditMode.value) {
    form.value.goalType = newType;
  }
});

watch(isIndefinite, (val) => {
  if (val) {
    form.value.endDate = '';
  }
});

const handleSubmit = async () => {
  try {
    const payload = {
      ...form.value,
      endDate: form.value.endDate || null
    };

    if (isEditMode.value) {
      await goalStore.updateGoal(props.goalToEdit.id, payload);
      alert('목표가 수정되었습니다.');
    } else {
      await goalStore.createGoal(payload);
    }
    
    emit('saved');
    emit('close');
  } catch (error) {
    alert(isEditMode.value ? '목표 수정실패' : '목표 등록 실패');
  }
};
</script>
