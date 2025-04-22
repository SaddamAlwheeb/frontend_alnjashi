<template>
  <v-navigation-drawer
    v-model="drawer"
    :temporary="breadPointXS || breadPointSM"
    :permanent="breadPointMD"
    :rail="expand"
    width="250"
    ref="drawer"
    location="right"
  >
    <v-card class="w-100 logo-box d-flex text-center border-bottom" style="overflow: hidden" rounded="0">
      <div style="flex: 4;" class="align-self-center">
        <div v-show="!expand || breadPointXS || breadPointSM" class="text-primary text-h6">
          رسالة إلى النجاشي
        </div>
      </div>
      <div style="flex: 1;">
        <v-btn
          @click="toggleExpand"
          density="compact"
          variant="text"
          :icon="expand ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"
          class="mt-1"
        />
      </div>
    </v-card>

    <v-list dense nav>
      <v-divider class="my-2" />
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :active="isActive(item.path)"
        :title="item.title"
        :prepend-icon="item.icon"
        link
        @click="navigate(item.path)"
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
      expand: true,
      menuItems: [
        { title: 'الرئيسية', icon: 'mdi-view-dashboard', path: '/' },
        { title: 'القنوات', icon: 'mdi-television-classic', path: '/channels' },
        { title: 'الفيديوهات', icon: 'mdi-video', path: '/videos' },
        { title: 'التعليقات', icon: 'mdi-comment-multiple-outline', path: '/comments' },
        { title: 'بنك التعليقات', icon: 'mdi-comment-multiple', path: '/bank-comments' },
      ],
    }
  },

  computed: {
    route() {
      return this.$route
    },
    breadPointXS() {
      return this.$vuetify.display.xs
    },
    breadPointSM() {
      return this.$vuetify.display.sm
    },
    breadPointMD() {
      return this.$vuetify.display.md
    },
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
      if (this.route.path !== path) {
        this.$router.push(path)
      }
    },
    isActive(path) {
      return this.route.path === path
    },
    toggleExpand() {
      this.expand = !this.expand
    },
  },
}
</script>

<style scoped>
.v-navigation-drawer {
  direction: rtl;
}

.v-list-item--active {
  background-color: #E3F2FD !important;
  color: #1976D2 !important;
  font-weight: bold;
}

.v-list-item {
  text-align: right;
}

.v-list-item__prepend {
  margin-left: 8px;
  margin-right: 0;
}
</style>