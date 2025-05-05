<template>
  <v-dialog v-model="dialogInternal" max-width="500">
    <v-card>
      <v-card-title class="text-right">
        {{ formData?.id ? 'تعديل القناة' : 'إضافة قناة جديدة' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-select
            v-model="channel.type"
            :items="channelTypes"
            item-value="value"
            item-title="text"
            label="نوع القناة"
            :rules="[rules.required]"
            required
          ></v-select>
          <v-text-field 
            v-model="channel.name" 
            label="اسم القناة" 
            :rules="[rules.required]" 
            required 
          />
          <v-textarea 
            v-model="channel.description" 
            label="الوصف" 
            :rules="[rules.required]" 
            required 
          />
          <v-text-field 
            v-model="channel.image" 
            label="رابط الصورة" 
            :rules="[rules.required, rules.validUrl]" 
            required 
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="onClose">إلغاء</v-btn>
        <v-btn color="primary" :disabled="!valid" @click="submit">
          {{ formData?.id ? 'حفظ التعديلات' : 'إضافة' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChannelForm',

  props: {
    dialog: Boolean,
    formData: Object,
    onClose: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      dialogInternal: false,
      valid: false,
      channel: {
        name: '',
        type: '',
        description: '',
        image: ''
      },
      channelTypes: [
        { text: 'يوتيوب', value: 1 },
        { text: 'تويتر', value: 2 },
        { text: 'تك توك', value: 3 }
      ],
      rules: {
        required: v => !!v || 'هذا الحقل مطلوب',
        validUrl: value => {
          const pattern = /^(http(s?):)([/|.|\w|\s|-])/;
          return pattern.test(value) || 'يجب إدخال رابط صورة صالح';
        }
      }
    };
  },

  watch: {
    dialog(val) {
      this.dialogInternal = val;
      if (val && this.formData) {
        this.channel = { ...this.formData };
      } else if (val) {
        this.resetForm();
      }
    },
    dialogInternal(val) {
      if (!val) this.onClose();
    }
  },

  methods: {
    resetForm() {
      this.channel = {
        name: '',
        type: '',
        description: '',
        image: ''
      };
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit('save', { ...this.channel });
      }
    }
  }
};
</script>

<style scoped>
.v-card-title,
.v-card-text {
  direction: rtl;
}
</style>