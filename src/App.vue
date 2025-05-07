<script setup>
// import FetchComment from './components/FetchComment.vue'
// import ChannelsView from './pages/channels/ChannelsView.vue'
import MainLayout from './layouts/MainLayout.vue'
import { VContainer, VRow, VCol } from 'vuetify/components'
// import Home from './pages/Home.vue'

</script>

<template>
  <!-- <v-container class="d-flex justify-center align-center" style="height: 100vh;"> -->
    <!-- عرض مكون HelloWorld مع Props -->
    <!-- <FetchComment msg="Vite + Vue" ing="saddam" /> -->
    <MainLayout/>
    <!-- <ChannelsView msg="Vite + Vue" ing="saddam" /> -->
  <!-- </v-container> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
