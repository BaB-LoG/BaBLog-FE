import { defineStore } from 'pinia';
import goalService from '@/services/goal';

export const useGoalStore = defineStore('goal', {
    state: () => ({
        dailyGoals: [],
        weeklyGoals: [],
        calendarHistories: [],
        isLoading: false,
        error: null,
    }),
    getters: {
        // 목표 달성률 계산 로직 등이 필요하면 추가
        completedDailyGoals: (state) => state.dailyGoals.filter(g => g.progressValue >= g.targetValue),
        activeDailyGoals: (state) => state.dailyGoals.filter(g => g.progressValue < g.targetValue),
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
    },
});
