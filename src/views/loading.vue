<template>
     <div class="main">
       <van-loading  size="24px">加载中...</van-loading>
     </div>
</template>

<script>
import {Toast} from 'vant'

export default {
  data () {
    return {
    }
  },
  mounted () {
    var that = this
    if (that.$route.query.token) {
      sessionStorage.setItem('token', that.$route.query.token)
    }
    if (that.$route.query.pagepath === 'richText') { // 富文本
      window.location.href = window.location.origin + '/#/richText?id=' + that.$route.query.id + '&type=' + that.$route.query.type
    } else if (that.$route.query.pagepath === 'downloadApp') { // 富文本
      window.location.href = window.location.origin + '/#/downloadApp'
    } else if (that.$route.query.pagepath === 'userManager') {
      that.$axios.get(that.$api.selectUserType).then(res => {
        if (res.data.code === 200) {
          if (res.data.result === '1') {
            window.location.href = window.location.origin + '/#/userManager'
          } else {
            window.location.href = window.location.origin + '/#/userList'
          }
        } else {
          Toast.fail({
            message: res.data.message || '暂无权限',
            forbidClick: true
          });
          // 如果无权限，可以跳转到首页或其他页面
          setTimeout(() => {
            window.location.href = window.location.origin + '/#/'
          }, 1500);
        }
      }).catch(err => {
        console.error('获取用户类型失败:', err);
        Toast.fail({
          message: '网络请求失败，请稍后重试',
          forbidClick: true
        });
        // 请求失败时跳转到首页
        setTimeout(() => {
          window.location.href = window.location.origin + '/#/'
        }, 1500);
      })
    } else { // 首页
      window.location.href = window.location.origin + '/#/' + that.$route.query.pagepath
    }
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  .main{
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .van-loading{
      margin-top:4rem ;
    }
  }
</style>
