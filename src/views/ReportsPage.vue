<template>
  <div class="p-8">
    <div class="mx-auto flex w-[1280px] flex-col gap-6">
      <header class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <h1 class="text-2xl font-bold text-text-light dark:text-text-dark">리포트</h1>
        <p class="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
          주간 흐름과 일간 평가를 확인하고 다음 식단 계획을 세워보세요.
        </p>
      </header>

      <section class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <div class="flex flex-row items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-text-light dark:text-text-dark">이번 주 리포트</h2>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              매주 월요일 자정에 생성됩니다.
            </p>
          </div>
          <button
              type="button"
              class="h-11 rounded-lg border border-border-light bg-background-light px-4 text-sm font-semibold text-text-light transition hover:bg-border-light/60 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
              :disabled="weeklyLoading"
              @click="fetchWeeklyReport"
          >
            {{ weeklyLoading ? '불러오는 중...' : '새로고침' }}
          </button>
        </div>

        <div v-if="weeklyError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/80 dark:bg-red-900/30 dark:text-red-200">
          {{ weeklyError }}
        </div>

        <div v-if="weeklyReport" class="mt-6 grid grid-cols-[160px_1fr] gap-6">
          <div class="flex flex-col items-center gap-2">
            <div class="text-4xl font-bold text-text-light dark:text-text-dark">{{ weeklyReport.score }}</div>
            <div class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{{ weeklyReport.grade }}</div>
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {{ weeklyPeriodText }}
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {{ weeklyReport.summary }}
            </p>
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-lg bg-primary/10 px-3 py-3 dark:bg-primary/20">
                <h4 class="text-sm font-bold text-text-light dark:text-text-dark">잘한 점</h4>
                <p
                    v-for="(item, index) in weeklyReport.highlights"
                    :key="`weekly-highlight-${index}`"
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {{ item }}
                </p>
              </div>
              <div class="rounded-lg bg-amber-50 px-3 py-3 dark:bg-amber-900/30">
                <h4 class="text-sm font-bold text-text-light dark:text-text-dark">개선 포인트</h4>
                <p
                    v-for="(item, index) in weeklyReport.improvements"
                    :key="`weekly-improve-${index}`"
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {{ item }}
                </p>
              </div>
              <div class="rounded-lg bg-sky-50 px-3 py-3 dark:bg-sky-900/30">
                <h4 class="text-sm font-bold text-text-light dark:text-text-dark">추천 행동</h4>
                <p
                    v-for="(item, index) in weeklyReport.recommendations"
                    :key="`weekly-recommend-${index}`"
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!weeklyLoading" class="mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          아직 주간 리포트가 없습니다.
        </div>
      </section>

      <section class="rounded-xl border border-border-light bg-card-light p-6 shadow-sm dark:border-border-dark dark:bg-card-dark">
        <div class="flex flex-row items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-bold text-text-light dark:text-text-dark">일간 리포트</h2>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Meal Log 페이지에서 평가 버튼을 누르면 생성됩니다.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <input
                type="date"
                class="h-11 rounded-lg border border-border-light bg-background-light px-3 text-sm text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                :value="dailyDate"
                @input="setDailyDate($event.target.value)"
            />
            <button
                type="button"
                class="h-11 rounded-lg border border-border-light bg-background-light px-4 text-sm font-semibold text-text-light transition hover:bg-border-light/60 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                :disabled="dailyLoading"
                @click="fetchDailyReport"
            >
              {{ dailyLoading ? '불러오는 중...' : '새로고침' }}
            </button>
          </div>
        </div>

        <div v-if="dailyError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/80 dark:bg-red-900/30 dark:text-red-200">
          {{ dailyError }}
        </div>

        <div v-if="dailyReport" class="mt-6 grid grid-cols-[160px_1fr] gap-6">
          <div class="flex flex-col items-center gap-2">
            <div class="text-4xl font-bold text-text-light dark:text-text-dark">{{ dailyReport.score }}</div>
            <div class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{{ dailyReport.grade }}</div>
            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              {{ dailyDateText }}
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {{ dailyReport.summary }}
            </p>
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-lg bg-primary/10 px-3 py-3 dark:bg-primary/20">
                <h4 class="text-sm font-bold text-text-light dark:text-text-dark">잘한 점</h4>
                <p
                    v-for="(item, index) in dailyReport.highlights"
                    :key="`daily-highlight-${index}`"
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {{ item }}
                </p>
              </div>
              <div class="rounded-lg bg-amber-50 px-3 py-3 dark:bg-amber-900/30">
                <h4 class="text-sm font-bold text-text-light dark:text-text-dark">개선 포인트</h4>
                <p
                    v-for="(item, index) in dailyReport.improvements"
                    :key="`daily-improve-${index}`"
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {{ item }}
                </p>
              </div>
              <div class="rounded-lg bg-sky-50 px-3 py-3 dark:bg-sky-900/30">
                <h4 class="text-sm font-bold text-text-light dark:text-text-dark">추천 행동</h4>
                <p
                    v-for="(item, index) in dailyReport.recommendations"
                    :key="`daily-recommend-${index}`"
                    class="text-xs text-text-secondary-light dark:text-text-secondary-dark"
                >
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!dailyLoading" class="mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          아직 일간 리포트가 없습니다.
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {format, parseISO} from 'date-fns';
import {getDailyReport, getWeeklyReport} from '@/services/reportService';

const today = format(new Date(), 'yyyy-MM-dd');
const dailyDate = ref(today);
const dailyReport = ref(null);
const dailyLoading = ref(false);
const dailyError = ref('');

const weeklyReport = ref(null);
const weeklyLoading = ref(false);
const weeklyError = ref('');

const dailyDateText = computed(() => {
  try {
    return format(parseISO(dailyDate.value), 'yyyy년 MM월 dd일');
  } catch (error) {
    return dailyDate.value;
  }
});

const weeklyPeriodText = computed(() => {
  if (!weeklyReport.value?.startDate || !weeklyReport.value?.endDate) {
    return '';
  }
  try {
    return `${format(parseISO(weeklyReport.value.startDate), 'MM.dd')} - ${format(parseISO(weeklyReport.value.endDate), 'MM.dd')}`;
  } catch (error) {
    return `${weeklyReport.value.startDate} - ${weeklyReport.value.endDate}`;
  }
});

const setDailyDate = (value) => {
  if (!value) return;
  dailyDate.value = value;
  fetchDailyReport();
};

const fetchDailyReport = async () => {
  dailyLoading.value = true;
  dailyError.value = '';
  try {
    const res = await getDailyReport(dailyDate.value);
    if (res?.status === 204) {
      dailyReport.value = null;
      return;
    }
    dailyReport.value = res?.data || null;
  } catch (error) {
    console.error('일간 리포트 조회 실패', error);
    dailyError.value = '일간 리포트를 불러오지 못했습니다.';
    dailyReport.value = null;
  } finally {
    dailyLoading.value = false;
  }
};

const fetchWeeklyReport = async () => {
  weeklyLoading.value = true;
  weeklyError.value = '';
  try {
    const res = await getWeeklyReport(today);
    if (res?.status === 204) {
      weeklyReport.value = null;
      return;
    }
    weeklyReport.value = res?.data || null;
  } catch (error) {
    console.error('주간 리포트 조회 실패', error);
    weeklyError.value = '주간 리포트를 불러오지 못했습니다.';
    weeklyReport.value = null;
  } finally {
    weeklyLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchDailyReport(), fetchWeeklyReport()]);
});
</script>
