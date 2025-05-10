<template>
    <v-container class="py-6">
      <h1 class="text-h4 text-right mb-6">التقارير</h1>
      
      <!-- Date Range Picker -->
      <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
        <div class="d-flex flex-wrap justify-space-between align-center">
          <div class="d-flex align-center">
            <v-select
              v-model="dateRange"
              :items="dateRanges"
              item-title="text"
              item-value="value"
              label="الفترة الزمنية"
              density="compact"
              hide-details
              class="ml-4"
              style="width: 150px"
            ></v-select>
            
            <v-select
              v-model="selectedChannel"
              :items="channelOptions"
              item-title="text"
              item-value="value"
              label="القناة"
              density="compact"
              hide-details
              class="ml-4"
              style="width: 150px"
            ></v-select>
          </div>
          
          <v-btn prepend-icon="mdi-download" variant="outlined">
            تصدير التقرير
          </v-btn>
        </div>
      </v-card>
      
      <!-- Summary Cards -->
      <v-row>
        <v-col v-for="(card, index) in summaryCards" :key="index" cols="12" sm="6" md="3">
          <v-card elevation="2" class="pa-4 report-card" rounded="lg">
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-2">
                <v-avatar :color="card.avatarColor" size="42" class="ml-4">
                  <v-icon :color="card.iconColor" size="24">{{ card.icon }}</v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-medium">{{ card.title }}</div>
                  <div class="text-h5 font-weight-bold">{{ card.value }}</div>
                </div>
              </div>
              <div class="d-flex align-center">
                <v-icon :color="card.trendColor" size="16" class="ml-1">{{ card.trendIcon }}</v-icon>
                <span :class="`text-${card.trendColor}`">{{ card.trend }}</span>
                <span class="text-caption mr-2">منذ الفترة السابقة</span>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Charts -->
      <v-row class="mt-4">
        <v-col cols="12" md="8">
          <v-card elevation="2" class="pa-4" rounded="lg">
            <v-card-title class="text-h6 text-right pb-2">نشاط القناة عبر الزمن</v-card-title>
            <div class="chart-container" style="height: 300px; position: relative;">
              <!-- Place for actual chart component -->
              <div class="text-center empty-chart-placeholder d-flex align-center justify-center flex-column">
                <v-icon size="64" color="grey-lighten-2">mdi-chart-line</v-icon>
                <div class="text-subtitle-1 mt-2">رسم بياني لمشاهدات وتعليقات القناة</div>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card elevation="2" class="pa-4" rounded="lg">
            <v-card-title class="text-h6 text-right pb-2">توزيع التعليقات</v-card-title>
            <div class="chart-container" style="height: 300px; position: relative;">
              <!-- Place for actual chart component -->
              <div class="text-center empty-chart-placeholder d-flex align-center justify-center flex-column">
                <v-icon size="64" color="grey-lighten-2">mdi-chart-pie</v-icon>
                <div class="text-subtitle-1 mt-2">توزيع التعليقات حسب نوعها</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Top Content Table -->
      <v-card elevation="2" class="mt-6 pa-4" rounded="lg">
        <v-card-title class="text-h6 text-right pb-2">أفضل المحتويات أداءً</v-card-title>
        <v-table>
          <thead>
            <tr>
              <th class="text-right">الفيديو</th>
              <th class="text-right">المشاهدات</th>
              <th class="text-right">التعليقات</th>
              <th class="text-right">معدل الإعجاب</th>
              <th class="text-right">تاريخ النشر</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(content, i) in topContent" :key="i">
              <td class="text-right">
                <div class="d-flex align-center" style="width: 250px; overflow: hidden;">
                  <v-img
                    :src="getYoutubeThumbnail(content.thumbnail)"
                    width="80px"
                    height="45"
                    cover
                    rounded
                    class="ml-2"
                  ></v-img>
                  <span
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block;"
                  >
                    {{ content.title }}
                  </span>
                </div>
              </td>
              <td class="text-right">{{ content.views }}</td>
              <td class="text-right">{{ content.comments }}</td>
              <td class="text-right">
                <div class="d-flex align-center">
                  <v-rating
                    :model-value="content.likeRatio"
                    color="amber"
                    density="compact"
                    size="small"
                    readonly
                    half-increments
                  ></v-rating>
                  <span class="text-caption mr-2">{{ content.likeRatio }}/5</span>
                </div>
              </td>
              <td class="text-right">{{ content.date }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { BASE_URL } from '@/config';
  export default {
    name: 'ReportsView',
    data() {
      return {
        dateRange: 'month',
        selectedChannel: null,
        channelsCount : 0,
        videosCount : 0,
        commentsCount : 0,
        positiveComments : 0,
        neutralComments : 0,
        negativeComments : 0,
        
        dateRanges: [
          { text: 'اليوم', value: 'day' },
          { text: 'الأسبوع', value: 'week' },
          { text: 'الشهر', value: 'month' },
          { text: 'الربع', value: 'quarter' },
          { text: 'السنة', value: 'year' }
        ],
        
        channelOptions: [
          { text: 'كل القنوات', value: null },
          { text: 'نور الإيمان', value: 1 },
          { text: 'المعرفة للجميع', value: 2 },
          { text: 'الدروس الإسلامية', value: 3 }
        ],
       
        topContent: []

        // {
        //     title: 'رسالة إلى النجاشي - الجزء الأول',
        //     thumbnail: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        //     views: '120K',
        //     comments: 45,
        //     likeRatio: 4.8,
        //     date: '2025-05-01'
        //   },
      };
    },
    created(){
      this.fetchSummaryStats();
      this.fetchTopContent();
    },

    methods: {
      async fetchSummaryStats() {
        try {
          const res = await fetch(`${BASE_URL}api/summary-stats`);
          const data = await res.json();
          this.channelsCount = data['channels_count'] || 0;
          this.videosCount = data.videos_count || 0;
          this.commentsCount = data.comments_count || 0;
          this.positiveComments = data.positive_comments || 0;
          this.neutralComments = data.neutral_comments || 0;
          this.negativeComments = data.negative_comments || 0;
        } catch (err) {
          console.error('فشل تحميل التعليقات:', err);
        }
      },
      async fetchTopContent() {
        try {
          const res = await fetch(`${BASE_URL}api/top-content/`);
          this.topContent = await res.json();
        } catch (err) {
          console.error('فشل تحميل التعليقات:', err);
        }
      },
      getYoutubeThumbnail(url) {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        if (match && match[1]) {
          return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
        return '';
      }
    },

    computed: {
      summaryCards() {
        return [
          {
            title: 'إجمالي القنوات',
            value: this.channelsCount.toLocaleString(),
            icon: 'mdi-eye',
            avatarColor: 'blue lighten-4',
            iconColor: 'primary',
            trend: '+12.5%',
            trendIcon: 'mdi-arrow-up',
            trendColor: 'success'
          },
          {
            title: 'عدد التعليقات',
            value: this.commentsCount.toLocaleString(),
            icon: 'mdi-comment-multiple-outline',
            avatarColor: 'green lighten-4',
            iconColor: 'success',
            trend: '+8.7%',
            trendIcon: 'mdi-arrow-up',
            trendColor: 'success'
          },
          {
            title: 'تعليقات إيجابية',
            value: `${Math.round(
              (this.positiveComments / Math.max(1, this.commentsCount)) * 100
            )}%`,
            icon: 'mdi-thumb-up',
            avatarColor: 'amber lighten-4',
            iconColor: 'warning',
            trend: '+2.3%',
            trendIcon: 'mdi-arrow-up',
            trendColor: 'success'
          },
          {
            title: 'تعليقات سلبية',
            value: `${Math.round(
              (this.negativeComments / Math.max(1, this.commentsCount)) * 100
            )}%`,
            icon: 'mdi-thumb-down',
            avatarColor: 'red lighten-4',
            iconColor: 'error',
            trend: '-1.2%',
            trendIcon: 'mdi-arrow-down',
            trendColor: 'error'
          },
          {
            title: 'تعليقات محايدة',
            value: `${Math.round(
              (this.neutralComments / Math.max(1, this.commentsCount)) * 100
            )}%`,
            icon: 'mdi-emoticon-neutral-outline',
            avatarColor: 'red lighten-4',
            iconColor: 'error',
            trend: '-1.2%',
            trendIcon: 'mdi-arrow-down',
            trendColor: 'error'
          }
        ];
      }
    }

  };
  </script>
  
  <style scoped>
  .report-card {
    transition: transform 0.3s ease;
  }
  
  .report-card:hover {
    transform: translateY(-5px);
  }
  
  .empty-chart-placeholder {
    height: 100%;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
  }
  
  .v-table {
    direction: rtl;
  }
  </style>