import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, {Form} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/global.css'
import {request} from "@/api/request"
import func from './func'//引用
import moment from 'moment';

Vue.config.productionTip = false

Vue.use(Antd,{size:"small"})
Vue.use(Form)
Vue.use(func) //全局函数
Vue.prototype.request=request
Vue.prototype.$moment = moment

export const EventBus = new Vue() // 创建全局事件总线

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
