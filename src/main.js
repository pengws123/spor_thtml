// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import axios from 'axios';
import qs from 'qs';

//进行axios的全局配置   允许转发cookie
axios.defaults.withCredentials = true
Vue.config.productionTip = false
//全局使用
Vue.prototype.$ajax=axios;
Vue.prototype.$qs=qs;
Vue.use(ElementUI, {
  size: 'small'
});
/* eslint-disable no-new */

//设置axios 的请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么，例如加入token

  //获取浏览器中的token
  let userInfo=window.sessionStorage.getItem("user"); //可能没有值
  if(userInfo!=null){
    //将请求中加入token参数
    //将字符串转为json对象
    let token=JSON.parse(userInfo).token;
    //axios中设置参数    get请求和post请求  get 设置在 config.params  post  config.data
    if (config.method === 'post') { //判断是否为post请求
      config.params = {
        "token":token
      }
    } else if (config.method === 'get') {
      config.params = {
        "token": token
      }
    }
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

//每次请求后的处理  如果是非法请求  跳转登陆页面
axios.interceptors.response.use(config=>{
  if (config.data.code==400){
    router.push("/login");
  }
  return config;
})

//配置路由守卫
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  let  user=window.sessionStorage.getItem("user");
  if (!user && to.path !== '/login') {
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
