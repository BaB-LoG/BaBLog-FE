import axios from '@/services/apiClient'; // Assuming a configured axios instance exists

const GOAL_API_PREFIX = '/goals';
const GOAL_HISTORY_API_PREFIX = '/goal-histories';

export default {
  // 목표 등록
  createGoal(data) {
    return axios.post(GOAL_API_PREFIX, data);
  },

  // 목표 목록 조회 (일일/주간)
  // golType: 'DAILY' | 'WEEKLY'
  getGoals(goalType) {
    return axios.get(GOAL_API_PREFIX, {
      params: { goalType },
    });
  },

  // 목표 상세 조회
  getGoal(goalId) {
    return axios.get(`${GOAL_API_PREFIX}/${goalId}`);
  },

  // 목표 진행도 증가 (현재 목표)
  increaseProgress(goalId) {
    return axios.patch(`${GOAL_API_PREFIX}/${goalId}/progress`);
  },

  decreaseProgress(goalId) {
    return axios.patch(`${GOAL_API_PREFIX}/${goalId}/progress/decrease`);
  },

  // 날짜별 목표 기록 조회 (달력용)
  getGoalHistories(memberId, date) {
    return axios.get(GOAL_HISTORY_API_PREFIX, {
      params: { memberId, date },
    });
  },

  // 목표 수정
  updateGoal(goalId, data) {
    return axios.patch(`${GOAL_API_PREFIX}/${goalId}`, data);
  },

  // 과거 기록 수정
  updateHistoryProgress(historyId, delta) {
    return axios.patch(`${GOAL_HISTORY_API_PREFIX}/${historyId}`, { delta });
  },

  // 목표 삭제
  deleteGoal(goalId) {
    return axios.delete(`${GOAL_API_PREFIX}/${goalId}`);
  },

  // 달력 요약 정보 조회
  getCalendarSummary(memberId, startDate, endDate) {
    return axios.get(`${GOAL_HISTORY_API_PREFIX}/calendar`, {
      params: { memberId, startDate, endDate },
    });
  },

  // 월간 통계 조회
  getMonthlyStats(memberId, year, month) {
    return axios.get(`${GOAL_HISTORY_API_PREFIX}/stats`, {
      params: { memberId, year, month },
    });
  },
};
