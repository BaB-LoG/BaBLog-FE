import { defineStore } from 'pinia';
import goalService from '@/services/goal';

export const useGoalStore = defineStore('goal', {
    state: () => ({
        dailyGoals: [],
        weeklyGoals: [],
        calendarHistories: [],
        calendarSummary: [],
        monthlyStats: [],
        todaySummary: null,
        statsHighlights: null,
        isLoading: false,
        error: null,
    }),
    getters: {
        // 기존 getters
        completedDailyGoals: (state) => state.dailyGoals.filter(g => g.progressValue >= g.targetValue),
        activeDailyGoals: (state) => state.dailyGoals.filter(g => g.progressValue < g.targetValue),

        // 일일 목표 통계 (실시간)
        dailyStats: (state) => {
            const goals = state.dailyGoals;
            const completed = goals.filter(g => g.isCompleted).length;
            const inProgress = goals.length - completed;

            let achievementRate = 0;
            if (goals.length > 0) {
                const totalRate = goals.reduce((acc, g) => {
                    const rate = g.targetValue > 0 ? (g.progressValue / g.targetValue) : 0;
                    return acc + Math.min(rate, 1);
                }, 0);
                achievementRate = Math.round((totalRate / goals.length) * 100);
            }

            return { completed, inProgress, achievementRate };
        },

        // 주간 목표 통계 (실시간)
        weeklyStats: (state) => {
            const goals = state.weeklyGoals;
            const total = goals.length;
            const completed = goals.filter(g => g.isCompleted).length;
            const achievementRate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return { total, completed, achievementRate };
        },
    },
    actions: {
        async fetchGoals(goalType) {
            this.isLoading = true;
            try {
                const response = await goalService.getGoals(goalType);
                if (goalType === 'DAILY') {
                    this.dailyGoals = response.data;
                } else {
                    this.weeklyGoals = response.data;
                }
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch goals:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async createGoal(goalData) {
            this.isLoading = true;
            try {
                await goalService.createGoal(goalData);
                // 생성 후 목록 갱신 (goalData.goalType에 따라 갱신)
                await this.fetchGoals(goalData.goalType);
            } catch (error) {
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateGoal(goalId, goalData) {
            this.isLoading = true;
            try {
                await goalService.updateGoal(goalId, goalData);
                // 목록 갱신 is tricky because we don't know the type easily from here if not passed.
                // But usually the user will be redirected or we refresh the specific list if we know it.
                // For now, let's assume the component handles refresh or we just update local state if we had a single goal state.
            } catch (error) {
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchGoal(goalId) {
            this.isLoading = true;
            try {
                const response = await goalService.getGoal(goalId);
                return response.data;
            } catch (error) {
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async increaseProgress(goalId, goalType) {
            try {
                const response = await goalService.increaseProgress(goalId);
                this.updateGoalInList(response.data, goalType);
            } catch (error) {
                console.error('Failed to increase progress:', error);
                throw error;
            }
        },

        async decreaseProgress(goalId, goalType) {
            try {
                const response = await goalService.decreaseProgress(goalId);
                this.updateGoalInList(response.data, goalType);
            } catch (error) {
                console.error('Failed to decrease progress:', error);
                throw error;
            }
        },

        updateGoalInList(updatedGoal, goalType) {
            if (goalType === 'DAILY') {
                const index = this.dailyGoals.findIndex(g => g.id === updatedGoal.id);
                if (index !== -1) this.dailyGoals[index] = updatedGoal;
            } else if (goalType === 'WEEKLY') {
                const index = this.weeklyGoals.findIndex(g => g.id === updatedGoal.id);
                if (index !== -1) this.weeklyGoals[index] = updatedGoal;
            } else if (goalType === 'HISTORY') {
                const index = this.calendarHistories.findIndex(g => g.id === updatedGoal.id);
                if (index !== -1) this.calendarHistories[index] = updatedGoal;
            }
        },

        async updateHistoryProgress(historyId, delta, memberId, date) {
            try {
                // Also need to refresh history list.
                await goalService.updateHistoryProgress(historyId, delta);
                await this.fetchGoalHistories(memberId, date);
            } catch (error) {
                console.error('Update history failed:', error);
            }
        },

        async fetchGoalHistories(memberId, date) {
            // date format: YYYY-MM-DD
            try {
                const response = await goalService.getGoalHistories(memberId, date);
                this.calendarHistories = response.data;
            } catch (error) {
                console.error('Failed to fetch goal histories:', error);
            }
        },

        async fetchCalendarSummary(memberId, startDate, endDate) {
            try {
                const response = await goalService.getCalendarSummary(memberId, startDate, endDate);
                this.calendarSummary = response.data;
            } catch (error) {
                console.error('Failed to fetch calendar summary:', error);
            }
        },

        async fetchMonthlyStats(memberId, year, month) {
            try {
                const response = await goalService.getMonthlyStats(memberId, year, month);
                this.monthlyStats = response.data;
            } catch (error) {
                console.error('Failed to fetch monthly stats:', error);
            }
        },

        async deleteGoal(goalId) {
            this.isLoading = true;
            try {
                await goalService.deleteGoal(goalId);
                // Remove from local lists
                this.dailyGoals = this.dailyGoals.filter(g => g.id !== goalId);
                this.weeklyGoals = this.weeklyGoals.filter(g => g.id !== goalId);
                this.calendarHistories = this.calendarHistories.filter(g => g.id !== goalId);
            } catch (error) {
                this.error = error;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTodaySummary(memberId) {
            try {
                const response = await goalService.getTodaySummary(memberId);
                this.todaySummary = response.data;
            } catch (error) {
                console.error('Failed to fetch today summary:', error);
            }
        },

        async fetchStatsHighlights(memberId, year, month) {
            try {
                const response = await goalService.getStatsHighlights(memberId, year, month);
                this.statsHighlights = response.data;
            } catch (error) {
                console.error('Failed to fetch stats highlights:', error);
            }
        },
    },
});
