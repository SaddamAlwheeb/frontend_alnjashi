<!-- src/layouts/MainLayout.vue -->
<template>
    <v-app dir="rtl">
      <AppSidebar v-model="drawer" />
      <AppNavbar @toggle-sidebar="drawer = !drawer" />
  
      <v-main>
        <v-container fluid>
            <router-view /> <!-- هذا هو المكان الذي تظهر فيه الصفحات -->
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import AppNavbar from '@/components/AppNavbar.vue'
  import AppSidebar from '@/components/AppSidebar.vue'
  
  const drawer = ref(true)
  </script>
  
  <style>
  .v-application {
    direction: rtl;
    text-align: right;
  }
  </style>
  