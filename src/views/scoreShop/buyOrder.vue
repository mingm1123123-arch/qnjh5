<template>
  <div class="main">
    <div class="myintegral">
      <span>我的积分：</span>
      <span>{{integral}}</span>
    </div>
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
            <van-cell title="商品名称:" :value="item.name" />
            <van-cell title="订单编号:" :value="item.id" />
            <van-cell title="兑换积分:" :value="item.integral" />
            <van-cell title="兑换状态:" :value="item.status_dictText" />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {Dialog, Toast} from 'vant'
export default {
  data () {
    return {
      loading: false, // 加载状态
      finished: false, // 没有更多
      refreshing: false, // 下拉刷新
      dataList: [],
      pageSize: 10,
      pageNo: 1,
      integral: 0
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
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
      that.getList()
      that.getUserInfo()
    },
    getList () {
      setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        this.getGoodsList()
      }, 400)
    },
    getUserInfo () {
      var that = this
      that.$axios.get(that.$api.getUserData).then(res => {
        if (res.data.code === 200 && res.data.success && res.data.result && res.data.result.integral) {
          that.integral = res.data.result.integral
        }
      }).catch(res => {
      })
    },
    getGoodsList () {
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      that.$axios.post(that.$api.orderList, {pageNo: that.pageNo, pageSize: that.pageSize}).then(res => {
        if (res.data.code === 200) {
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
        } else {
          that.finished = true
        }
        that.loading = false// false表示加载结束
        that.refreshing = false// 刷新完成
        Toast.clear()
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
