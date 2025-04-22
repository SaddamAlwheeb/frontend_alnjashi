<template>
  <v-container class="py-8">
    <v-card elevation="2" class="pa-4">
      <v-card-title class="text-h5 text-center">التعليقات الإيجابية</v-card-title>

      <v-data-table
        :headers="headers"
        :items="comments"
        item-value="id"
        class="elevation-1"
        :loading="loading"
        :items-per-page="10"
      >
        <template #item.comment_text="{ item }">
          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-right">{{ item.comment_text }}</div>
              <div>
                <v-btn icon @click="copyToClipboard(item.comment_text)">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
                <v-btn icon @click="translateComment(item)">
                  <v-icon>mdi-translate</v-icon>
                </v-btn>
              </div>
            </div>
            <div v-if="item.translatedText" class="text-right text-grey">
              <v-icon size="16" color="primary" class="mr-1">mdi-translate</v-icon>
              {{ item.translatedText }}
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { BASE_URL } from '@/config';

export default {
  name: 'PositiveComments',
  data() {
    return {
      comments: [],
      loading: false,
      headers: [
        { title: 'نص التعليق', key: 'comment_text', sortable: false },
      ],
    };
  },
  methods: {
    async fetchPositiveComments() {
      this.loading = true;
      try {
        const res = await fetch(`${BASE_URL}api/comments/?is_comment_bank=true`);
        const data = await res.json();
        this.comments = data.results?.map(comment => ({
          ...comment,
          translatedText: '', // لإظهار الترجمة لاحقًا
        })) || [];
      } catch (err) {
        console.error('فشل تحميل التعليقات:', err);
      } finally {
        this.loading = false;
      }
    },

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        alert('تم نسخ التعليق!');
      } catch (err) {
        console.error('فشل في النسخ:', err);
      }
    },

    async translateComment(item) {
      try {
        const res = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: item.comment_text,
            source: 'auto',
            target: 'ar',
            format: 'text',
          }),
        });

        const data = await res.json();
        item.translatedText = data?.translatedText || 'فشل الترجمة';
      } catch (err) {
        console.error('فشل في الترجمة:', err);
        item.translatedText = 'حدث خطأ أثناء الترجمة';
      }
    },
  },
  created() {
    this.fetchPositiveComments();
  },
};
</script>

<style scoped>
.v-data-table {
  direction: rtl;
  text-align: right;
}
</style>
