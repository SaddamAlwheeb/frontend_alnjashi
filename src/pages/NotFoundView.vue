<template>
  <v-container class="d-flex flex-column align-center justify-center" style="min-height: 80vh">
    <v-card max-width="500" class="text-center pa-6" rounded="lg" elevation="3">
      <v-card-title class="text-h4 mt-4">404</v-card-title>
      <v-card-subtitle class="text-h6 mb-4">الصفحة غير موجودة</v-card-subtitle>
      
      <v-img
        src="https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        height="250"
        cover
        class="mb-6 rounded-lg"
      ></v-img>
      
      <v-card-text class="text-body-1 mb-6">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
      </v-card-text>
      
      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          prepend-icon="mdi-home"
          size="large"
          to="/"
        >
          العودة إلى الصفحة الرئيسية
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'NotFoundView'
};
</script>