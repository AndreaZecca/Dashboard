import App from './App.vue'
import Vue from 'vue'
import vuetify from './plugins/vuetify' // path to vuetify export
import Router from './router'
import '@mdi/font/css/materialdesignicons.css'

new Vue({
  vuetify,
  icons: {
    iconfont: 'mdi',
  },
  router: Router,
  render: h => h(App)
}).$mount('#app')