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
            <div class="d-flex justify-space-between align-center">
              <div class="text-right">{{ item.comment_text }}</div>
              <v-btn icon @click="copyToClipboard(item.comment_text)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
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
          const res = await fetch('http://localhost:5454/api/comments/?sentiment=1');
          const data = await res.json();
          this.comments = data.results || [];
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
  