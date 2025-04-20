import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
// import { VDataTable } from 'vuetify/labs/VDataTable';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components: {
    ...components,
    // VDataTable,
  },
  directives,
  theme: {
    defaultTheme: 'light'
  },
  defaults: {
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    }
  }
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');