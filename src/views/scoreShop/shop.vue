<template>
  <div class="main">
    <div class="content">
      <van-sidebar v-model="activeKey" @change="changeTabbar">
        <van-sidebar-item :title="item.name" v-for="item in tabList" :key="item.id"/>
      </van-sidebar>
      <div class="goods-list" ref="Glist">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList">
            <div class="goods-item" v-for="item in dataList" @click="toDetail(item)" :key="item.id">
              <van-image
                  class="goods-img"
                  fit="contain"
                  :src="item.imageList[0]"
              />
              <div class="goods-name">{{item.name}}</div>
              <div class="goods-info">
                  <div class="need-score">所需积分: <span class="score">{{item.integral}}</span></div>
                  <van-button type="primary" size="small" round  color="#ee0a24" @click.stop="toBuy(item)">立即兑换</van-button>
              </div>
          </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Notify, Toast } from 'vant'
export default {
  data () {
    return {
      activeKey: 0,
      loading: false, // 加载状态
      finished: false, // 没有更多
      refreshing: false, // 下拉刷新
      tabList: [],
      dataList: []
    }
  },
  created () {
    var that = this
    that.$axios.get(that.$api.getMallClassIndex).then(res => {
      that.tabList = res.data.result
      that.getList()
    }).catch(res => {
    })
  },
  methods: {
    // 下拉刷新
    onRefresh () {
      var that = this
      that.finished = true
      // 清空列表数据
      that.dataList = []
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      that.loading = true
      that.getList()
    },
    changeTabbar (index) {
      this.getList()
      this.$refs.Glist.scrollTop = 0
    },
    getList () {
      setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        Toast.loading({
          message: '加载中...',
          forbidClick: true
        })
        this.getGoodsList()
      }, 400)
    },
    getGoodsList () {
      var that = this
      if (!that.tabList[that.activeKey].id) {
        return
      }
      that.$axios.post(that.$api.getMallGoodList, {classId: that.tabList[that.activeKey].id}).then(res => {
        if (res.data.result) {
          res.data.result.map(item => {
            item.imageList = item.images.split(',')
          })
        }
        this.dataList = res.data.result
        this.finished = true
        Toast.clear()
      }).catch(res => {
        Toast.clear()
      })
    },
    toDetail (item) {
      this.$router.push({ name: 'goodsDetail', query: { 'goodId': item.id } })
    },
    toBuy (item) {
      Dialog.confirm({
        title: ' ',
        message: '确认是否兑换?'
      })
        .then(() => {
        // on confirm
          this.comfirmBuy(item.id)
        })
        .catch(() => {
        // on cancel
        })
    },
    comfirmBuy (goodId) {
      var that = this
      that.$axios.post(that.$api.buyGoodById, {goodId: goodId}).then(res => {
        if (res.data.code === 200 && res.data.success) {
          // Notify({ type: 'success', message: '兑换成功' });
          Dialog.alert({
            message: '恭喜您 ，兑换成功。收货地址联系客服或者师兄姐'
          })
        } else {
          // Notify({ type: 'danger', message: res.data.message });
          Dialog.alert({
            message: res.data.message
          })
        }
      }).catch(res => {
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
      display: flex;
      .van-sidebar{
        overflow: auto;
        height: calc(100vh);
      }
    .goods-list {
      flex: 1;
      padding: 0.1rem;
      height: calc(100vh);
      overflow: scroll;
      box-sizing: border-box;
      .goods-item {
          padding: 0.1rem;
          margin-bottom: 0.2rem;
          border: 1px solid #eee;
          border-radius: 0.1rem;
          .goods-img{
              width: 100%;
              height: 3rem;
          }
          .goods-name{
              font-size: 0.26rem;
              margin: 0.1rem 0;
          }
          .goods-info{
              display: flex;
              justify-content: space-between;
              align-items: center;
              .need-score{
                  .score{
                      color: #ee0a24;
                      font-size: 0.32rem;
                      font-weight: 600;
                  }
              }
          }
      }
    }
  }
}
</style>
