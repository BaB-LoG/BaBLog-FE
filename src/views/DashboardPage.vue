<template>
  <div class="min-h-screen bg-background-light px-8 py-10 text-text-light dark:bg-background-dark dark:text-text-dark">
    <div class="mx-auto flex w-[1200px] min-w-[1200px] max-w-[1280px] flex-col gap-8">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-black leading-tight tracking-[-0.02em]">대시보드</h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark">
          오늘의 식단과 목표 달성 현황을 확인하세요.
        </p>
      </header>

      <div class="grid grid-cols-[3fr_1fr] gap-6">
        <section class="flex flex-col gap-6">
          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-[22px] font-bold leading-tight tracking-[-0.015em]">오늘의 식단 기록 요약</h2>
              <router-link
                to="/meal-log"
                class="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80"
              >
                식단 기록하기
              </router-link>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="flex flex-col gap-3">
                <h3 class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                  오늘의 식사
                </h3>
                <ul class="flex flex-col gap-3">
                  <li
                    v-for="meal in mealSummaries"
                    :key="meal.mealType"
                    class="flex items-center justify-between rounded-lg border border-border-light bg-background-light px-4 py-3 dark:border-border-dark dark:bg-background-dark"
                    :class="meal.foodCount === 0 ? 'opacity-60' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <img class="w-8 h-8" :src="meal.icon" :alt="meal.label" />
                      <div>
                        <p class="font-medium">{{ meal.label }}</p>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {{ meal.displayName }}
                        </p>
                      </div>
                    </div>
                    <p v-if="meal.kcal > 0" class="font-semibold text-text-light dark:text-text-dark">{{ formatNumber(meal.kcal) }} kcal</p>
                  </li>
                </ul>
              </div>
              <div class="flex flex-col gap-3">
                <h3 class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                  총 섭취 현황
                </h3>
                <div class="flex h-full flex-col rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                  <div class="flex items-baseline gap-2 justify-between">
                    <p class="text-3xl font-bold text-primary">{{ formatNumber(totalKcal) }} kcal</p>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">오늘 총 섭취</p>
                  </div>
                  <div class="mt-4 border-t border-border-light pt-4 text-sm dark:border-border-dark">
                    <div class="grid grid-cols-2 gap-4">
                      <div
                        v-for="macro in macroSummaries"
                        :key="macro.label"
                        class="flex flex-col gap-2"
                      >
                        <div class="flex items-center justify-between">
                          <span class="text-text-secondary-light dark:text-text-secondary-dark">{{ macro.label }} ({{ macro.unit }})</span>
                          <span class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {{ formatNumber(macro.current) }} / {{ formatNumber(macro.target) }}
                          </span>
                        </div>
                        <div class="h-2 w-full rounded-full bg-border-light dark:bg-border-dark">
                          <div class="h-full rounded-full" :class="macro.colorClass" :style="{ width: `${macro.percent}%` }" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-[22px] font-bold leading-tight tracking-[-0.015em]">어제의 식단 기록에 대한 평가</h2>
              <router-link
                to="/reports"
                class="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80"
              >
                자세히 보기
              </router-link>
            </div>
            <div class="flex gap-6">
              <div class="flex w-48 shrink-0 flex-col items-center justify-center rounded-lg border border-border-light bg-background-light px-6 py-8 text-center dark:border-border-dark dark:bg-background-dark">
                <p class="text-5xl">🤔</p>
                <p class="mt-3 text-lg font-bold">조금 아쉬워요</p>
                <p class="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">72점</p>
              </div>
              <div class="flex flex-1 flex-col gap-4">
                <div>
                  <h3 class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">냠냠코치의 피드백</h3>
                  <p class="mt-1 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    어제는 전반적으로 균형이 좋았지만, 저녁 식사에서 지방 섭취가 다소 높았어요. 튀김류 대신 구이나 찜 요리를 선택하면 더 건강한 식단을 만들 수 있을 거예요.
                  </p>
                </div>
                <div class="rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                  <h4 class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">주요 영양소 섭취량</h4>
                  <div class="mt-2 flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center gap-2">
                      <span class="h-3 w-3 rounded-full bg-primary" />
                      <span class="text-text-secondary-light dark:text-text-secondary-dark">탄수화물: 45%</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="h-3 w-3 rounded-full bg-blue-500" />
                      <span class="text-text-secondary-light dark:text-text-secondary-dark">단백질: 20%</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="h-3 w-3 rounded-full bg-amber-400" />
                      <span class="text-text-secondary-light dark:text-text-secondary-dark">
                        지방: 35% <span class="text-xs text-red-500">(높음)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <h2 class="mb-4 text-[22px] font-bold leading-tight tracking-[-0.015em]">주간 영양 요약</h2>
            <div class="flex flex-wrap gap-6">
              <div class="flex min-w-[320px] flex-1 flex-col gap-3">
                <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">주간 평균 섭취량</p>
                <p class="truncate text-[32px] font-bold leading-tight">{{ weekly.averageKcal }} kcal</p>
                <div class="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                  <span>지난 주 대비</span>
                  <span class="inline-flex items-center gap-1 text-primary font-semibold">
                    <span class="material-symbols-outlined text-sm">arrow_upward</span>
                    {{ weekly.change }}
                  </span>
                </div>
                <div class="mt-4 grid min-h-[180px] grid-flow-col grid-rows-[1fr_auto] items-end justify-items-center gap-4">
                  <div v-for="bar in weekly.bars" :key="bar.label" class="flex h-full w-full flex-col items-center justify-end gap-2">
                    <div class="w-full rounded-t-md bg-primary/30 dark:bg-primary/40" :style="{ height: bar.height }" />
                    <p class="text-[13px] font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                      {{ bar.label }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex min-w-[320px] flex-1 flex-col gap-3">
                <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">지난달 식습관 종합 평가</p>
                <div class="flex flex-1 flex-col items-center justify-center rounded-lg border border-border-light bg-background-light px-6 py-8 text-center dark:border-border-dark dark:bg-background-dark">
                  <span class="mb-2 text-5xl">👍</span>
                  <p class="text-2xl font-bold text-primary">아주 좋아요!</p>
                  <p class="mt-3 text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                    균형 잡힌 식단을 잘 유지하고 있어요. 지금처럼 꾸준히 관리해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside class="flex flex-col gap-6">
            <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-bold">일일 목표</h3>
                <router-link to="/goals" class="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80">
                  목표 설정
                </router-link>
              </div>
            <div class="flex flex-col gap-4">
              <div v-for="goal in dailyGoals" :key="goal.label" class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium">{{ goal.label }}</p>
                  <p class="text-sm font-semibold" :class="goal.progress === 100 ? 'text-primary' : ''">{{ goal.progress }}%</p>
                </div>
                <div class="h-2 w-full rounded-full bg-border-light dark:bg-border-dark">
                  <div class="h-full rounded-full bg-primary" :style="{ width: goal.progress + '%' }" />
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <h3 class="text-lg font-bold">주간 목표</h3>
            <div class="mt-4 flex flex-col gap-4">
              <div v-for="goal in weeklyGoals" :key="goal.label" class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium">{{ goal.label }}</p>
                  <p class="text-sm font-semibold">{{ goal.progress }}%</p>
                </div>
                <div class="h-2 w-full rounded-full bg-border-light dark:bg-border-dark">
                  <div class="h-full rounded-full bg-primary" :style="{ width: goal.progress + '%' }" />
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
            <h3 class="text-lg font-bold">기간 목표</h3>
            <div class="mt-4 flex flex-col gap-4">
              <div v-for="goal in longTermGoals" :key="goal.label" class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium">{{ goal.label }}</p>
                  <p class="text-sm font-semibold">{{ goal.progress }}%</p>
                </div>
                <div class="h-2 w-full rounded-full bg-border-light dark:bg-border-dark">
                  <div class="h-full rounded-full bg-primary" :style="{ width: goal.progress + '%' }" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { format } from 'date-fns';
import { getDailyMealSummary } from '@/services/mealService';
import breakfastIcon from '@/assets/breakfast.png';
import lunchIcon from '@/assets/lunch.png';
import dinnerIcon from '@/assets/dinner.png';
import snackIcon from '@/assets/bablog_logo.png';

const today = format(new Date(), 'yyyy-MM-dd');
const summary = ref({
  date: today,
  totals: {
    kcal: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    transFat: 0,
    sugar: 0,
    natrium: 0,
    cholesterol: 0,
  },
  targets: {
    kcal: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0,
    saturatedFat: 0,
    transFat: 0,
    sugar: 0,
    natrium: 0,
    cholesterol: 0,
  },
  meals: [],
});
const loadingSummary = ref(false);
const summaryError = ref('');

const mealMeta = {
  BREAKFAST: { label: '아침', icon: breakfastIcon },
  LUNCH: { label: '점심', icon: lunchIcon },
  DINNER: { label: '저녁', icon: dinnerIcon },
  SNACK: { label: '간식', icon: snackIcon },
};

const mealOrder = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

const formatNumber = (value) => {
  const numeric = Number(value || 0);
  if (Number.isNaN(numeric)) return '0';
  return numeric % 1 === 0 ? numeric.toLocaleString() : numeric.toFixed(1);
};

const mealSummaries = computed(() =>
  mealOrder.map((mealType) => {
    const meta = mealMeta[mealType];
    const base = summary.value.meals.find((meal) => meal.mealType === mealType) || {};
    const foodCount = Number(base.foodCount || 0);
    const representativeFoodName = base.representativeFoodName || '';
    let displayName = '기록되지 않음';
    if (foodCount > 0) {
      if (representativeFoodName) {
        displayName = foodCount > 1
          ? `${representativeFoodName} 외 ${foodCount - 1}종`
          : representativeFoodName;
      } else {
        displayName = `음식 ${foodCount}종`;
      }
    }
    return {
      mealType,
      label: meta.label,
      icon: meta.icon,
      foodCount,
      displayName,
      kcal: Number(base.kcal || 0),
    };
  })
);

const totalKcal = computed(() => summary.value.totals?.kcal ?? 0);

const nutrientDefinitions = [
  { key: 'carbohydrates', label: '탄수화물', unit: 'g' },
  { key: 'protein', label: '단백질', unit: 'g' },
  { key: 'fat', label: '지방', unit: 'g' },
  { key: 'saturatedFat', label: '포화 지방', unit: 'g' },
  { key: 'transFat', label: '트랜스 지방', unit: 'g' },
  { key: 'sugar', label: '당류', unit: 'g' },
  { key: 'natrium', label: '나트륨', unit: 'mg' },
  { key: 'cholesterol', label: '콜레스테롤', unit: 'mg' },
];

const macroSummaries = computed(() =>
  nutrientDefinitions.map((nutrient) => {
    const current = Number(summary.value.totals?.[nutrient.key] || 0);
    const target = Number(summary.value.targets?.[nutrient.key] || 0);
    const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    const colorClass = getProgressColorClass(current, target);
    return {
      label: nutrient.label,
      unit: nutrient.unit,
      current,
      target,
      percent,
      colorClass,
    };
  })
);

const getProgressColorClass = (current, target) => {
  if (!target || target <= 0) {
    return 'bg-border-light dark:bg-border-dark';
  }
  const ratio = current / target;
  if (ratio < 0.6) {
    return 'bg-amber-400';
  }
  if (ratio <= 1.1) {
    return 'bg-primary';
  }
  return 'bg-red-500';
};

const normalizeSummary = (data) => ({
  date: data?.date || today,
  totals: {
    kcal: Number(data?.totals?.kcal || 0),
    carbohydrates: Number(data?.totals?.carbohydrates || 0),
    protein: Number(data?.totals?.protein || 0),
    fat: Number(data?.totals?.fat || 0),
    saturatedFat: Number(data?.totals?.saturatedFat || 0),
    transFat: Number(data?.totals?.transFat || 0),
    sugar: Number(data?.totals?.sugar || 0),
    natrium: Number(data?.totals?.natrium || 0),
    cholesterol: Number(data?.totals?.cholesterol || 0),
  },
  targets: {
    kcal: Number(data?.targets?.kcal || 0),
    carbohydrates: Number(data?.targets?.carbohydrates || 0),
    protein: Number(data?.targets?.protein || 0),
    fat: Number(data?.targets?.fat || 0),
    saturatedFat: Number(data?.targets?.saturatedFat || 0),
    transFat: Number(data?.targets?.transFat || 0),
    sugar: Number(data?.targets?.sugar || 0),
    natrium: Number(data?.targets?.natrium || 0),
    cholesterol: Number(data?.targets?.cholesterol || 0),
  },
  meals: Array.isArray(data?.meals) ? data.meals : [],
});

const fetchSummary = async () => {
  loadingSummary.value = true;
  summaryError.value = '';
  try {
    const res = await getDailyMealSummary(today);
    summary.value = normalizeSummary(res.data);
  } catch (error) {
    console.error('대시보드 요약 조회 실패', error);
    summaryError.value = '대시보드 요약을 불러오지 못했습니다.';
    summary.value = normalizeSummary(null);
  } finally {
    loadingSummary.value = false;
  }
};

onMounted(() => {
  fetchSummary();
});

const weekly = {
  averageKcal: 1850,
  change: '5%',
  bars: [
    { label: '탄수화물', height: '75%' },
    { label: '단백질', height: '55%' },
    { label: '지방', height: '40%' },
  ],
};

const dailyGoals = [
  { label: '물 2L 마시기', progress: 100 },
  { label: '점심 후 15분 산책', progress: 0 },
];

const weeklyGoals = [
  { label: '운동 3회 이상 하기', progress: 66 },
  { label: '채소 5종류 먹기', progress: 80 },
];

const longTermGoals = [
  { label: '체지방 2kg 감량', progress: 45 },
  { label: '3개월 식단 기록 유지', progress: 75 },
];
</script>
