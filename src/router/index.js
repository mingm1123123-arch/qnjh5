import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history', // 使用history模式，URL更友好，利于SEO
  scrollBehavior(to, from, savedPosition) {
    // 滚动行为控制
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/loading',
      name: 'loading',
      meta: {
        title: '加载... | 睿芯云汇',
        description: '加载中...',
        keywords: '睿芯云汇,加载'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/loading.vue')
    },
    {
      path: '/',
      name: 'downloadApp',
      meta: {
        title: '睿芯云汇APP下载 - 官方正版',
        description: '睿芯云汇APP官方下载页面，提供安卓最新版本下载，安全无毒，请放心使用。',
        keywords: '睿芯云汇下载,APP下载,安卓版下载'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/downloadApp.vue')
    },
    {
      path: '/aloneHome',
      name: 'aloneHome',
      meta: {
        title: '个人感悟 - 睿芯云汇',
        description: '查看用户的个人感悟分享',
        keywords: '个人感悟,感悟分享'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/aloneHome.vue')
    },
    {
      path: '/details',
      name: 'details',
      meta: {
        title: '感悟详情 - 睿芯云汇',
        description: '查看详细感悟内容',
        keywords: '感悟详情,文章内容'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/details.vue')
    },
    {
      path: '/news',
      name: 'news',
      meta: {
        title: '消息中心 - 睿芯云汇',
        description: '查看最新通知和消息',
        keywords: '消息,通知'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/news.vue')
    },
    {
      path: '/pub',
      name: 'pub',
      meta: {
        title: '发布感悟 - 睿芯云汇',
        description: '发布您的个人感悟和想法',
        keywords: '发布,写感悟'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/pub.vue')
    },
    {
      path: '/follow',
      name: 'follow',
      meta: {
        title: '我的关注 - 睿芯云汇',
        description: '查看我关注的用户列表',
        keywords: '关注,粉丝'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/follow.vue')
    },
    {
      path: '/fans',
      name: 'fans',
      meta: {
        title: '我的粉丝 - 睿芯云汇',
        description: '查看我的粉丝列表',
        keywords: '粉丝,关注者'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/fans.vue')
    },
    {
      path: '/friend',
      name: 'friend',
      meta: {
        title: '好友列表 - 睿芯云汇',
        description: '查看好友列表',
        keywords: '好友,朋友'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/friend.vue')
    },
    {
      path: '/richText',
      name: 'richText',
      meta: {
        title: '详情 - 睿芯云汇',
        description: '查看详细内容',
        keywords: '详情,内容'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/richText.vue')
    },
    {
      path: '/privacyPolicy',
      name: 'privacyPolicy',
      meta: {
        title: '隐私政策 - 睿芯云汇',
        description: '睿芯云汇隐私政策，保护用户隐私安全',
        keywords: '隐私政策,用户协议'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/privacyPolicy.vue')
    },
    {
      path: '/agreement',
      name: 'agreement',
      meta: {
        title: '用户协议 - 睿芯云汇',
        description: '睿芯云汇用户服务协议',
        keywords: '用户协议,服务条款'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/agreement.vue')
    },
    {
      path: '/courseDetails',
      name: 'courseDetails',
      meta: {
        title: '课程评论 - 睿芯云汇',
        description: '查看课程评论和学习心得',
        keywords: '课程,评论,学习'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/courseDetails.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      meta: {
        title: '积分商城 - 睿芯云汇',
        description: '使用积分兑换精美商品，礼品丰富多样',
        keywords: '积分商城,积分兑换,礼品'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/scoreShop/shop.vue')
    },
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      meta: {
        title: '商品详情 - 积分商城 - 睿芯云汇',
        description: '查看商品详细信息并进行积分兑换',
        keywords: '商品详情,积分兑换'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/scoreShop/goodsDetail.vue')
    },
    {
      path: '/buyOrder',
      name: 'buyOrder',
      meta: {
        title: '兑换记录 - 积分商城 - 睿芯云汇',
        description: '查看您的积分兑换订单记录',
        keywords: '兑换记录,订单'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/scoreShop/buyOrder.vue')
    },
    {
      path: '/messageList',
      name: 'messageList',
      meta: {
        title: '新闻资讯 - 睿芯云汇',
        description: '查看最新新闻资讯',
        keywords: '新闻,资讯'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/messageList.vue')
    },
    {
      path: '/userManager',
      name: 'userManager',
      meta: {
        title: '客服管理 - 睿芯云汇',
        description: '客服操作界面',
        keywords: '客服管理'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/userManager.vue')
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      meta: {
        title: '用户详情 - 睿芯云汇',
        description: '查看用户详细信息',
        keywords: '用户详情'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/userDetail.vue')
    },
    {
      path: '/loginLogList',
      name: 'loginLogList',
      meta: {
        title: '登录记录 - 睿芯云汇',
        description: '查看用户登录记录',
        keywords: '登录记录'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/loginLogList.vue')
    },
    {
      path: '/liveLog',
      name: 'liveLog',
      meta: {
        title: '直播记录 - 睿芯云汇',
        description: '查看直播历史记录',
        keywords: '直播记录'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/liveLog.vue')
    },
    {
      path: '/goodLog',
      name: 'goodLog',
      meta: {
        title: '兑换记录 - 睿芯云汇',
        description: '查看商品兑换记录',
        keywords: '兑换记录'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/goodLog.vue')
    },
    {
      path: '/userList',
      name: 'userList',
      meta: {
        title: '用户列表 - 睿芯云汇',
        description: '查看所有用户列表',
        keywords: '用户列表'
      },
      component: () => import(/* webpackChunkName: "about" */'@/views/serve/userList.vue')
    }
  ]

})
