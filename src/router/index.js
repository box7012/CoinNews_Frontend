import { createRouter, createWebHistory } from 'vue-router';
import SignUp from "../views/SignUp.vue";
import Home from '../components/MainDisplay.vue';
import SignUpSuccess from '../views/SignUpSuccess.vue';
import WritingCommunityBoard from '../views/WritingCommunityBoard.vue';

const routes = [
  { path: '/', component: Home },
  { path: "/signup", component: SignUp },
  { path: "/signupsuccess", component: SignUpSuccess },
  { path: "/writepage", component: WritingCommunityBoard },
  { path: '/:catchAll(.*)', redirect: '/' }, // 잘못된 경로는 홈으로 리다이렉트
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;