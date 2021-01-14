// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import axios from 'axios';
import qs from 'qs';


Vue.config.productionTip = false

Vue.prototype.$ajax=axios;
Vue.prototype.$qs=qs;
Vue.use(ElementUI, {
  size: 'small'
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
