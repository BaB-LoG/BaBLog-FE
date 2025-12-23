<template>
  <div class="space-y-4">
    <div v-if="goals.length === 0" class="py-10 text-center text-gray-400">
      <p v-if="type === 'DAILY'">오늘 등록된 목표가 없습니다.</p>
      <p v-else-if="type === 'WEEKLY'">이번 주 등록된 목표가 없습니다.</p>
      <p v-else>기록이 없습니다.</p>
    </div>
    <div v-else>
      <transition-group 
        name="list" 
        tag="div" 
        class="space-y-4"
      >
        <GoalItem 
          v-for="goal in goals" 
          :key="goal.id" 
          :goal="goal" 
          :context-goal-type="type === 'HISTORY' ? 'HISTORY' : type"
          :readonly="readonly"
          @titleClick="$emit('goalClick', $event)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import GoalItem from './GoalItem.vue';

const props = defineProps({
  goals: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'DAILY'
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

defineEmits(['goalClick']);
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
