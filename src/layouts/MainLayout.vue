<!-- src/layouts/MainLayout.vue -->
<template>
  <v-app class="d-flex flex-column fill-height">
    <AppSidebar v-model="drawer" />
    <AppNavbar @toggle-sidebar="drawer = !drawer" />
    <v-main class="flex-grow-1 overflow-y-auto">
      <router-view></router-view>
    </v-main>
    <!-- <app-footer /> -->
  </v-app>
</template>
  
<script>
import AppNavbar from '@/components/AppNavbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';
// import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppSidebar,
    // AppFooter
  },
  data() {
    return {
      drawer: true
    };
  }
};
</script>
  
<style>
html, body, #app, .v-application {
  height: 100%;
  margin: 0;
}
.v-application {
  font-family: 'Tajawal', sans-serif;
}
</style>
  