<template>
  <v-container class="py-6">
    <h1 class="text-h4 text-right mb-6">التحليلات</h1>
    
    <!-- Filters -->
    <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
      <div class="d-flex flex-wrap justify-space-between align-center">
        <div class="d-flex flex-wrap">
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
            v-model="metricType"
            :items="metricTypes"
            item-title="text"
            item-value="value"
            label="نوع التحليل"
            density="compact"
            hide-details
            class="ml-4"
            style="width: 180px"
          ></v-select>
        </div>
        
        <div>
          <v-btn-toggle v-model="chartType" color="primary" density="comfortable">
            <v-btn value="line" icon="mdi-chart-line" title="رسم بياني خطي"></v-btn>
            <v-btn value="bar" icon="mdi-chart-bar" title="رسم بياني شريطي"></v-btn>
            <v-btn value="pie" icon="mdi-chart-pie" title="رسم بياني دائري"></v-btn>
          </v-btn-toggle>
        </div>
      </div>
    </v-card>
    
    <!-- Main Chart -->
    <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
      <v-card-title class="text-h6 text-right pb-2">
        {{ getMetricTitle() }}
      </v-card-title>
      <div class="chart-container" style="height: 400px; position: relative;">
        <!-- Place for actual chart component -->
        <div class="text-center empty-chart-placeholder d-flex align-center justify-center flex-column">
          <v-icon size="64" color="grey-lighten-2">{{ getChartIcon() }}</v-icon>
          <div class="text-subtitle-1 mt-2">{{ getChartDescription() }}</div>
        </div>
      </div>
    </v-card>
    
    <!-- Analytics Insights -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100 pa-4" rounded="lg">
          <v-card-title class="text-h6 text-right pb-2">
            نظرة عامة على الأداء
          </v-card-title>
          <v-card-text class="text-right">
            <div v-for="(insight, i) in performanceInsights" :key="i" class="mb-4">
              <div class="d-flex align-center mb-1">
                <v-icon :color="insight.color" size="20" class="ml-2">{{ insight.icon }}</v-icon>
                <span class="text-subtitle-1 font-weight-medium">{{ insight.title }}</span>
              </div>
              <p class="text-body-1 mr-7">{{ insight.description }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card elevation="2" class="h-100 pa-4" rounded="lg">
          <v-card-title class="text-h6 text-right pb-2">
            اتجاهات المشاهدين
          </v-card-title>
          
          <v-list>
            <v-list-subheader class="text-right">الفئات العمرية</v-list-subheader>
            <v-list-item v-for="(demo, i) in demographics" :key="i">
              <template v-slot:prepend>
                <div class="text-right" style="width: 100px">{{ demo.age }}</div>
              </template>
              <v-list-item-title>
                <v-progress-linear
                  :model-value="demo.percentage"
                  color="primary"
                  height="12"
                  rounded
                  :bg-color="demo.color + ' lighten-3'"
                  class="mb-1"
                >
                  <template v-slot:default>
                    <span class="text-caption white--text">{{ demo.percentage }}%</span>
                  </template>
                </v-progress-linear>
              </v-list-item-title>
            </v-list-item>
            
            <v-divider class="my-4"></v-divider>
            
            <v-list-subheader class="text-right">الجنس</v-list-subheader>
            <v-list-item v-for="(gender, i) in genders" :key="i">
              <template v-slot:prepend>
                <div class="text-right" style="width: 100px">{{ gender.label }}</div>
              </template>
              <v-list-item-title>
                <v-progress-linear
                  :model-value="gender.percentage"
                  :color="gender.color"
                  height="12"
                  rounded
                  :bg-color="gender.color + ' lighten-3'"
                  class="mb-1"
                >
                  <template v-slot:default>
                    <span class="text-caption white--text">{{ gender.percentage }}%</span>
                  </template>
                </v-progress-linear>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Top Performing Content -->
    <v-card elevation="2" class="mt-6 pa-4" rounded="lg">
      <v-card-title class="text-h6 text-right pb-2">
        مقارنة أداء المحتوى
      </v-card-title>
      
      <v-table>
        <thead>
          <tr>
            <th class="text-right">المحتوى</th>
            <th class="text-right">المشاهدات</th>
            <th class="text-right">التعليقات</th>
            <th class="text-right">معدل المشاركة</th>
            <th class="text-right">الاتجاه</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(content, i) in topPerforming" :key="i">
            <td class="text-right">{{ content.title }}</td>
            <td class="text-right">{{ content.views }}</td>
            <td class="text-right">{{ content.comments }}</td>
            <td class="text-right">{{ content.engagement }}%</td>
            <td class="text-right">
              <v-icon :color="content.trendColor">{{ content.trendIcon }}</v-icon>
              <span :class="`text-${content.trendColor} mr-1`">{{ content.trend }}%</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AnalyticsView',
  data() {
    return {
      dateRange: 'month',
      metricType: 'views',
      chartType: 'line',
      
      dateRanges: [
        { text: 'اليوم', value: 'day' },
        { text: 'الأسبوع', value: 'week' },
        { text: 'الشهر', value: 'month' },
        { text: 'الربع', value: 'quarter' },
        { text: 'السنة', value: 'year' }
      ],
      
      metricTypes: [
        { text: 'المشاهدات', value: 'views' },
        { text: 'التعليقات', value: 'comments' },
        { text: 'معدل المشاركة', value: 'engagement' },
        { text: 'المشتركين الجدد', value: 'subscribers' },
        { text: 'وقت المشاهدة', value: 'watchTime' }
      ],
      
      performanceInsights: [
        {
          title: 'زيادة في المشاهدات',
          description: 'ارتفعت نسبة المشاهدات بمقدار 15% مقارنة بالشهر الماضي، مما يشير إلى فعالية المحتوى الجديد.',
          icon: 'mdi-trending-up',
          color: 'success'
        },
        {
          title: 'انخفاض في معدل النقر',
          description: 'انخفض معدل النقر على الفيديوهات بنسبة 3%، قد يكون بسبب عناوين الفيديوهات أو الصور المصغرة.',
          icon: 'mdi-trending-down',
          color: 'error'
        },
        {
          title: 'أوقات الذروة',
          description: 'أكثر أوقات النشاط على القنوات هي من الساعة 8 مساءً حتى 10 مساءً، ينصح بنشر المحتوى في هذه الأوقات.',
          icon: 'mdi-clock-time-four',
          color: 'info'
        },
        {
          title: 'تحسن في التفاعل',
          description: 'ارتفعت نسبة التفاعل مع المحتوى بمقدار 8% بسبب زيادة الأسئلة والدعوات للمشاركة في الفيديوهات.',
          icon: 'mdi-thumb-up',
          color: 'success'
        }
      ],
      
      demographics: [
        { age: '13-17', percentage: 5, color: 'purple' },
        { age: '18-24', percentage: 28, color: 'indigo' },
        { age: '25-34', percentage: 35, color: 'primary' },
        { age: '35-44', percentage: 20, color: 'teal' },
        { age: '45-54', percentage: 8, color: 'orange' },
        { age: '55+', percentage: 4, color: 'red' }
      ],
      
      genders: [
        { label: 'ذكور', percentage: 65, color: 'blue' },
        { label: 'إناث', percentage: 35, color: 'pink' }
      ],
      
      topPerforming: [
        {
          title: 'رسالة إلى النجاشي - الجزء الأول',
          views: '120K',
          comments: '45',
          engagement: '8.5',
          trend: '+12.3',
          trendIcon: 'mdi-arrow-up',
          trendColor: 'success'
        },
        {
          title: 'أخلاق الرسول - الجزء الأول',
          views: '78K',
          comments: '28',
          engagement: '7.2',
          trend: '+5.8',
          trendIcon: 'mdi-arrow-up',
          trendColor: 'success'
        },
        {
          title: 'التوكل على الله',
          views: '54K',
          comments: '22',
          engagement: '6.8',
          trend: '-2.1',
          trendIcon: 'mdi-arrow-down',
          trendColor: 'error'
        },
        {
          title: 'رسالة إلى النجاشي - الجزء الثاني',
          views: '95K',
          comments: '32',
          engagement: '6.5',
          trend: '+8.7',
          trendIcon: 'mdi-arrow-up',
          trendColor: 'success'
        },
        {
          title: 'أهمية الصبر في حياة المسلم',
          views: '43K',
          comments: '15',
          engagement: '5.9',
          trend: '-1.5',
          trendIcon: 'mdi-arrow-down',
          trendColor: 'error'
        }
      ]
    };
  },
  
  methods: {
    getMetricTitle() {
      const metricTitles = {
        'views': 'تحليل المشاهدات',
        'comments': 'تحليل التعليقات',
        'engagement': 'تحليل معدل المشاركة',
        'subscribers': 'تحليل المشتركين الجدد',
        'watchTime': 'تحليل وقت المشاهدة'
      };
      
      return metricTitles[this.metricType] || 'تحليل الأداء';
    },
    
    getChartIcon() {
      const icons = {
        'line': 'mdi-chart-line',
        'bar': 'mdi-chart-bar',
        'pie': 'mdi-chart-pie'
      };
      
      return icons[this.chartType] || 'mdi-chart-line';
    },
    
    getChartDescription() {
      const metricDescriptions = {
        'views': 'تحليل لعدد المشاهدات عبر الزمن',
        'comments': 'تحليل لعدد التعليقات واتجاهاتها',
        'engagement': 'تحليل لمعدلات المشاركة والتفاعل',
        'subscribers': 'تحليل لنمو المشتركين الجدد',
        'watchTime': 'تحليل لإجمالي وقت المشاهدة'
      };
      
      return metricDescriptions[this.metricType] || 'تحليل الأداء العام';
    }
  }
};
</script>

<style scoped>
.empty-chart-placeholder {
  height: 100%;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
}

.v-table {
  direction: rtl;
}
</style>