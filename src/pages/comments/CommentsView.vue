<template>
  <v-container class="py-6">
    <h1 class="text-h4 text-right mb-6">التعليقات</h1>

    <!-- Filters -->
    <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
      <div class="d-flex flex-wrap align-center">
        <v-menu close-on-content-click="fase">
            <template v-slot:activator="{props}">
              <v-btn v-bind="props">
                <v-icon class="me-2">mdi-eye-outline</v-icon>
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-vard>
              <v-card-text>
                <v-checkbox 
                  v-for="header in headers"
                  :key="header.key"
                  :label="header.title"
                  :value="header.key"
                  color="primary"
                  v-model="selectedHead"
                  density="compact"
                  hide-details>
                </v-checkbox>
              </v-card-text>
            </v-vard>
        </v-menu>

        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="البحث في التعليقات"
          density="compact"
          hide-details
          class="ml-4 flex-grow-1"
          style="max-width: 300px;"
        ></v-text-field>

        <v-select
          v-model="selectedChannel"
          :items="[{ name: 'الكل', id: null }, ...channelOptions]"
          item-title="name"
          item-value="id"
          label="القناة"
          density="compact"
          hide-details
          class="ml-4"
          style="width: 150px"
        ></v-select>
        
        <v-select
          v-model="sentimentFilter"
          :items="sentimentOptions"
          item-title="text"
          item-value="value"
          label="نوع التعليق"
          density="compact"
          hide-details
          class="ml-4"
          style="width: 150px"
        ></v-select>
        
        <v-spacer></v-spacer>
        
        <v-btn prepend-icon="mdi-content-save" color="primary" class="ml-2" @click="saveSelectedToBank">
          حفظ المحدد في البنك
        </v-btn>
      </div>
    </v-card>


    <!-- Comments Table -->
    <v-card elevation="2" rounded="lg">
      <v-data-table
        v-model="selected"
        :headers="selectedHeaders"
        :items="filteredComments"
        item-value="id"
        show-select
        class="elevation-1"
      >
        <template v-slot:item.comment_text="{ item }">
          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-right">{{ item.comment_text }}</div>
            </div>
            <div v-if="item.translated_text" class="text-right text-grey">
              <v-icon size="16" color="primary" class="ml-1">mdi-translate</v-icon>
              {{ item.translated_text }}
            </div>
          </div>
        </template>

        <template v-slot:item.in_bank="{ item }">
          <div class="d-flex justify-center ga-2">
            <v-btn
              icon
              size="small"
              class="mb-2"
              color="primary"
              @click="copyToClipboard(item.comment_text)"
              title="نسخ التعليق">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              class="smooth-transition-btn"
              :color="item.in_bank ? 'success' : 'grey'"
              @click="saveToBank(item)"
              title="حفظ في البنك"
            >
              <v-icon>{{ item.in_bank ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            </v-btn>
          </div>
        </template>

        <template v-slot:item.sentiment="{ item }">
          <v-chip
            :color="getSentimentColor(item.sentiment)"
            size="small"
          >
            {{ getSentimentText(item.sentiment) }}
          </v-chip>
        </template>

        <template v-slot:item.date="{ item }">
          <div class="text-right">{{ formatDate(item.date) }}</div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-btn icon variant="text" @click="viewComment(item)" title="عرض">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="error" @click="confirmDeleteComment(item)" title="حذف">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-right">تأكيد الحذف</v-card-title>
        <v-card-text class="text-right">
          هل أنت متأكد من رغبتك في حذف هذا التعليق؟
          <div class="red--text mt-2">هذا الإجراء لا يمكن التراجع عنه.</div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" @click="deleteComment">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Comment Dialog -->
    <v-dialog v-model="showViewDialog" max-width="600">
      <v-card>
        <v-card-title class="text-right">تفاصيل التعليق</v-card-title>
        <v-card-text>
          <div class="text-right mb-4">
            <v-chip
              :color="getSentimentColor(selectedComment?.sentiment)"
              size="small"
              class="mb-2"
            >
              {{ getSentimentText(selectedComment?.sentiment) }}
            </v-chip>
            
            <div class="text-body-1 font-weight-bold mb-2">نص التعليق:</div>
            <div class="text-body-1 mb-4">{{ selectedComment?.comment_text }}</div>
            
            <div v-if="selectedComment?.translated_text" class="mb-4">
              <div class="text-body-1 font-weight-bold mb-2">الترجمة:</div>
              <div class="text-body-1">{{ selectedComment?.translated_text }}</div>
            </div>
            
            <div class="text-body-1 font-weight-bold mb-2">معلومات الفيديو:</div>
            <div class="d-flex align-center mb-2">
              <v-avatar size="36" class="ml-2">
                <v-img :src="selectedComment?.channel_image" cover></v-img>
              </v-avatar>
              <div>{{ selectedComment?.channel_name }}</div>
            </div>
            <div class="text-body-1 mb-4">{{ selectedComment?.video_title }}</div>
            
            <div class="text-body-1 font-weight-bold mb-2">معلومات المعلق:</div>
            <div class="d-flex align-center">
              <v-avatar size="36" class="ml-2">
                <v-img :src="selectedComment?.user_image" cover></v-img>
              </v-avatar>
              <div>{{ selectedComment?.user_name }}</div>
            </div>
            
            <div class="text-body-1 font-weight-bold mt-4 mb-2">تاريخ التعليق:</div>
            <div class="text-body-1">{{ formatDate(selectedComment?.date) }}</div>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="showViewDialog = false">إغلاق</v-btn>
          <v-btn 
            color="primary" 
            @click="saveToBank(selectedComment)"
            :prepend-icon="selectedComment?.in_bank ? 'mdi-star' : 'mdi-star-outline'"
          >
            {{ selectedComment?.in_bank ? 'محفوظ في البنك' : 'حفظ في البنك' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
<script>
import { BASE_URL } from '@/config';
import { formatDate } from '@/utils/formatters';

export default {
  name: 'CommentManager',
  data() {
    return {

      search: '',
      selectedChannel: null,
      sentimentFilter: null,
      selected: [],
      showDeleteDialog: false,
      commentToDelete: null,
      showViewDialog: false,
      selectedComment: null,
      selectedHead:[
        'comment_text',
        'in_bank',
        'actions'
      ],
      headers: [
        { title: 'التعليق', key: 'comment_text', sortable: false, align: 'start', width: '50%' },
        { title: 'النسخ والحفظ', key: 'in_bank', sortable: false, align: 'start', width: '20%' },
        { title: 'نوع التعليق', key: 'sentiment', sortable: true, align: 'center', width: '10%' },
        { title: 'التاريخ', key: 'date', sortable: true, align: 'center', width: '10%' },
        { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center', width: '10%' }
      ],


      
      channelOptions: [],
      
      sentimentOptions: [
        { text: 'الكل', value: null },
        { text: 'إيجابي', value: 'positive' },
        { text: 'محايد', value: 'neutral' },
        { text: 'سلبي', value: 'negative' }
      ],

      comments: [],
    };
  },
  created() {
    this.fetchComments();
    this.fetchanneles();
  },
  computed: {
    filteredComments() {
      let result = [...this.comments];
      
      // Filter by search term
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(comment => 
          comment.comment_text.toLowerCase().includes(searchLower) || 
          comment.video_title.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by channel
      if (this.selectedChannel !== null) {
        result = result.filter(comment => comment.channel_id === this.selectedChannel);
      }
      
      // Filter by sentiment
      if (this.sentimentFilter !== null) {
        result = result.filter(comment => comment.sentiment === this.sentimentFilter);
      }
      
      return result;
    },
    selectedHeaders(){
      return this.headers.filter((header) => 
      this.selectedHead.includes(header.key)
    );
    }
  },

  methods: {
    async fetchComments() {
      try {
        const res = await fetch(`${BASE_URL}api/comments/`);
        const data = await res.json();
        this.comments = data.results || [];
      } catch (err) {
        console.error('فشل تحميل التعليقات:', err);
      }
    },

    async fetchanneles() {
      try {
        const res = await fetch(`${BASE_URL}api/channels-select/`);
        const data = await res.json();
        this.channelOptions = data.results || [];
      } catch (err) {
        console.error('فشل تحميل القنوات:', err);
      }
    },

    formatDate,
    
    getSentimentText(sentiment) {
      const sentiments = {
        'positive': 'إيجابي',
        'neutral': 'محايد',
        'negative': 'سلبي'
      };
      return sentiments[sentiment] || '';
    },
    
    getSentimentColor(sentiment) {
      const colors = {
        'positive': 'success',
        'neutral': 'info',
        'negative': 'error'
      };
      return colors[sentiment] || 'grey';
    },
    
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        // Show notification
        // alert('تم نسخ التعليق!');
        this.$emit('show-snackbar', 'تم نسخ التعليق!');
      } catch (err) {
        console.error('فشل في النسخ:', err);
      }
    },
    
    async saveToBank(comment) {
        try {
          // إذا كان التعليق غير محفوظ في البنك، قم بتحديثه ليصبح محفوظًا في البنك
          const updatedComment = { ...comment, in_bank: !comment.in_bank };

          await fetch(`${BASE_URL}api/comments/${comment.id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedComment), // إرسال القيمة المحدثة
          });

          // بعد الحفظ، تحديث التعليق في الواجهة
          comment.in_bank = !comment.in_bank;
        } catch (err) {
          console.error('خطأ في تحديث بنك التعليقات:', err);
        }
      },

      async saveSelectedToBank() {
        if (this.selected.length > 0) {
          try {
            // تحديث كل تعليق تم تحديده
            for (let id of this.selected) {
              const commentIndex = this.comments.findIndex(c => c.id === id);
              if (commentIndex !== -1) {
                // تحديث التعليق في الواجهة ليتم تمييزه كـ "في البنك"
                // this.comments[commentIndex].in_bank = !comment.in_bank;
                
                // إرسال التحديث إلى الـ API
                const comment = this.comments[commentIndex];
                await fetch(`${BASE_URL}api/comments/${comment.id}/`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ in_bank: !comment.in_bank }),
                });
              }
            }

            // عرض إشعار بعد إتمام الحفظ
            this.$emit('show-snackbar', `تم حفظ ${this.selected.length} تعليق في البنك`);
          } catch (err) {
            console.error('خطأ في حفظ التعليقات في البنك:', err);
            this.$emit('show-snackbar', 'حدث خطأ أثناء حفظ التعليقات في البنك');
          }
        } else {
          // إذا لم يتم تحديد أي تعليق
          this.$emit('show-snackbar', 'يرجى تحديد تعليق واحد على الأقل');
        }
      },

          
    viewComment(comment) {
      this.selectedComment = { ...comment };
      this.showViewDialog = true;
    },
    
    confirmDeleteComment(comment) {
      this.commentToDelete = comment;
      this.showDeleteDialog = true;
    },
    
    async deleteComment() {
        if (this.commentToDelete) {
          try {
            const response = await fetch(`${BASE_URL}api/comments/${this.commentToDelete.id}/`, {
              method: 'DELETE',
            });

            if (response.ok) {
              this.comments = this.comments.filter(c => c.id !== this.commentToDelete.id);
              this.showDeleteDialog = false;
              this.commentToDelete = null;
              this.$emit('show-snackbar', 'تم حذف التعليق بنجاح');
            } else {
              console.error('فشل الحذف:', response.status);
              this.$emit('show-snackbar', 'حدث خطأ أثناء حذف التعليق');
            }
          } catch (error) {
            console.error('خطأ أثناء الحذف:', error);
            this.$emit('show-snackbar', 'حدث خطأ أثناء حذف التعليق');
          }
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
          body: JSON.stringify({ in_bank: comment.in_bank }),
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

.smooth-transition-btn {
  transition: all 0.3s ease-in-out; /* Smooth transition for size, color, and other properties */
}
</style>
  