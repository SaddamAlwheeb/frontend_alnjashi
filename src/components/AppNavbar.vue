<template>
  <v-app-bar app :color="dark ? 'surface' : 'primary'" :dark="!dark" :class="{'app-bar-dark': dark}" elevation="3" class="app-navbar">
    <v-app-bar-nav-icon @click="$emit('toggle-sidebar')" class="ml-2 nav-icon" />
    <div class="d-flex align-center">
      <v-img src="/logo.png" width="36" height="36" class="ml-2" v-if="false"></v-img>
      <v-toolbar-title class="text-truncate app-title">رسالة إلى النجاشي</v-toolbar-title>
    </div>
    <v-spacer />
    <v-btn icon variant="text" class="mx-1 btn-animated" @click="$emit('toggle-theme')">
      <v-icon>{{ dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      <v-tooltip activator="parent" location="bottom">{{ dark ? 'الوضع النهاري' : 'الوضع الليلي' }}</v-tooltip>
    </v-btn>
    <v-btn icon variant="text" class="mx-1 btn-animated">
      <v-icon>mdi-bell</v-icon>
      <v-badge color="error" content="3" location="top end" offset-x="3" offset-y="3" />
      <v-tooltip activator="parent" location="bottom">الإشعارات</v-tooltip>
    </v-btn>
    <v-btn icon variant="text" class="mx-1 btn-animated">
      <v-icon>mdi-cog</v-icon>
      <v-tooltip activator="parent" location="bottom">الإعدادات</v-tooltip>
    </v-btn>
    <v-menu transition="slide-y-transition" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn class="ml-2 user-profile-btn" rounded="pill" variant="outlined" v-bind="props">
          <v-avatar size="32" class="mr-2">
            <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
          </v-avatar>
          <span class="d-none d-sm-flex">صدام الوهيبي</span>
          <v-icon class="ms-2">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-card min-width="300" class="elevation-5 pa-2">
        <v-list>
          <v-list-item class="mb-3">
            <template v-slot:prepend>
              <v-avatar size="48">
                <v-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" />
              </v-avatar>
            </template>
            <v-list-item-title class="text-h6 font-weight-bold">صدام الوهيبي</v-list-item-title>
            <v-list-item-subtitle>مدير الموقع</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="mb-2"></v-divider>
          <v-list-item rounded="md" class="mb-1" link>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-account</v-icon>
            </template>
            <v-list-item-title>الملف الشخصي</v-list-item-title>
          </v-list-item>
          <v-list-item rounded="md" class="mb-1" link>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-cog</v-icon>
            </template>
            <v-list-item-title>الإعدادات</v-list-item-title>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item rounded="md" link>
            <template v-slot:prepend>
              <v-icon color="error">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="text-error">تسجيل الخروج</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavbar',
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar', 'toggle-theme'],
  data() {
    return {
      notifications: [
        { id: 1, title: 'تم إضافة تعليق جديد', text: 'تمت إضافة تعليق جديد على الفيديو الخاص بك', time: '5 دقائق', read: false },
        { id: 2, title: 'تحديث النظام', text: 'تم تحديث النظام إلى الإصدار الجديد', time: '3 ساعات', read: false },
        { id: 3, title: 'معلومات جديدة', text: 'هناك معلومات جديدة متاحة حول حسابك', time: 'أمس', read: true }
      ]
    };
  }
};
</script>

<style scoped>
.v-app-bar {
  direction: rtl;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.app-bar-dark {
  background-color: #1E1E1E !important;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: #fff;
}

.v-app-bar-nav-icon {
  margin-left: 8px;
  margin-right: 0;
  transition: transform 0.2s ease;
}

.v-app-bar-nav-icon:hover {
  transform: scale(1.1);
}

.app-title {
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.app-title:hover {
  transform: translateY(-1px);
}

.btn-animated {
  transition: all 0.2s ease;
}

.btn-animated:hover {
  transform: translateY(-2px);
}

.user-profile-btn {
  transition: all 0.2s ease;
  border-width: 1px !important;
}

.user-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 600px) {
  .app-title {
    max-width: 150px;
    font-size: 1.1rem;
  }
}
</style>