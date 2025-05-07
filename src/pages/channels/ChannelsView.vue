<template>
  <v-container class="py-6">
    <!-- رأس      -->
    <div class="d-flex justify-space-between align-center mb-6">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddChannelDialog()">
        إضافة قناة جديدة
      </v-btn>
      <h1 class="text-h4 text-right">القنوات</h1>
    </div>

    
    <!-- Filters -->
    <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
      <div class="d-flex flex-wrap justify-space-between align-center">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="البحث في القنوات"
          density="compact"
          hide-details
          class="ml-4 flex-grow-1"
          style="max-width: 300px;"
        ></v-text-field>

        <div class="d-flex">
          <v-select
            v-model="selectedType"
            :items="channelTypes"
            item-title="text"
            item-value="value"
            label="نوع القناة"
            density="compact"
            hide-details
            class="ml-4"
            style="width: 150px"
          ></v-select>
          
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            item-title="text"
            item-value="value"
            label="الترتيب حسب"
            density="compact"
            hide-details
            class="ml-4"
            style="width: 150px"
          ></v-select>
          
          <v-btn-toggle v-model="viewMode" color="primary" density="comfortable">
            <v-btn value="grid" icon="mdi-view-grid"></v-btn>
            <v-btn value="list" icon="mdi-view-list"></v-btn>
          </v-btn-toggle>
        </div>
      </div>
    </v-card>


    <!-- Channel Grid View -->
    <div v-if="viewMode === 'grid'">
      <v-row>
        <v-col v-for="channel in filteredChannels" :key="channel.id" cols="12" sm="6" md="4" lg="3">
          <v-card elevation="3" rounded="lg" class="channel-card h-100">
            <v-img
              :src="channel.image"
              height="180px"
              cover
              class="channel-image"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
              </template>
              <div class="channel-overlay d-flex align-end">
                <v-chip :color="getChannelTypeColor(channel.type)" size="small" class="ma-2">
                  {{ getChannelTypeName(channel.type) }}
                </v-chip>
              </div>
            </v-img>
            
            <v-card-title class="text-right pt-4 text-truncate">{{ channel.name }}</v-card-title>
            
            <v-card-text class="text-right">
              <div class="text-body-2 channel-description text-truncate-3">{{ channel.description }}</div>
              <div class="d-flex justify-space-between align-center mt-2">
                <div class="text-caption">{{ channel.subscriber_count }} مشترك</div>
                <div class="text-caption">{{ channel.video_count }} فيديو</div>
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-pencil" variant="text" density="comfortable" @click="editChannel(channel)"></v-btn>
              <v-btn icon="mdi-eye" variant="text" density="comfortable" :href="channel.url" target="_blank"></v-btn>
              <v-btn icon="mdi-delete" variant="text" density="comfortable" color="error" @click="confirmDeleteChannel(channel)"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Channel List View -->
    <div v-else>
      <v-card elevation="2" rounded="lg">
        <v-table>
          <thead>
            <tr>
              <th class="text-right">الصورة</th>
              <th class="text-right">إسم القناة</th>
              <th class="text-right">النوع</th>
              <th class="text-right">المشتركين</th>
              <th class="text-right">الفيديوهات</th>
              <th class="text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="channel in filteredChannels" :key="channel.id">
              <td>
                <v-avatar size="40">
                  <v-img :src="channel.image" cover></v-img>
                </v-avatar>
              </td>
              <td class="text-right">{{ channel.name }}</td>
              <td class="text-right">
                <v-chip :color="getChannelTypeColor(channel.type)" size="small">
                  {{ getChannelTypeName(channel.type) }}
                </v-chip>
              </td>
              <td class="text-right">{{ channel.subscriber_count }}</td>
              <td class="text-right">{{ channel.video_count }}</td>
              <td>
                <div class="d-flex justify-end">
                  <v-btn icon="mdi-pencil" variant="text" density="compact" @click="editChannel(channel)"></v-btn>
                  <v-btn icon="mdi-eye" variant="text" density="compact" :href="channel.url" target="_blank"></v-btn>
                  <v-btn icon="mdi-delete" variant="text" density="compact" color="error" @click="confirmDeleteChannel(channel)"></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>

    <!-- Channel Form Dialog -->
    <channel-form 
      :dialog="showChannelForm" 
      :formData="selectedChannel"
      :onClose="closeChannelForm"
      @save="handleSave"
    />

    <!-- تأكيد الحذف -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 text-right">تأكيد الحذف</v-card-title>
        <v-card-text class="text-right">
          هل أنت متأكد أنك تريد حذف القناة: <strong>{{ channelToDelete?.name }}</strong>؟
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="confirmDialog = false">إلغاء</v-btn>
          <v-btn color="error" @click="deleteChannel">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { BASE_URL } from '@/config';
import ChannelForm from './ChannelForm.vue';

export default {
  components: { ChannelForm },

  data() {
    return {
      search: '',
      selectedType: null,
      channels: [],
      // formDialog: false,
      sortBy: 'subscriber_count',
      viewMode: 'grid',
      showChannelForm: false,
      selectedChannel: null,
      showDeleteDialog: false,
      channelToDelete: null,
      editingChannel: null,
      confirmDialog: false,
      isLoading: false,

      channelTypes: [
        { text: 'الكل', value: null },
        { text: 'يوتيوب', value: 1 },
        { text: 'تويتر', value: 2 },
        { text: 'تك توك', value: 3 }
      ],

      sortOptions: [
        { text: 'المشتركين', value: 'subscriber_count' },
        { text: 'الفيديوهات', value: 'videos' },
        { text: 'الاسم', value: 'name' }
      ]
    };
  },

  computed: {
    filteredChannels() {
      let result = [...this.channels];
      
      // Filter by search term
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(channel => 
          channel.name.toLowerCase().includes(searchLower) || 
          channel.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by channel type
      if (this.selectedType !== null) {
        result = result.filter(channel => channel.type === this.selectedType);
      }
      
      // Sort channels
      result.sort((a, b) => {
        if (this.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (this.sortBy === 'subscriber_count') {
          return this.parseSubscriberCount(b.subscriber_count) - this.parseSubscriberCount(a.subscriber_count);
        } else {
          return b[this.sortBy] - a[this.sortBy];
        }
      });
      
      return result;
    }
  },

  async mounted() {
    await this.fetchChannels();
  },

  methods: {

    getChannelTypeName(type) {
      const types = {
        1: 'يوتيوب',
        2: 'تويتر',
        3: 'تك توك'
      };
      return types[type] || '';
    },
    
    getChannelTypeColor(type) {
      const colors = {
        1: 'error',
        2: 'info',
        3: 'purple'
      };
      return colors[type] || 'primary';
    },
    
    parseSubscriberCount(subscriber_count) {
      if (typeof subscriber_count === 'number') return subscriber_count;
      
      let value = parseFloat(subscriber_count.replace(/[^0-9.]/g, ''));
      if (subscriber_count.includes('M')) {
        value *= 1000000;
      } else if (subscriber_count.includes('K')) {
        value *= 1000;
      }
      return value;
    },

    async fetchChannels() {
      this.isLoading = true;
      try {
        const res = await fetch(`${BASE_URL}api/channels/`);
        const data = await res.json();
        this.channels = data.results || [];
      } catch (err) {
        console.error('خطأ في جلب القنوات', err);
      } finally {
        this.isLoading = false;
      }
    },


    openAddChannelDialog() {
      this.selectedChannel = null;
      this.showChannelForm = true;
    },

    editChannel(channel) {
      this.selectedChannel = { ...channel };
      this.showChannelForm = true;
    },

    closeChannelForm() {
      this.showChannelForm = false;
      this.selectedChannel = null;
    },

    async handleSave(channelData) {
      const isEdit = !!channelData.id;
      const url = isEdit
        ? `${BASE_URL}api/channels/${channelData.id}/`
        : `${BASE_URL}api/channels/`;
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(channelData),
        });

        const result = await res.json();
        if (isEdit) {
          const idx = this.channels.findIndex(c => c.id === result.id);
          if (idx !== -1) this.channels[idx] = result;
        } else {
          this.channels.push(result);
        }

        this.closeChannelForm();
      } catch (err) {
        console.error('خطأ في حفظ القناة', err);
      }
    },

    confirmDelete(channel) {
      this.channelToDelete = channel;
      this.confirmDialog = true;
    },

    async deleteChannel() {
      if (!this.channelToDelete) return;

      try {
        await fetch(`${BASE_URL}api/channels/${this.channelToDelete.id}/`, {
          method: 'DELETE',
        });
        this.channels = this.channels.filter(c => c.id !== this.channelToDelete.id);
      } catch (err) {
        console.error('فشل في الحذف:', err);
      } finally {
        this.confirmDialog = false;
        this.channelToDelete = null;
      }
    },
  },
};
</script>

<style scoped>
.v-card-title,
.v-card-subtitle,
.v-card-text {
  direction: rtl;
}

.channel-card {
  height: 420px;
  /* أو أي ارتفاع يناسب التصميم */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.channel-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}


.white-space-normal {
  white-space: normal !important;
}
</style>
