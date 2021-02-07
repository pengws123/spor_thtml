import Vue from 'vue'
import Router from 'vue-router'
import vHead from '@/components/common/Header'
import vSidebar from '@/components/common/Sidebar'
import vTags from '@/components/common/Tags'
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect:"/test"
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },{
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/SorpType.vue'),
          meta: { title: '分类管理' }
        },
        ,{
          path: '/Shangpin',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shangpin/shangpin.vue'),
          meta: { title: '商品新增' }
        }
        ,{
          path: '/Spname',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/spname/spname.vue'),
          meta: { title: '商品管理' }
        }
        ,{
          path: '/shangquery',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shangquery/shangquery.vue'),
          meta: { title: '' }
        }
        ,{
          path: '/Spshu',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/spshuxing/SpShu.vue'),
          meta: { title: '商品属性' }
        }
        ,{
          path: '/User',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/user/user.vue'),
          meta: { title: '用户信息' }
        }
        ,{
          path: '/Userquan',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/userquan/userquan.vue'),
          meta: { title: '用户权限' }
        }
        ,{
          path: '/Userjuese',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/userjuese/userjuese.vue'),
          meta: { title: '用户角色' }
        }
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/login/Login.vue'),
      meta: { title: '登录' }
    }
  ]
})
