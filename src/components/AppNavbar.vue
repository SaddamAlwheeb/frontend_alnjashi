<template>
  <v-app-bar app color="primary" dark elevation="2">
    <v-app-bar-nav-icon @click="$emit('toggle-sidebar')" class="ml-2" />
    <v-toolbar-title class="text-truncate">رسالة إلى النجاشي</v-toolbar-title>
    <v-spacer />
    <v-btn icon variant="text" @click="toggleDarkMode">
      <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
    <v-btn icon variant="text">
      <v-icon>mdi-bell</v-icon>
      <v-badge color="error" content="3" floating dot />
    </v-btn>
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="36">
            <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list width="200" class="text-right">
        <v-list-item>
          <v-list-item-title>الملف الشخصي</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>الإعدادات</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>تسجيل الخروج</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavbar',
  emits: ['toggle-sidebar'],
  data() {
    return {
      isDarkMode: false
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.$vuetify.theme.global.name = this.isDarkMode ? 'dark' : 'light';
    }
  }
};
</script>

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