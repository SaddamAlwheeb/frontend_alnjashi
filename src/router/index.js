import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import ChannelsView from '@/pages/channels/ChannelsView.vue'
import VideosView from '@/pages/videos/VideosView.vue'
import CommentsView from '@/pages/comments/CommentsView.vue'
import BankComments from '@/pages/banck-comment/BankComments.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/channels', name: 'ChannelsView', component: ChannelsView },
  { path: '/videos', name: 'VideosView', component: VideosView },
  { path: '/comments', name: 'CommentsView', component: CommentsView },
  { path: '/bank-comments', name: 'BankComments', component: BankComments },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
