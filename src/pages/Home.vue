<template>
  <v-container class="py-10">
    <!-- العنوان الرئيسي -->
    <v-row justify="center">
      <v-col cols="12" md="10" class="text-center">
        <h1 class="text-h4 font-weight-bold text-primary mb-4">
          ✊ منصة النجاشي لدعم القنوات الغربية المؤيدة لفلسطين
        </h1>
        <p class="text-body-1">
          في ظل التعتيم الإعلامي والتحيز الواضح، برزت أصوات حرة من الغرب تفضح الجرائم، وتدافع عن الحق الفلسطيني.
          هدفنا هو توثيق هذه الأصوات، دعمها، وتوسيع انتشارها.
        </p>
      </v-col>
    </v-row>

    <!-- مميزات المنصة -->
    <v-row class="mt-10" justify="center">
      <v-col cols="12" md="6" v-for="(feature, i) in features" :key="i">
        <v-card class="pa-4" outlined>
          <v-icon color="green" size="36" class="mb-2">mdi-check-circle</v-icon>
          <h3 class="text-h6 font-weight-bold">{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- كيف تساهم -->
    <v-row class="mt-10" justify="center">
      <v-col cols="12" md="10" class="text-center">
        <h2 class="text-h5 font-weight-bold mb-4">📣 كيف يمكنك المشاركة؟</h2>
        <v-list two-line>
          <v-list-item v-for="(action, i) in actions" :key="i">
            <v-list-item-icon><v-icon>mdi-arrow-right-bold-circle</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ action }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const features = [
  { title: 'تسهيل الوصول', desc: 'دليل محدث لأهم الحسابات الغربية الداعمة (يوتيوب، تويتر، تيك توك...)' },
  { title: 'رفع التأثير', desc: 'نشجع على الدعم الجماعي لضمان وصول هذه الأصوات لأكبر عدد ممكن' },
  { title: 'حماية السردية', desc: 'توثيق الشهادات والمواقف لدحض الروايات المضللة مستقبلًا' },
  { title: 'قاعدة بيانات ذكية', desc: 'أرشفة وتحليل التعليقات لبناء نموذج ذكاء صناعي يساهم في التصنيف' },
]

const actions = [
  'تابع الحسابات الغربية الداعمة.',
  'شارك منشوراتهم ودافع عنهم.',
  'انضم إلى فريق التوثيق والدعم.',
  'ساهم بالتعليق، الترجمة، أو أرشفة النقاط المهمة.',
]
</script>

<style scoped>
h1,
h2,
h3 {
  direction: rtl;
}

p,
li {
  direction: rtl;
  text-align: right;
}</style>
