<template>
  <v-dialog v-model="dialogInternal" max-width="500">
    <v-card>
      <v-card-title class="text-right">
        {{ formData?.id ? 'تعديل الفيديو' : 'إضافة فيديو' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- اختر القناة: يتم تخزين الـ id فقط في video.channel -->
          <v-select
            v-model="video.channel"
            :items="channels"
            item-value="id"
            item-title="name"
            label="اختر القناة"
            :rules="[rules.required]"
            required
          ></v-select>

          <v-text-field
            v-model="video.name"
            label="اسم الفيديو"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-text-field
            v-model="video.image"
            label="رابط الفيديو (يوتيوب)"
            :rules="[rules.required, rules.validUrl]"
            required
          ></v-text-field>

          <v-text-field
            v-model="video.youtube_id"
            label="معرف الفديوا"
            :rules="[]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="onClose">إلغاء</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="submit">
          {{ formData?.id ? 'حفظ التعديل' : 'إضافة' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VideoForm",

  props: {
    dialog: Boolean,
    formData: Object,
    onClose: Function,
  },

  data() {
    return {
      dialogInternal: false,
      valid: false,
      video: {
        name: '',
        image: '',
        channel: null, // نحفظ هنا id القناة (رقم)
      },
      channels: [],
      rules: {
        required: v => !!v || 'هذا الحقل مطلوب',
        validUrl: v => {
          const pattern = /^https:\/\/(www\.)?youtube\.com\/watch\?v=.+$/;
          return pattern.test(v) || 'الرابط يجب أن يكون رابط يوتيوب صالح';
        },
      },
    };
  },

  watch: {
    // عند فتح الحوار، نقوم بتحديث بيانات الفيديو بناءً على formData (للتحرير) أو نعيد تعيينها للإضافة
    dialog(val) {
      this.dialogInternal = val;
      if (val) {
        this.video = this.formData
          ? { ...this.formData }  // افترض أن formData.channel هو رقم بالفعل
          : { name: '', image: '', channel: null };
        this.fetchChannels();
      }
    },
    dialogInternal(val) {
      if (!val) this.onClose();
    },
  },

  methods: {
    async fetchChannels() {
      try {
        const res = await fetch('http://localhost:5454/api/channels-select/');
        const data = await res.json();
        this.channels = data.results || [];
      } catch (err) {
        console.error('فشل في تحميل القنوات', err);
      }
    },

    submit() {
      const form = this.$refs.form;
      if (form && form.validate()) {
        // payload يحمل video مع channel كرقم (id)
        const payload = { ...this.video };
        this.$emit('save', payload);
        this.dialogInternal = false;
      }
    },
  },
};
</script>

<style scoped>
.v-card-title,
.v-card-text {
  direction: rtl;
}
</style>
