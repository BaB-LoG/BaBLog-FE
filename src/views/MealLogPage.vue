<template>
  <div class="min-h-screen bg-background-light px-8 py-10 text-text-light dark:bg-background-dark dark:text-text-dark">
    <div class="mx-auto flex w-[1200px] min-w-[1200px] max-w-[1280px] flex-col gap-6">
      <header class="flex items-center justify-between gap-4">
        <div class="flex flex-col gap-2">
          <h1 class="whitespace-nowrap text-3xl font-black leading-tight tracking-[-0.02em]">오늘의 식단 기록</h1>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">
            하루 식사를 기록하고 영양 밸런스를 확인하세요.
          </p>
        </div>
        <div
            ref="dateControl"
            class="relative flex items-center rounded-lg border border-border-light bg-card-light text-sm text-text-light shadow-sm dark:border-border-dark dark:bg-card-dark dark:text-text-dark">
          <button class="px-3 py-2 hover:text-primary disabled:opacity-50" :disabled="loadingMeals" @click="goPrevDate">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="whitespace-nowrap px-3 py-2 font-semibold">{{ displayDate }}</span>
          <button class="px-3 py-2 hover:text-primary disabled:opacity-50" :disabled="loadingMeals" @click="goNextDate">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
          <button
              class="border-l border-border-light px-3 py-2 hover:text-primary dark:border-border-dark disabled:opacity-50"
              :disabled="loadingMeals"
              @click="toggleDatePicker"
          >
            <span class="material-symbols-outlined">calendar_month</span>
          </button>

          <div
              v-if="showDatePicker"
              class="absolute right-0 top-full z-10 mt-2 w-64 rounded-lg border border-border-light bg-card-light p-3 text-left shadow-lg dark:border-border-dark dark:bg-card-dark"
          >
            <label class="mb-2 block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">날짜 선택</label>
            <input
                type="date"
                class="w-full rounded-lg border border-border-light bg-background-light px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                :value="selectedDate"
                @input="setDate($event.target.value)"
              />
            <div class="mt-3 flex justify-end gap-2">
              <button
                  type="button"
                  class="rounded-md border border-border-light bg-background-light px-3 py-1 text-xs font-semibold text-text-light transition hover:bg-border-light/60 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                  @click="jumpToToday"
              >
                오늘
              </button>
              <button
                  type="button"
                  class="rounded-md bg-primary px-3 py-1 text-xs font-bold text-white transition hover:opacity-90"
                  @click="closeDatePicker"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
          v-if="mealsError"
          class="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/80 dark:bg-red-900/30 dark:text-red-200"
      >
        <span>{{ mealsError }}</span>
        <button
            type="button"
            class="rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-700 dark:bg-red-800/60 dark:text-red-100 dark:hover:bg-red-700/60"
            @click="fetchMeals"
        >
          다시 불러오기
        </button>
      </div>

      <section
          class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <h2 class="pb-4 text-[22px] font-bold leading-tight tracking-[-0.015em]">오늘의 영양 요약</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NutrientProgress
              v-for="stat in nutrientStats"
              :key="stat.label"
              :label="stat.label"
              :current="stat.current"
              :target="stat.target"
              :unit="stat.unit"
              :color-class="stat.colorClass"
          />
        </div>
      </section>

      <section
          class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <h2 class="pb-4 text-[22px] font-bold leading-tight tracking-[-0.015em]">종합 식단 평가</h2>
        <div class="flex flex-col gap-6 md:flex-row md:gap-8">
          <div class="flex w-32 shrink-0 flex-col items-center gap-2">
            <div class="relative size-24">
              <svg class="size-full text-border-light dark:text-border-dark" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" stroke-width="10"/>
                <circle
                    class="text-primary"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="10"
                    :style="scoreCircleStyle"
                />
              </svg>
              <span
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-text-light dark:text-text-dark">
                {{ score }}
                <span class="text-base">%</span>
              </span>
            </div>
            <p class="text-center text-sm font-semibold text-text-light dark:text-text-dark">균형 잡힌 식단</p>
          </div>
          <div class="flex flex-1 flex-col gap-3">
            <p class="leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
              오늘의 식단은 전반적으로 균형이 잘 잡혀 있습니다. 특히 아침 식사를 통해 충분한 단백질을 섭취하신 점이 좋습니다. 다만 칼로리와 탄수화물 섭취가 부족하니, 점심과 저녁을 규칙적으로 챙기고
              다양한 채소를 더해보세요.
            </p>
            <div class="flex flex-col gap-3">
              <div class="flex items-start gap-3 rounded-lg bg-primary/10 px-3 py-3 dark:bg-primary/20">
                <span class="material-symbols-outlined text-primary">thumb_up</span>
                <div>
                  <h4 class="font-bold text-text-light dark:text-text-dark">잘한 점</h4>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    아침 식단에 단백질과 복합 탄수화물이 포함되어 있어 좋은 시작을 했어요.
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3 rounded-lg bg-amber-50 px-3 py-3 dark:bg-amber-900/30">
                <span class="material-symbols-outlined text-amber-500">lightbulb</span>
                <div>
                  <h4 class="font-bold text-text-light dark:text-text-dark">개선 제안</h4>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    점심과 저녁을 규칙적으로 챙기고, 현미밥·채소 등 건강한 탄수화물을 추가해 보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-6">
        <MealLogPanel
          title="아침"
          :items="meals.BREAKFAST.items"
          :stats="meals.BREAKFAST.stats"
          empty-message="아침 식사 기록이 없습니다."
          @open-add="handleOpenAdd"
          @open-edit="handleOpenEdit"
          @delete-item="handleDeleteItem"
        />
        <MealLogPanel
          title="점심"
          :items="meals.LUNCH.items"
          :stats="meals.LUNCH.stats"
          empty-message="점심 식사 기록이 없습니다."
          @open-add="handleOpenAdd"
          @open-edit="handleOpenEdit"
          @delete-item="handleDeleteItem"
        />
        <MealLogPanel
          title="저녁"
          :items="meals.DINNER.items"
          :stats="meals.DINNER.stats"
          empty-message="저녁 식사 기록이 없습니다."
          @open-add="handleOpenAdd"
          @open-edit="handleOpenEdit"
          @delete-item="handleDeleteItem"
        />
        <MealLogPanel
          title="간식"
          :items="meals.SNACK.items"
          :stats="meals.SNACK.stats"
          empty-message="간식 기록이 없습니다."
          @open-add="handleOpenAdd"
          @open-edit="handleOpenEdit"
          @delete-item="handleDeleteItem"
        />
      </section>
    </div>
  </div>

  <AddMealFoodModal
    v-if="showAddModal"
    :meal-label="selectedMealLabel"
    :mode="modalMode"
    :initial-food="editTarget?.food || null"
    :initial-quantity="editTarget?.intake ?? ''"
    @close="handleCloseModal"
    @submit="handleSubmitMeal"
  />

  <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div class="w-full max-w-md rounded-xl border border-border-light bg-card-light p-6 shadow-2xl dark:border-border-dark dark:bg-card-dark">
      <h3 class="text-lg font-bold text-text-light dark:text-text-dark">음식 삭제</h3>
      <p class="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        {{ deleteTarget?.name || '선택한 음식' }}을(를) 삭제할까요? 삭제하면 되돌릴 수 없습니다.
      </p>
      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="h-11 rounded-lg border border-border-light bg-background-light px-5 text-sm font-semibold text-text-light transition hover:bg-border-light/60 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
          @click="closeDeleteConfirm"
        >
          취소
        </button>
        <button
          type="button"
          class="h-11 rounded-lg bg-red-500 px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          :disabled="deleteLoading"
          @click="confirmDelete"
        >
          {{ deleteLoading ? '삭제 중...' : '삭제' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
import {addDays, format, parseISO} from 'date-fns';
import AddMealFoodModal from '@/components/AddMealFoodModal.vue';
import MealLogPanel from '@/components/MealLogPanel.vue';
import NutrientProgress from '@/components/NutrientProgress.vue';
import {addMealFood, deleteMealFood, getMealsByDate, updateMealFood} from '@/services/mealService';
import {getDailyTargets} from '@/services/memberNutrientService';

// 기본 날짜는 오늘
const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'));
const showDatePicker = ref(false);
const dateControl = ref(null);
const loadingMeals = ref(false);
const mealsError = ref('');

const nutrientTargets = reactive({
  kcal: 0,
  carbohydrates: 0,
  protein: 0,
  fat: 0,
  saturatedFat: 0,
  transFat: 0,
  sugar: 0,
  natrium: 0,
  cholesterol: 0,
});

const makeEmptyStats = () => ({
  kcal: 0,
  carbohydrates: 0,
  protein: 0,
  fat: 0,
  saturatedFat: 0,
  transFat: 0,
  sugar: 0,
  natrium: 0,
  cholesterol: 0,
});

const meals = reactive({
  BREAKFAST: { label: '아침', items: [], stats: makeEmptyStats() },
  LUNCH: { label: '점심', items: [], stats: makeEmptyStats() },
  DINNER: { label: '저녁', items: [], stats: makeEmptyStats() },
  SNACK: { label: '간식', items: [], stats: makeEmptyStats() },
});

const hydrateMeals = (mealList) => {
  // 리셋
  Object.keys(meals).forEach((key) => {
    meals[key].items = [];
    meals[key].stats = makeEmptyStats();
  });

  mealList.forEach((meal) => {
    const type = meal.mealType;
    if (!meals[type]) return;
    // 영양은 nutrition 이 있으면 사용, 없으면 foods 합산
    meals[type].stats = meal.nutrition
        ? {...makeEmptyStats(), ...meal.nutrition}
        : meal.foods?.reduce((acc, food) => {
          Object.entries(makeEmptyStats()).forEach(([k]) => {
            acc[k] = (acc[k] || 0) + (food[k] || 0);
          });
          return acc;
        }, makeEmptyStats());
    meals[type].items = (meal.foods || []).map((food) => ({
      mealFoodId: food.mealFoodId,
      mealId: food.mealId,
      foodId: food.foodId,
      name: food.name,
      detail: `${food.intake}g${food.kcal ? `, ${food.kcal} kcal` : ''}`,
      intake: food.intake,
      unit: food.unit || 'g',
      vendor: food.vendor,
      standard: food.standard,
      foodWeight: food.foodWeight,
      food: {
        id: food.foodId,
        name: food.name,
        vendor: food.vendor,
        standard: food.standard,
        foodWeight: food.foodWeight,
        kcal: food.kcal,
        protein: food.protein,
        fat: food.fat,
        saturatedFat: food.saturatedFat,
        transFat: food.transFat,
        carbohydrates: food.carbohydrates,
        sugar: food.sugar,
        natrium: food.natrium,
        cholesterol: food.cholesterol,
      },
      nutrition: {
        kcal: food.kcal,
        carbohydrates: food.carbohydrates,
        protein: food.protein,
        fat: food.fat,
        saturatedFat: food.saturatedFat,
        transFat: food.transFat,
        sugar: food.sugar,
        natrium: food.natrium,
        cholesterol: food.cholesterol,
      },
    }));
  });
};

const totalStats = computed(() => {
  const sum = makeEmptyStats();
  Object.values(meals).forEach((meal) => {
    Object.entries(meal.stats || {}).forEach(([k, v]) => {
      sum[k] = (sum[k] || 0) + (v || 0);
    });
  });
  return sum;
});

const formatTwoDecimal = (val) => Math.round((val || 0) * 100) / 100;

const nutrientStats = computed(() => [
  { label: '총 칼로리', current: formatTwoDecimal(totalStats.value.kcal), target: nutrientTargets.kcal, unit: 'kcal', colorClass: 'bg-primary' },
  { label: '탄수화물', current: formatTwoDecimal(totalStats.value.carbohydrates), target: nutrientTargets.carbohydrates, unit: 'g', colorClass: 'bg-amber-400' },
  { label: '단백질', current: formatTwoDecimal(totalStats.value.protein), target: nutrientTargets.protein, unit: 'g', colorClass: 'bg-red-500' },
  { label: '지방', current: formatTwoDecimal(totalStats.value.fat), target: nutrientTargets.fat, unit: 'g', colorClass: 'bg-blue-500' },
  { label: '포화 지방', current: formatTwoDecimal(totalStats.value.saturatedFat), target: nutrientTargets.saturatedFat, unit: 'g', colorClass: 'bg-sky-500' },
  { label: '트랜스 지방', current: formatTwoDecimal(totalStats.value.transFat), target: nutrientTargets.transFat, unit: 'g', colorClass: 'bg-blue-300' },
  { label: '당류', current: formatTwoDecimal(totalStats.value.sugar), target: nutrientTargets.sugar, unit: 'g', colorClass: 'bg-yellow-500' },
  { label: '나트륨', current: formatTwoDecimal(totalStats.value.natrium), target: nutrientTargets.natrium, unit: 'mg', colorClass: 'bg-purple-500' },
  { label: '콜레스테롤', current: formatTwoDecimal(totalStats.value.cholesterol), target: nutrientTargets.cholesterol, unit: 'mg', colorClass: 'bg-orange-500' },
]);

const score = computed(() => {
  const kcalPct = nutrientTargets.kcal ? Math.min(100, Math.round((totalStats.value.kcal / nutrientTargets.kcal) * 100)) : 0;
  return kcalPct || 0;
});

const scoreCircleStyle = computed(() => {
  const clamped = Math.min(100, Math.max(0, score.value));
  const circumference = 2 * Math.PI * 45;
  const offset = ((100 - clamped) / 100) * circumference;
  return {
    strokeDasharray: `${circumference}`,
    strokeDashoffset: `${offset}`,
  };
});

const showAddModal = ref(false);
const modalMode = ref('add');
const editTarget = ref(null);
const showDeleteConfirm = ref(false);
const deleteTarget = ref(null);
const deleteLoading = ref(false);
const selectedMealLabel = ref('');
const selectedMealType = ref('');

const handleOpenAdd = (label) => {
  selectedMealLabel.value = label;
  selectedMealType.value = mealLabelToType(label);
  modalMode.value = 'add';
  editTarget.value = null;
  showAddModal.value = true;
};

const handleOpenEdit = ({ label, item }) => {
  selectedMealLabel.value = label;
  selectedMealType.value = mealLabelToType(label);
  modalMode.value = 'edit';
  editTarget.value = item;
  showAddModal.value = true;
};

const handleCloseModal = () => {
  showAddModal.value = false;
  modalMode.value = 'add';
  editTarget.value = null;
};

const handleSubmitMeal = async (payload) => {
  if (!selectedMealType.value) return;
  try {
    if (modalMode.value === 'edit' && editTarget.value) {
      await updateMealFood(editTarget.value.mealFoodId, {
        mealId: editTarget.value.mealId,
        foodId: payload.foodId,
        intake: payload.intake,
        unit: payload.unit,
      });
    } else {
      await addMealFood({
        mealType: selectedMealType.value,
        mealDate: selectedDate.value,
        foodId: payload.foodId,
        intake: payload.intake,
        unit: payload.unit,
      });
    }
    await fetchMeals();
    handleCloseModal();
  } catch (error) {
    console.error('음식 저장 실패', error);
    alert('음식 저장에 실패했습니다.');
  }
};

const handleDeleteItem = async ({ item }) => {
  if (!item?.mealFoodId) {
    alert('삭제할 수 없는 항목입니다.');
    return;
  }
  deleteTarget.value = item;
  showDeleteConfirm.value = true;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  deleteTarget.value = null;
  deleteLoading.value = false;
};

const confirmDelete = async () => {
  if (!deleteTarget.value?.mealFoodId || deleteLoading.value) {
    return;
  }
  deleteLoading.value = true;
  try {
    await deleteMealFood(deleteTarget.value.mealFoodId);
    await fetchMeals();
    closeDeleteConfirm();
  } catch (error) {
    console.error('음식 삭제 실패', error);
    alert('음식 삭제에 실패했습니다.');
    deleteLoading.value = false;
  }
};

const mealLabelToType = (label) => {
  switch (label) {
    case '아침':
      return 'BREAKFAST';
    case '점심':
      return 'LUNCH';
    case '저녁':
      return 'DINNER';
    case '간식':
      return 'SNACK';
    default:
      return '';
  }
};

const displayDate = computed(() => {
  try {
    return format(parseISO(selectedDate.value), 'yyyy년 MM월 dd일');
  } catch (error) {
    return selectedDate.value;
  }
});

const changeDateBy = async (delta) => {
  try {
    const next = addDays(parseISO(selectedDate.value), delta);
    selectedDate.value = format(next, 'yyyy-MM-dd');
  } catch (error) {
    console.error('날짜 변경 실패', error);
  }
};

const goPrevDate = () => changeDateBy(-1);
const goNextDate = () => changeDateBy(1);

const jumpToToday = () => {
  selectedDate.value = format(new Date(), 'yyyy-MM-dd');
};

const setDate = (value) => {
  if (!value) return;
  try {
    selectedDate.value = format(parseISO(value), 'yyyy-MM-dd');
    showDatePicker.value = false;
  } catch (error) {
    console.error('날짜 파싱 실패', error);
  }
};

const toggleDatePicker = () => {
  showDatePicker.value = !showDatePicker.value;
};

const closeDatePicker = () => {
  showDatePicker.value = false;
};

const handleOutsideClick = (event) => {
  if (!showDatePicker.value) return;
  if (dateControl.value && !dateControl.value.contains(event.target)) {
    showDatePicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const fetchMeals = async () => {
  loadingMeals.value = true;
  mealsError.value = '';
  try {
    const res = await getMealsByDate(selectedDate.value);
    hydrateMeals(res.data || []);
  } catch (error) {
    console.error('식단 조회 실패', error);
    mealsError.value = '식단 정보를 불러오지 못했습니다.';
    hydrateMeals([]);
  } finally {
    loadingMeals.value = false;
  }
};

const fetchTargets = async () => {
  try {
    const res = await getDailyTargets(selectedDate.value);
    Object.assign(nutrientTargets, res.data || {});
  } catch (error) {
    console.error('영양 목표 조회 실패', error);
  }
};

watch(
  selectedDate,
  async () => {
    await Promise.all([fetchMeals(), fetchTargets()]);
  },
  { immediate: true },
);
</script>
