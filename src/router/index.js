import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import DashboardPage from '@/views/DashboardPage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/dashboard', component: DashboardPage }
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
