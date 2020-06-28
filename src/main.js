import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets


import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission'
import {mockXHR} from '../mock'

if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
import 'default-passive-events'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI,);
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor);
import VueCropper from 'vue-cropper'

Vue.use(VueCropper)

import {hasPermission, message} from '@/utils/validate'

Vue.prototype.hasPerm = hasPermission;
Vue.prototype.mess = message;
import moment from 'moment'

Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
import infiniteScroll from "vue-infinite-scroll"
Vue.use(infiniteScroll)
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
