<template>
    <v-container fluid>
      <v-row justify="space-between" class="mb-4">
        <v-col>
          <h2 class="text-h5 font-weight-bold text-right">إدارة الفيديوهات</h2>
        </v-col>
        <v-col class="text-left">
          <v-btn color="primary" @click="openForm()">إضافة فيديو</v-btn>
        </v-col>
      </v-row>
      <!-- مكون النموذج الجانبي -->
      <VideosForm :dialog="formDialog" :form-data="editingVideo" :on-close="closeForm" @save="handleSave" />

      <v-row v-if="isLoading" justify="center">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-row>
  
      <v-row v-else-if="!videos.length" justify="center">
        <v-col cols="12" class="text-center text-grey">
          <v-icon size="48" class="mb-2" color="grey">mdi-alert-circle-outline</v-icon>
          <div class="text-h6">لا توجد فيديوهات مضافة حالياً</div>
        </v-col>
      </v-row>
  
      <v-row v-else>
        <v-col v-for="video in videos" :key="video.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto my-4 d-flex flex-column" elevation="3" rounded="xl">
            <iframe
              v-if="getYoutubeEmbedUrl(video.image)"
              width="100%"
              height="200"
              :src="getYoutubeEmbedUrl(video.image)"
              frameborder="0"
              allowfullscreen
            ></iframe>
  
            <v-card-title class="text-right text-h6 font-weight-bold">
              {{ video.name }}
            </v-card-title>
  
            <v-card-actions class="justify-end">
              <v-btn icon @click="openForm(video)">
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="confirmDelete(video)">
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
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
  </template>
  
  <script>
import VideosForm from './VideosForm.vue';

export default {
  components: { VideosForm },
    data() {
      return {
        videos: [],
        formDialog: false,
        editingVideo: null,
        confirmDialog: false,
        toDelete: null,
        isLoading: false,
      };
    },
  
    async mounted() {
      await this.fetchVideos();
    },
  
    methods: {
      async fetchVideos() {
        this.isLoading = true;
        try {
          const res = await fetch('http://localhost:5454/api/videos/');
          const data = await res.json();
          this.videos = data.results || [];
        } catch (err) {
          console.error('فشل في جلب الفيديوهات', err);
        } finally {
          this.isLoading = false;
        }
      },
  
      openForm(video = null) {
        this.editingVideo = video;
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
        ? `http://localhost:5454/api/videos/${channelData.id}/`
        : 'http://localhost:5454/api/videos/';
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
          await fetch(`http://localhost:5454/api/videos/${this.toDelete.id}/`, {
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
    },
  };
  </script>
  
  <style scoped>
  .v-card-title {
    direction: rtl;
  }
  
  .description {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  