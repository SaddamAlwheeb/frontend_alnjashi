<!-- src/components/AppNavbar.vue -->
<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="$emit('toggle-sidebar')" class="ml-2" />
    <v-toolbar-title class="text-truncate">رسالة إلى النجاشي</v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>

<style scoped>
.v-app-bar {
  direction: rtl;
}

.v-app-bar-nav-icon {
  margin-left: 8px;
  margin-right: 0;
}

.v-toolbar-title {
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
  