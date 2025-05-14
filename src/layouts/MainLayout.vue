<!-- src/layouts/MainLayout.vue -->
<template>
  <v-app class="d-flex flex-column fill-height app-background">
    <AppSidebar v-model="drawer" :dark="isDarkTheme" />
    <AppNavbar @toggle-sidebar="drawer = !drawer" @toggle-theme="toggleTheme" :dark="isDarkTheme" />
    <v-main class="flex-grow-1 overflow-y-auto pt-10">
      <v-container fluid class="px-4 py-2">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>
    <!-- <app-footer /> -->
  </v-app>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppFooter from '@/components/AppFooter.vue';
import { lightTheme, darkTheme } from '@/config/theme';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppSidebar,
    AppFooter
  },
  data() {
    return {
      drawer: true,
      isDarkTheme: false,
      themeConfig: {
        light: lightTheme,
        dark: darkTheme
      }
    };
  },
  created() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
    }
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      this.applyTheme();
      
      // Save theme preference
      localStorage.setItem('theme-preference', this.isDarkTheme ? 'dark' : 'light');
    },
    applyTheme() {
      const theme = this.isDarkTheme ? 'dark' : 'light';
      this.$vuetify.theme.global.name = theme;
    }
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

.app-background {
  background-color: var(--background);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-main {
  background-color: var(--background);
}

.theme--dark .app-background,
.theme--dark .v-main {
  background-color: #121212;
}

.theme--dark .v-card {
  background-color: #1E1E1E;
  color: #fff;
}

/* Custom card styles */
.custom-card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}
</style>