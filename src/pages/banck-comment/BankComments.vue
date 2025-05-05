<template>
  <v-container class="py-6">
    <h1 class="text-h4 text-right mb-6">بنك التعليقات</h1>
    
    <!-- Filters -->
    <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
      <div class="d-flex flex-wrap align-center justify-space-between">
        <div class="d-flex flex-grow-1">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="البحث في التعليقات"
            density="compact"
            hide-details
            class="ml-4"
            style="max-width: 300px;"
          ></v-text-field>
          
          <v-select
            v-model="categoryFilter"
            :items="categoryOptions"
            item-title="text"
            item-value="value"
            label="التصنيف"
            density="compact"
            hide-details
            class="ml-4"
            style="width: 150px"
          ></v-select>
        </div>
      </div>
    </v-card>
    
    <!-- Comments Cards -->
    <v-row>
      <v-col v-for="(comment, index) in filteredBankComments" :key="index" cols="12" sm="6" md="4">
        <v-card elevation="2" rounded="lg" class="comment-card h-100">
          <v-card-text class="text-right">
            <div class="d-flex justify-space-between align-center mb-2">
              <v-chip :color="getCategoryColor(comment.category)" size="small">
                {{ getCategoryText(comment.category) }}
              </v-chip>
              <div>
                <v-btn icon variant="text" density="comfortable" @click="copyToClipboard(comment.comment_text)">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </div>
            </div>
            
            <div class="comment-text mt-4">{{ comment.comment_text }}</div>
            
            <div v-if="comment.translated_text" class="mt-4 text-caption text-grey-darken-1">
              <v-icon size="16" color="primary" class="ml-1">mdi-translate</v-icon>
              {{ comment.translated_text }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Empty State -->
    <v-card v-if="filteredBankComments.length === 0" elevation="2" class="py-8 text-center" rounded="lg">
      <v-icon size="64" color="grey-lighten-1">mdi-comment-off-outline</v-icon>
      <div class="text-h6 mt-4">لا توجد تعليقات</div>
      <div class="text-body-1 text-grey">لم يتم العثور على أي تعليقات تطابق معايير البحث</div>
    </v-card>
  </v-container>
</template>

<script>
import { BASE_URL } from '@/config';

export default {
  name: 'PositiveComments',
  data() {
    return {
      search: '',
      categoryFilter: null,
      
      bankComments: [],
      
      categoryOptions: [
        { text: 'الكل', value: null },
        { text: 'عام', value: 'general' },
        { text: 'قناة', value: 'channel' },
        { text: 'محتوى', value: 'content' }
      ],
    };
  },

  computed: {
    filteredBankComments() {
      let result = [...this.bankComments];
      
      // Filter by search term
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(comment => 
          comment.text.toLowerCase().includes(searchLower) || 
          (comment.translation && comment.translation.toLowerCase().includes(searchLower))
        );
      }
      
      // Filter by category
      if (this.categoryFilter !== null) {
        result = result.filter(comment => comment.category === this.categoryFilter);
      }
      
      return result;
    }
  },

  methods: {
    getCategoryText(category) {
      const categories = {
        'general': 'عام',
        'channel': 'قناة',
        'content': 'محتوى'
      };
      return categories[category] || '';
    },
    
    getCategoryColor(category) {
      const colors = {
        'general': 'primary',
        'channel': 'purple',
        'content': 'teal'
      };
      return colors[category] || 'grey';
    },
    
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        // Show notification
        alert('تم نسخ التعليق!');
      } catch (err) {
        console.error('فشل في النسخ:', err);
      }
    },

    async fetchPositiveComments() {
      try {
        const res = await fetch(`${BASE_URL}api/comments/?is_bank=true`);
        const data = await res.json();
        this.bankComments = data.results?.map(comment => ({
          ...comment,
          translatedText: '', // لإظهار الترجمة لاحقًا
        })) || [];
      } catch (err) {
        console.error('فشل تحميل التعليقات:', err);
      }
    },

  },
  created() {
    this.fetchPositiveComments();
  },
};
</script>

<style scoped>

.comment-card {
  transition: transform 0.3s ease;
}

.comment-card:hover {
  transform: translateY(-3px);
}

.comment-text {
  font-size: 1.1rem;
  line-height: 1.5;
}
.v-data-table {
  direction: rtl;
  text-align: right;
}
</style>
