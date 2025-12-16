<template>
  <div class="min-h-screen bg-background-light px-8 py-10 text-text-light dark:bg-background-dark dark:text-text-dark">
    <div class="mx-auto flex w-[1200px] min-w-[1200px] max-w-[1280px] flex-col gap-8">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-black leading-tight tracking-[-0.02em]">냠냠 대시보드</h1>
        <p class="text-text-secondary-light dark:text-text-secondary-dark">
          오늘의 식단과 목표 달성 현황을 확인하세요.
        </p>
      </header>

      <div class="grid grid-cols-[2fr_1fr] gap-6">
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
                    v-for="meal in meals"
                    :key="meal.label"
                    class="flex items-center justify-between rounded-lg border border-border-light bg-background-light px-4 py-3 dark:border-border-dark dark:bg-background-dark"
                    :class="!meal.name ? 'opacity-60' : ''"
                  >
                    <div class="flex items-center gap-3">
                      <img class="w-8 h-8" :src="meal.icon" :alt="icon"/>
                      <div>
                        <p class="font-medium">{{ meal.label }}</p>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {{ meal.name || '기록되지 않음' }}
                        </p>
                      </div>
                    </div>
                    <p v-if="meal.kcal" class="font-semibold text-text-light dark:text-text-dark">{{ meal.kcal }} kcal</p>
                  </li>
                </ul>
              </div>
              <div class="flex flex-col gap-3">
                <h3 class="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                  총 섭취 현황 및 평가
                </h3>
                <div class="flex h-full flex-col rounded-lg border border-border-light bg-background-light p-4 dark:border-border-dark dark:bg-background-dark">
                  <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-bold text-primary">{{ intake.current }}</p>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark">/ {{ intake.target }} kcal</p>
                  </div>
                  <div class="mt-3 h-2.5 w-full rounded-full bg-border-light dark:bg-border-dark">
                    <div
                      class="h-full rounded-full bg-primary"
                      :style="{ width: intake.progress }"
                    />
                  </div>
                  <p class="mt-3 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                    {{ intake.message }}
                  </p>
                  <div class="mt-4 border-t border-border-light pt-3 text-sm dark:border-border-dark">
                    <div
                      v-for="macro in macros"
                      :key="macro.label"
                      class="flex items-center justify-between"
                    >
                      <span class="text-text-secondary-light dark:text-text-secondary-dark">{{ macro.label }}</span>
                      <span class="font-medium">{{ macro.value }}</span>
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
const meals = [
  { label: '아침', name: '닭가슴살 샐러드', kcal: 350, icon: 'src/assets/breakfast.png' },
  { label: '점심', name: '현미밥과 불고기', kcal: 550, icon: 'src/assets/lunch.png' },
  { label: '저녁', name: null, kcal: null, icon: 'src/assets/dinner.png' },
];

const macros = [
  { label: '탄수화물', value: '100g' },
  { label: '단백질', value: '70g' },
  { label: '지방', value: '25g' },
];

const intake = {
  current: 900,
  target: 1800,
  progress: '50%',
  message: '아직 목표 칼로리의 절반을 섭취했어요. 저녁 식사를 통해 단백질과 채소를 보충해보세요.',
};

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
