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
        <div class="flex items-center rounded-lg border border-border-light bg-card-light text-sm text-text-light shadow-sm dark:border-border-dark dark:bg-card-dark dark:text-text-dark">
          <button class="px-3 py-2 hover:text-primary">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="whitespace-nowrap px-3 py-2 font-semibold">2023년 10월 26일</span>
          <button class="px-3 py-2 hover:text-primary">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
          <button class="border-l border-border-light px-3 py-2 hover:text-primary dark:border-border-dark">
            <span class="material-symbols-outlined">calendar_month</span>
          </button>
        </div>
      </header>

      <section class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <h2 class="pb-4 text-[22px] font-bold leading-tight tracking-[-0.015em]">오늘의 영양 요약</h2>
        <div class="grid grid-cols-3 gap-6">
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

      <section class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <h2 class="pb-4 text-[22px] font-bold leading-tight tracking-[-0.015em]">종합 식단 평가</h2>
        <div class="flex gap-8">
          <div class="flex w-32 shrink-0 flex-col items-center gap-2">
            <div
              class="relative flex h-24 w-24 items-center justify-center rounded-full bg-border-light"
              :style="scoreRingStyle"
            >
              <div class="absolute inset-[10px] rounded-full bg-card-light dark:bg-card-dark" />
              <span class="relative text-2xl font-bold text-text-light dark:text-text-dark">
                {{ score }}
                <span class="text-base">%</span>
              </span>
            </div>
            <p class="text-center text-sm font-semibold text-text-light dark:text-text-dark">균형 잡힌 식단</p>
          </div>
          <div class="flex flex-1 flex-col gap-3">
            <p class="leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
              오늘은 전반적으로 균형이 잘 잡혀 있습니다. 아침에 충분한 단백질을 섭취했지만 칼로리와 탄수화물이 조금 부족해요.
              규칙적인 식사와 채소를 추가해 영양 목표를 채워보세요.
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
                    점심과 저녁을 규칙적으로 챙기고, 퀴노아나 현미밥 등 건강한 탄수화물과 다양한 채소를 추가하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-6">
        <MealLogSection
          title="아침"
          :items="breakfast"
          :total-kcal="340"
          empty-message="아침 식사 기록이 없습니다."
        />
        <MealLogSection
          title="점심"
          :items="[]"
          :total-kcal="0"
          empty-message="점심 식사 기록이 없습니다."
        />
        <MealLogSection
          title="저녁"
          :items="[]"
          :total-kcal="0"
          empty-message="저녁 식사 기록이 없습니다."
        />
        <MealLogSection
          title="간식"
          :items="snacks"
          :total-kcal="170"
          empty-message="간식 기록이 없습니다."
        />
      </section>

      <div class="flex justify-end py-4">
        <button
          class="inline-flex h-12 min-w-[220px] items-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          기록 완료 및 평가하기
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MealLogSection from '@/components/MealLogSection.vue';
import NutrientProgress from '@/components/NutrientProgress.vue';

const nutrientStats = [
  { label: '총 칼로리', current: 510, target: 2200, unit: 'kcal', colorClass: 'bg-primary' },
  { label: '탄수화물', current: 55, target: 300, unit: 'g', colorClass: 'bg-amber-400' },
  { label: '단백질', current: 25, target: 150, unit: 'g', colorClass: 'bg-red-500' },
  { label: '지방', current: 22, target: 70, unit: 'g', colorClass: 'bg-blue-500' },
  { label: '포화 지방', current: 5, target: 20, unit: 'g', colorClass: 'bg-sky-500' },
  { label: '트랜스 지방', current: 0, target: 2, unit: 'g', colorClass: 'bg-blue-300' },
  { label: '당류', current: 15, target: 50, unit: 'g', colorClass: 'bg-yellow-500' },
  { label: '나트륨', current: 800, target: 2000, unit: 'mg', colorClass: 'bg-purple-500' },
  { label: '콜레스테롤', current: 120, target: 300, unit: 'mg', colorClass: 'bg-orange-500' },
];

const breakfast = [
  { name: '계란 후라이', detail: '2개, 180 kcal' },
  { name: '통밀빵', detail: '2조각, 160 kcal' },
];

const snacks = [{ name: '아몬드', detail: '한 줌 (30g), 170 kcal' }];

const score = 70;
const scoreRingStyle = computed(() => {
  const clamped = Math.min(100, Math.max(0, score));
  const deg = (clamped / 100) * 360;
  return {
    background: `conic-gradient(#4CAF50 ${deg}deg, #e5e7eb 0deg)`,
  };
});
</script>
