import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, {Form} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd,{size:"small"})
Vue.use(Form)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
