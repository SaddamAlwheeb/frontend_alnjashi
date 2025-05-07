<template>
    <v-container class="py-6">
    <div class="d-flex justify-space-between align-center mb-6">
      <v-btn color="primary" prepend-icon="mdi-plus" @click="openForm()">
        إضافة فيديو جديد
      </v-btn>
      <h1 class="text-h4 text-right">الفيديوهات</h1>
    </div>

    <!-- Filters -->
    <v-card elevation="2" class="mb-6 pa-4" rounded="lg">
      <div class="d-flex flex-wrap justify-space-between align-center">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="البحث في الفيديوهات"
          density="compact"
          hide-details
          class="ml-4 flex-grow-1"
          style="max-width: 300px;"
        ></v-text-field>
        
        <div class="d-flex flex-wrap">
          <v-select
            v-model="selectedChannel"
            :items="[{ name: 'الكل', id: null }, ...channels]"
            item-value="id"
            item-title="name"
            label="القناة"
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

   <!-- Video Grid View -->
   <div v-if="viewMode === 'grid'">
      <v-row>
        <v-col v-for="video in filteredVideos" :key="video.id" cols="12" sm="6" md="4" lg="3">
          <v-card elevation="3" rounded="lg" class="video-card h-100">
            <div class="video-thumbnail-container">
              <v-img
                :src="getYoutubeThumbnail(video.image)"
                height="180px"
                cover
                class="video-thumbnail"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </template>
                <div class="video-overlay d-flex align-end">
                  <div class="video-duration ma-2 px-2 py-1 bg-black rounded">
                    {{ video.duration }}
                  </div>
                </div>
              </v-img>
              <v-btn icon="mdi-play" variant="elevated" size="large" color="primary" class="video-play-btn" :href="video.image" target="_blank"></v-btn>
            </div>
            
            <v-card-title class="text-right pt-4 text-truncate">{{ video.name }}</v-card-title>
            
            <v-card-text class="text-right">
              <div class="d-flex align-center mb-2">
                <v-avatar size="28" class="ml-2">
                  <v-img :src="video.channel_image" cover></v-img>
                </v-avatar>
                <div class="text-subtitle-2">{{ video.channel_name }}</div>
              </div>
              
              <div class="d-flex justify-space-between text-caption text-grey-darken-1">
                <div>{{ video.view_count }} مشاهدة</div>
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon="mdi-pencil" variant="text" density="comfortable" @click="openForm(video)"></v-btn>
              <!-- <v-btn icon="mdi-comment-text-multiple" variant="text" density="comfortable" :badge="video.comment_count" :badge-color="video.hasNegativeComments ? 'error' : 'grey'"></v-btn> -->
              <v-btn icon="mdi-delete" variant="text" density="comfortable" color="error" @click="confirmDelete(video)"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>



    <!-- Video List View -->
    <div v-else>
      <v-card elevation="2" rounded="lg">
        <v-table>
          <thead>
            <tr>
              <th class="text-right">الصورة</th>
              <th class="text-right">عنوان الفيديو</th>
              <th class="text-right">القناة</th>
              <th class="text-right">المشاهدات</th>
              <th class="text-right">التعليقات</th>
              <th class="text-right">التاريخ</th>
              <th class="text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in filteredVideos" :key="video.id">
              <td>
                <div class="d-flex align-center">
                  <v-img :src="getYoutubeThumbnail(video.image)" width="120" height="68" cover rounded></v-img>
                </div>
              </td>
              <td class="text-right">{{ video.name }}</td>
              <td class="text-right">
                <div class="d-flex align-center">
                  <v-avatar size="24" class="ml-2">
                    <v-img :src="video.channel_image" cover></v-img>
                  </v-avatar>
                  <span>{{ video.channel_name }}</span>
                </div>
              </td>
              <td class="text-right">{{ video.view_count }}</td>
            
              <td class="text-right">{{ video.create_at }}</td>
              <td>
                <div class="d-flex justify-end">
                  <v-btn icon="mdi-pencil" variant="text" density="compact" @click="openForm(video)"></v-btn>
                  <v-btn icon="mdi-play" variant="text" density="compact" color="primary" :href="video.image" target="_blank"></v-btn>
                  <v-btn icon="mdi-delete" variant="text" density="compact" color="error" @click="confirmDelete(video)"></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>

    <videos-form
      v-model="formDialog"
      :video="editingVideo"
      @save="handleSave"
      @close="closeForm"
    />

      <!-- تأكيد الحذف -->
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6 text-right">تأكيد الحذف</v-card-title>
          <v-card-text class="text-right">
            هل أنت متأكد من حذف الفيديو: <strong>{{ toDelete?.name }}</strong>؟
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="confirmDialog = false">إلغاء</v-btn>
            <v-btn color="error" @click="deleteVideo">حذف</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>

    <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4"></v-progress-linear>

</template>
  
<script>
import VideosForm from './VideosForm.vue';
import { BASE_URL } from '@/config';

export default {
  components: { VideosForm },
    data() {
      return {
        search: '',
        selectedChannel: null,
        sortBy: 'views',
        viewMode: 'grid',
        videos: [],
        channels: [],
        formDialog: false,
        editingVideo: null,
        confirmDialog: false,
        toDelete: null,
        isLoading: false,

        sortOptions: [
        { text: 'المشاهدات', value: 'views' },
        { text: 'التعليقات', value: 'comments' },
        { text: 'التاريخ', value: 'date' }
      ],
      };
    },
  
    computed: {
      filteredVideos() {
        let result = [...this.videos];
        
        // Filter by search term
        if (this.search) {
          const searchLower = this.search.toLowerCase();
          result = result.filter(video => 
            video.name.toLowerCase().includes(searchLower) || 
            video.name.toLowerCase().includes(searchLower)
          );
        }
        
        // Filter by channel
        if (this.selectedChannel !== null) {
          result = result.filter(video => video.channel === this.selectedChannel);
        }
        
        // Sort videos
        result.sort((a, b) => {
          if (this.sortBy === 'views') {
            return this.parseViewCount(b.view_count) - this.parseViewCount(a.view_count);
          } else if (this.sortBy === 'date') {
            return new Date(b.date) - new Date(a.date);
          } else {
            return b[this.sortBy] - a[this.sortBy];
          }
        });
        
        return result;
      }
    },

    async mounted() {
      await this.fetchVideos();
      await this.fetchChannels();
    },
  
    methods: {
      async fetchVideos() {
        this.isLoading = true;
        try {
          const res = await fetch(`${BASE_URL}api/videos/`);
          const data = await res.json();
          this.videos = data.results || [];
        } catch (err) {
          console.error('فشل في جلب الفيديوهات', err);
        } finally {
          this.isLoading = false;
        }
      },

      async fetchChannels() {
        this.loadingChannels = true;
        if (this.channels.length) return;
        try {
          const res = await fetch(`${BASE_URL}api/channels-select/`);
          const data = await res.json();
          this.channels = data.results || [];
        } catch (err) {
          console.error('فشل في تحميل القنوات', err);
        } finally {
          this.loadingChannels = false;
        }
      },

      parseViewCount(views) {
        if (typeof views === 'number') return views;
        
        let value = parseFloat(views.replace(/[^0-9.]/g, ''));
        if (views.includes('M')) {
          value *= 1000000;
        } else if (views.includes('K')) {
          value *= 1000;
        }
        return value;
      },
  

      openForm(video = null) {
        this.editingVideo = video ? { ...video } : null;
        this.formDialog = true;
      },


      closeForm() {
        this.formDialog = false;
        this.editingVideo = null;
      },
  
      confirmDelete(video) {
        this.toDelete = video;
        this.confirmDialog = true;
      },

      async handleSave(channelData) {
      const isEdit = !!channelData.id;

      const url = isEdit
        ? `${BASE_URL}api/videos/${channelData.id}/`
        : `${BASE_URL}api/videos/`;
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(channelData),
        });

        const result = await res.json();
        if (isEdit) {
          const idx = this.videos.findIndex(c => c.id === result.id);
          if (idx !== -1) this.videos[idx] = result;
        } else {
          this.videos.push(result);
        }

        this.closeForm();
      } catch (err) {
        console.error('خطأ في حفظ القناة', err);
      }
    },
  
      async deleteVideo() {
        if (!this.toDelete) return;
        try {
          await fetch(`${BASE_URL}api/videos/${this.toDelete.id}/`, {
            method: 'DELETE',
          });
          this.videos = this.videos.filter((v) => v.id !== this.toDelete.id);
        } catch (err) {
          console.error('فشل في الحذف:', err);
        } finally {
          this.confirmDialog = false;
          this.toDelete = null;
        }
      },
  

      getYoutubeEmbedUrl(url) {
        try {
          const videoId = new URL(url).searchParams.get('v');
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch {
          return null;
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

  };
  </script>
  
<style scoped>
.video-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.video-thumbnail-container {
  position: relative;
  overflow: hidden;
}

.video-thumbnail {
  transition: transform 0.5s ease;
}

.video-card:hover .video-thumbnail {
  transform: scale(1.05);
}

.video-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.video-duration {
  color: white;
  font-size: 0.8rem;
}

.video-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .video-play-btn {
  opacity: 1;
}

.v-table {
  direction: rtl;
}
  </style>
  