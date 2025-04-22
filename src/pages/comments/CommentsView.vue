<template>
  <v-container class="py-8">
    <v-card elevation="2" class="pa-4">

      <v-card-title class="text-h5 text-center">إدارة التعليقات</v-card-title>

      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-select v-model="sentimentFilter" :items="[{ text: 'الكل', value: '' }, ...sentiments]" item-title="text"
            item-value="value" label="فلترة حسب المشاعر" dense clearable />
        </v-col>
      </v-row>

      <v-data-table :headers="headers" :items="filteredComments" item-value="id" v-model="selected" show-select
        return-object class="elevation-1" :items-per-page="10" :loading="loading">
        <template #item.comment_text="{ item }">
          <div class="text-right">{{ item.comment_text }}</div>
        </template>

        <template #item.sentiment="{ item }">
          <v-select v-model="item.sentiment" :items="sentiments" item-title="text" item-value="value" dense hide-details
            style="min-width: 100px" @change="updateSentiment(item)" />
        </template>

        <template #item.is_comment_bank="{ item }">
          <v-switch
            v-model="item.is_comment_bank"
            inset
            hide-details
            color="green"
            @change="updateCommentBank(item)"
          />
        </template>
      </v-data-table>

      <v-card-actions class="justify-end">
        <v-btn color="primary" :disabled="!selected.length" @click="bulkUpdateSentiment">
          تحديث الحالة للتعليقات المحددة
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
<script>
import { BASE_URL } from '@/config';

export default {
  name: 'CommentManager',
  data() {
    return {
      comments: [],
      selected: [],
      loading: false,
      sentimentFilter: '',
      sentiments: [
        { text: 'إيجابي', value: 1 },
        { text: 'سلبي', value: 2 },
        { text: 'محايد', value: 3 },
      ],

      headers: [
        { title: 'نص التعليق', key: 'comment_text', sortable: false },
        { title: 'حالة التعليق', key: 'sentiment', sortable: false },
        { title: 'بنك التعليقات', key: 'is_comment_bank', sortable: false }, 
      ],
    };
  },
  created() {
    this.fetchComments();
  },
  computed: {
    filteredComments() {
      if (!this.sentimentFilter) return this.comments;
      return this.comments.filter(c => c.sentiment === this.sentimentFilter);
    },
  },
  methods: {
    async fetchComments() {
      this.loading = true;
      try {
        const res = await fetch(`${BASE_URL}api/comments/`);
        const data = await res.json();
        this.comments = data.results || [];
      } catch (err) {
        console.error('فشل تحميل التعليقات:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateSentiment(comment) {
      try {
        await fetch(`${BASE_URL}api/comments/${comment.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentiment: comment.sentiment }),
        });
      } catch (err) {
        console.error('خطأ في تحديث التعليق:', err);
      }
    },

    async updateCommentBank(comment) {
      try {
        await fetch(`${BASE_URL}api/comments/${comment.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_comment_bank: comment.is_comment_bank }),
        });
      } catch (err) {
        console.error('خطأ في تحديث بنك التعليقات:', err);
      }
    },
    async bulkUpdateSentiment() {
      try {
        for (const comment of this.selected) {
          await this.updateSentiment(comment);
        }
        this.$emit('updated');
        alert('تم تحديث الحالات بنجاح');
      } catch (err) {
        console.error('خطأ في التحديث الجماعي:', err);
      }
    },
  },

};
</script>
  
<style scoped>
.v-data-table {
  direction: rtl;
  text-align: right;
}
</style>
  