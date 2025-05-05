<template>
  <v-footer app fixed color="primary" dark class="py-2">
    <v-container>
      <div class="d-flex flex-column flex-md-row justify-space-between align-center">
        <div class="text-center text-md-right mb-2 mb-md-0">
          رسالة إلى النجاشي © {{ new Date().getFullYear() }}
        </div>
        <div class="d-flex justify-center">
          <v-btn icon variant="text" class="mx-1" v-for="icon in socialIcons" :key="icon.name">
            <v-icon>{{ icon.icon }}</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      socialIcons: [
        { name: 'facebook', icon: 'mdi-facebook' },
        { name: 'twitter', icon: 'mdi-twitter' },
        { name: 'youtube', icon: 'mdi-youtube' },
        { name: 'instagram', icon: 'mdi-instagram' }
      ]
    };
  }
};
</script>

<style scoped>
.v-footer {
  direction: rtl;
}
</style>