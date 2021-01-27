// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
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


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const role = localStorage.getItem('ms_username');
  if (!role && to.path !== '/login') {
    next('/login');
  }else {
    next();
  }
});


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
