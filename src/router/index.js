import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home'
import Header from '@/components/common/Header'
import Left from '@/components/common/Sidebar'
import Tag from '@/components/common/Tags'
import Test from '@/components/Test'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:"/Test"
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
          path: '/SsType',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/SsType.vue'),
          meta: { title: '分类管理2' }
        }
        ,{
          path: '/Spname',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/spname/spname.vue'),
          meta: { title: '商品管理' }
        }
        ,{
          path: '/Spshu',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/spshuxing/SpShu.vue'),
          meta: { title: '商品属性' }
        }
      ]
    }
  ]
})
