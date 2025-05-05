import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import ChannelsView from '@/pages/channels/ChannelsView.vue'
import VideosView from '@/pages/videos/VideosView.vue'
import CommentsView from '@/pages/comments/CommentsView.vue'
import BankComments from '@/pages/banck-comment/BankComments.vue'
import ReportsView from '@/pages/reports/ReportsView.vue';
import AnalyticsView from '@/pages/analytic/AnalyticsView.vue';
import NotFoundView from '@/pages/NotFoundView.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/channels', name: 'ChannelsView', component: ChannelsView },
  { path: '/videos', name: 'VideosView', component: VideosView },
  { path: '/comments', name: 'CommentsView', component: CommentsView },
  { path: '/bank-comments', name: 'BankComments', component: BankComments },
  ,
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
