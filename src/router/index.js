import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/loading',
      name: 'loading',
      meta: {
        title: '加载...'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/loading.vue')
    },
    {
      path: '/',
      name: 'downloadApp',
      meta: {
        title: '睿芯云汇'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/downloadApp.vue')
    },
    {
      path: '/aloneHome',
      name: 'aloneHome',
      meta: {
        title: '个人感悟'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/aloneHome.vue')
    },
    {
      path: '/details',
      name: 'details',
      meta: {
        title: '感悟详情'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/details.vue')
    },
    {
      path: '/news',
      name: 'news',
      meta: {
        title: '新的消息'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/news.vue')
    },
    {
      path: '/pub',
      name: 'pub',
      meta: {
        title: '发布'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/pub.vue')
    },
    {
      path: '/follow',
      name: 'follow',
      meta: {
        title: '关注'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/follow.vue')
    },
    {
      path: '/fans',
      name: 'fans',
      meta: {
        title: '粉丝'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/fans.vue')
    },
    {
      path: '/friend',
      name: 'friend',
      meta: {
        title: '关注'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/friend.vue')
    },
    {
      path: '/richText',
      name: 'richText',
      meta: {
        title: '详情'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/richText.vue')
    },
    {
      path: '/privacyPolicy',
      name: 'privacyPolicy',
      meta: {
        title: '隐私政策'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/privacyPolicy.vue')
    },
    {
      path: '/agreement',
      name: 'agreement',
      meta: {
        title: '用户协议'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/agreement.vue')
    },
    {
      path: '/courseDetails',
      name: 'courseDetails',
      meta: {
        title: '课程评论'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/courseDetails.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      meta: {
        title: '积分商城'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/scoreShop/shop.vue')
    },
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      meta: {
        title: '商品详情'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/scoreShop/goodsDetail.vue')
    },
    {
      path: '/buyOrder',
      name: 'buyOrder',
      meta: {
        title: '兑换列表'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/scoreShop/buyOrder.vue')
    },
    {
      path: '/messageList',
      name: 'messageList',
      meta: {
        title: '新闻'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/messageList.vue')
    },
    {
      path: '/userManager',
      name: 'userManager',
      meta: {
        title: '客服操作界面'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/userManager.vue')
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      meta: {
        title: '用户详情'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/userDetail.vue')
    },
    {
      path: '/loginLogList',
      name: 'loginLogList',
      meta: {
        title: '登录记录'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/loginLogList.vue')
    },
    {
      path: '/liveLog',
      name: 'liveLog',
      meta: {
        title: '直播记录'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/liveLog.vue')
    },
    {
      path: '/goodLog',
      name: 'goodLog',
      meta: {
        title: '商品兑换'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/goodLog.vue')
    },
    {
      path: '/userList',
      name: 'userList',
      meta: {
        title: '用户列表'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/userList.vue')
    }
  ]

})
