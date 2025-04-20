<template>
  <v-container fluid>
    <!-- رأس      -->
    <v-row justify="space-between" class="mb-4">
      <v-col>
        <h2 class="text-h5 font-weight-bold text-right">إدارة القنوات</h2>
      </v-col>
      <v-col class="text-left">
        <v-btn color="primary" @click="openForm()">إضافة قناة</v-btn>
      </v-col>
    </v-row>
 
    <!-- مكون النموذج الجانبي -->
    <ChannelForm :dialog="formDialog" :form-data="editingChannel" :on-close="closeForm" @save="handleSave" />

    <v-row v-if="isLoading" justify="center">
      <v-progress-circular indeterminate color="primary" size="48" />
    </v-row>

    <!-- لا توجد قنوات -->
    <v-row v-else-if="!channels.length" justify="center">
      <v-col cols="12" class="text-center text-grey">
        <v-icon size="48" class="mb-2" color="grey">mdi-alert-circle-outline</v-icon>
        <div class="text-h6">لا توجد قنوات مضافة حالياً</div>
      </v-col>
    </v-row>

    <!-- عرض القنوات -->
    <v-row v-else>
      <v-col v-for="channel in channels" :key="channel.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="channel-card mx-auto my-4 d-flex flex-column" elevation="3" rounded="xl">
          <v-img :src="channel.image" height="180px" cover />

          <v-card-title class="text-right text-h6 font-weight-bold white-space-normal">
            {{ channel.name }}
          </v-card-title>


          <v-card-text class="description text-right ml-6">
            {{ channel.description }}
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn icon @click="openForm(channel)">
              <v-icon color="primary">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="confirmDelete(channel)">
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
          هل أنت متأكد أنك تريد حذف القناة: <strong>{{ toDelete?.name }}</strong>؟
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
import ChannelForm from './ChannelForm.vue';

export default {
  components: { ChannelForm },

  data() {
    return {
      channels: [],
      formDialog: false,
      editingChannel: null,
      confirmDialog: false,
      toDelete: null,
      isLoading: false,
    };
  },

  async mounted() {
    await this.fetchChannels();
  },

  methods: {
    async fetchChannels() {
      this.isLoading = true;
      try {
        const res = await fetch('http://localhost:5454/api/channels/');
        const data = await res.json();
        this.channels = data.results || [];
      } catch (err) {
        console.error('خطأ في جلب القنوات', err);
      } finally {
        this.isLoading = false;
      }
    },

    openForm(channel = null) {
      this.editingChannel = channel;
      this.formDialog = true;
    },

    closeForm() {
      this.formDialog = false;
      this.editingChannel = null;
    },

    async handleSave(channelData) {
      const isEdit = !!channelData.id;

      const url = isEdit
        ? `http://localhost:5454/api/channels/${channelData.id}/`
        : 'http://localhost:5454/api/channels/';
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

        this.closeForm();
      } catch (err) {
        console.error('خطأ في حفظ القناة', err);
      }
    },

    confirmDelete(channel) {
      this.toDelete = channel;
      this.confirmDialog = true;
    },

    async deleteChannel() {
      if (!this.toDelete) return;

      try {
        await fetch(`http://localhost:5454/api/channels/${this.toDelete.id}/`, {
          method: 'DELETE',
        });
        this.channels = this.channels.filter(c => c.id !== this.toDelete.id);
      } catch (err) {
        console.error('فشل في الحذف:', err);
      } finally {
        this.confirmDialog = false;
        this.toDelete = null;
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

.description {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.white-space-normal {
  white-space: normal !important;
}
</style>
