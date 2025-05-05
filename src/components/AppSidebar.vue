<template>
  <v-navigation-drawer
    v-model="drawer"
    :temporary="$vuetify.display.xs || $vuetify.display.sm"
    :permanent="$vuetify.display.mdAndUp"
    :rail="rail"
    width="250"
    ref="drawer"
    location="right"
    elevation="2"
  >
    <v-card class="w-100 logo-box d-flex text-center border-bottom" style="overflow: hidden" rounded="0">
      <div style="flex: 4;" class="align-self-center">
        <div v-show="!rail || $vuetify.display.xs || $vuetify.display.sm" class="text-primary text-h6">
          رسالة إلى النجاشي
        </div>
      </div>
      <div style="flex: 1;">
        <v-btn
          @click="toggleRail"
          density="compact"
          variant="text"
          :icon="rail ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"
          class="mt-1"
        />
      </div>
    </v-card>

    <v-list density="compact" nav>
      <v-divider class="my-2" />
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :active="isActive(item.path)"
        :title="item.title"
        :prepend-icon="item.icon"
        link
        @click="navigate(item.path)"
        :class="{'list-item-active': isActive(item.path)}"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
  },

  emits: ['update:modelValue'],

  data() {
    return {
      drawer: this.modelValue,
      rail: false,
      menuItems: [
        { title: 'الرئيسية', icon: 'mdi-view-dashboard', path: '/' },
        { title: 'القنوات', icon: 'mdi-television-classic', path: '/channels' },
        { title: 'الفيديوهات', icon: 'mdi-video', path: '/videos' },
        { title: 'التعليقات', icon: 'mdi-comment-multiple-outline', path: '/comments' },
        { title: 'بنك التعليقات', icon: 'mdi-comment-multiple', path: '/bank-comments' },
        { title: 'التقارير', icon: 'mdi-chart-bar', path: '/reports' },
        { title: 'التحليلات', icon: 'mdi-chart-line', path: '/analytics' },
      ],
    }
  },

  watch: {
    modelValue(val) {
      this.drawer = val
    },
    drawer(val) {
      this.$emit('update:modelValue', val)
    },
  },

  methods: {
    navigate(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
      
      if (this.$vuetify.display.xs || this.$vuetify.display.sm) {
        this.drawer = false;
      }
    },
    isActive(path) {
      return this.$route.path === path
    },
    toggleRail() {
      this.rail = !this.rail
    },
  },
}
</script>

<style scoped>
.v-navigation-drawer {
  direction: rtl;
}

.list-item-active {
  background-color: #E3F2FD !important;
  color: #1976D2 !important;
  font-weight: bold;
  border-right: 4px solid #1976D2;
}

.v-list-item {
  text-align: right;
  transition: all 0.3s ease;
}

.v-list-item__prepend {
  margin-left: 8px;
  margin-right: 0;
}

.logo-box {
  height: 64px;
  transition: all 0.3s ease;
}
</style>