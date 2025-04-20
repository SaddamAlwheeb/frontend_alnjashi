<template>
  <v-container fluid class="pa-8" style="background: #f5f5f5; min-height: 100vh;">
    <v-row align="stretch" class="text-center" style="direction: rtl;">
      <!-- إدخال النص -->
      <v-col cols="8" md="4">
        <v-card class="pa-6" elevation="6" style="background: #ffffff;">
          <v-card-title class="text-h6 mb-4">أدخل النص</v-card-title>
          <v-text-field
            v-model="inputText"
            label="أدخل نصًا هنا"
            outlined
            color="primary"
            dir="rtl"
            hide-details
          />
        </v-card>
      </v-col>

      <!-- الأزرار -->
      <v-col cols="4" md="4">
        <v-card class="pa-6 d-flex flex-column justify-center align-center gap-4" elevation="6" style="background: #ffffff;">
          <v-card-title class="text-h6 mb-4">التحكم</v-card-title>
          <v-btn @click="handleClick" color="primary" block size="large">
            طباعة النص
          </v-btn>
          <v-btn @click="reset" color="error" block size="large">
            إعادة التعيين
          </v-btn>
        </v-card>
      </v-col>

      <!-- عرض النص -->
      <v-col cols="12" md="4">
        <v-card class="pa-6" elevation="6" style="background: #ffffff;">
          <v-card-title class="text-h6 mb-4">النص المطبوع</v-card-title>
          <v-alert
            v-if="printedText"
            type="info"
            color="primary"
            border="start"
            elevation="2"
            class="text-right"
            style="direction: rtl;"
          >
            {{ printedText }}
          </v-alert>
          <v-alert
            v-else
            type="warning"
            color="warning"
            border="start"
            elevation="2"
            class="text-right"
            style="direction: rtl;"
          >
            لا يوجد نص مطبوع بعد.
          </v-alert>
          <auto-list 
            v-model="selectedDate"
            name="Years"
            hide-details
            :rules="[selectedDate ? true : 'يجب تحديد التاريخ']"
            @update:modelValue="handleChangeYear"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      inputText: "",
      printedText: ""
    }
  },
  methods: {
    handleClick() {
      this.printedText = this.inputText
    },
    reset() {
      this.inputText = ""
      this.printedText = ""
    }
  }
}
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  color: #333;
}
</style>
