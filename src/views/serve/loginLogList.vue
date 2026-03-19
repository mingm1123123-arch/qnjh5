<template>
  <div class="main">
    <div class="content">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        success-text="刷新成功"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getList"
        >
          <div class="goods-item" v-for="item in dataList" :key="item.id">
            <van-cell title="手机号:" :value="userInfo.phone" />
            <van-cell title="昵称:" :value="userInfo.realname" />
            <van-cell title="头像:"  style="height: 110px;">
              <template #icon>
                <van-image
                  width="100"
                  height="100"
                  :src="userInfo.avatar"
                  style="position: absolute ;right: 0;"
                />
              </template>
            </van-cell>
            <van-cell title="登录时间:" :value="item.createTime" />
            <van-cell title="IP:" :value="item.ip" />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {Dialog, Toast} from 'vant'
import {data} from 'autoprefixer'
export default {
  data () {
    return {
      loading: false, // 加载状态
      finished: false, // 没有更多
      refreshing: false, // 下拉刷新
      dataList: [],
      pageSize: 10,
      userInfo: {},
      pageNo: 1,
      searchParam: {
        phone: '',
        realname: '',
        status: '',
        appIsLogin: '',
        webIsLogin: '',
        webStatus: ''
      }
    }
  },
  mounted () {
    // alert('我刷新了')
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getUserInfo(this.id)
    } else {
      this.$toast.fail('请稍后再试')
    }
  },
  methods: {
    // 加载数据
    getUserInfo (id) {
      var that = this
      that.$axios.post(that.$api.getUserInfo, {'id': id})
        .then(res => {
          let obj = res.data.result

          if (obj.status === 1) {
            obj.status_dictText = '正常'
          } else if (obj.status === 2) {
            obj.status_dictText = '冻结'
          }
          if (obj.webStatus === 1) {
            obj.webStatus_dictText = '正常'
          } else if (obj.webStatus === 2) {
            obj.webStatus_dictText = '冻结'
          }
          if (obj.appIsLogin === '1') {
            obj.appIsLogin_dictText = '是'
          } else {
            obj.appIsLogin_dictText = '否'
          }
          if (obj.webIsLogin === '1') {
            obj.webIsLogin_dictText = '是'
          } else {
            obj.webIsLogin_dictText = '否'
          }
          that.userInfo = obj
        }).catch(res => {
        })
    },
    // 下拉刷新
    onRefresh () {
      var that = this
      that.finished = true
      // 清空列表数据
      that.dataList = []
      that.pageNo = 1
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      that.loading = true
      that.getLiveLogList()
    },
    getList () {
      setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        this.getLiveLogList()
      }, 400)
    },
    goToSeeDetail (id) {
      this.$router.push({
        path: '/userDetail',
        query: {
          id: id
        }
      })
    },
    getLiveLogList () {
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      let params = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        logType: '1',
        userid: that.id
      }
      that.$axios.get(that.$api.loginLogList, {params: params}).then(res => {
        if (res.data.code === 0) {
          let data = res.data.result.records || []
          if (data.length > 0) {
            if (that.dataList.length === 0) {
              that.dataList = data
            } else {
              that.dataList = that.dataList.concat(data)
            }
            if (data.length === that.pageSize) {
              that.pageNo++
            } else {
              that.finished = true
            }
          } else {
            that.finished = true
          }
          Toast.clear()
        } else {
          Toast.loading({
            message: '查询失败',
            forbidClick: true,
            dduration: 3000
          })
          that.finished = true
        }
        that.loading = false// false表示加载结束
        that.refreshing = false// 刷新完成
      }).catch(res => {
        that.loading = false// false表示加载结束
        that.refreshing = false// 刷新完成
        that.finished = true
        Toast.clear()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .content {
    .van-list {
      padding: 0.1rem;
      height: calc(100vh);
      box-sizing: border-box;
      overflow: auto;
    }
    .goods-item {
      border: 1px solid #eee;
      margin-bottom: 0.2rem;
      border-radius: 0.1rem;
    }
  }
}
.myintegral{
display: flex;
  justify-content:center;
  margin-top: 0.4rem;

}
</style>
