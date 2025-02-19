import { createRouter, createWebHistory } from 'vue-router';
import SignUp from "../views/SignUp.vue";
import SignUpSuccess from '../views/SignUpSuccess.vue';
import WritingCommunityBoard from '../views/WritingCommunityBoard.vue';
import PostContent from '../views/PostContent.vue';

import Dashboard from "../components/Dashboard.vue";
import Backtesting from "../components/Backtesting.vue";
import CoinNews from "../components/CoinNews.vue";
import CommunityBoard from "../components/CommunityBoard.vue";


const routes = [
  { path: '/', component: Dashboard },
  { path: "/dashboard", component: Dashboard },
  { path: "/backtesting", component: Backtesting },
  { path: "/news", component: CoinNews },
  { path: "/community", component: CommunityBoard },
  { path: "/signup", component: SignUp },
  { path: "/signupsuccess", component: SignUpSuccess },
  { path: "/writepage", component: WritingCommunityBoard },
  { path: "/post/:id", component: PostContent, props: true },
  { path: '/:catchAll(.*)', redirect: '/' }, // 잘못된 경로는 홈으로 리다이렉트

  

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;