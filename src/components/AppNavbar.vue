<!-- src/components/AppNavbar.vue -->
<template>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="$emit('toggle-sidebar')" />
      <v-toolbar-title>تطبيقي</v-toolbar-title>
    </v-app-bar>
  </template>
  