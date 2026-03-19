<template>
  <div class="main">
    <div style="position: fixed;z-index: 1;top:0.1rem" @click.stop="goBack">
      <van-icon name="arrow-left" size="26"/>
    </div>
    <div class="content">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(image, index) in imageList" :key="index">
          <van-image class="goods-img" fit="contain" :src="image" />
        </van-swipe-item>
      </van-swipe>
      <div class="goods-info">
        <div class="goods-name">{{goodsInfo.name}}</div>
        <div class="goods-tips">
          <div class="need-score">所需积分：<span class="score">{{goodsInfo.integral}}</span></div>
          <div class="need-score">数量：<span class="num">
            {{goodsInfo.residueNum}}</span></div>
        </div>
      </div>
      <div class="goods-detail">
          <div class="introduce">商品简介</div>
          <div v-html="goodsInfo.introduce"></div>
      </div>
      <van-button type="primary" size="normal" color="#ee0a24" class="buy-btn" @click.stop="toBuy">立即兑换</van-button>
    </div>
  </div>
</template>

<script>
import { Dialog, Notify, Toast } from 'vant';
import { set } from 'vue';
export default {
  data() {
    return {
      goodId:'',
      imageList: [
        "https://img.yzcdn.cn/vant/apple-1.jpg",
        "https://img.yzcdn.cn/vant/apple-2.jpg",
      ],
      goodsInfo:{

      }
    };
  },
  mounted() {
    this.goodId = this.$route.query.goodId
    this.getGoodsDetail()
  },
  methods: {
    getGoodsDetail(){
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      that.$axios.post(that.$api.getMallGoodById,{id:that.goodId}).then(res => {
        this.goodsInfo = res.data.result
        this.imageList = this.goodsInfo.images.split(',')
        Toast.clear()
        setTimeout(() => {
          let imgs = document.querySelectorAll('.goods-detail img')
          for (let index = 0; index < imgs.length; index++) {
            imgs[index].style.width = '100%'
            imgs[index].style.height = 'auto'
          }
        }, 20);
      }).catch(res => {
        Toast.clear()
      })
    },
    toBuy(){
      Dialog.confirm({
        title: ' ',
        message: '确认是否兑换?',
      })
      .then(() => {
        // on confirm
        this.comfirmBuy()
      })
      .catch(() => {
        // on cancel
      });
    },
    comfirmBuy(){
      var that = this
      that.$axios.post(that.$api.buyGoodById,{goodId:that.goodId}).then(res => {
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
    },
    goBack(){
      this.$router.go(-1)
    }
  },
};
</script>
<style lang="less" scoped>
.main {
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .content {
      padding-bottom: 1rem;
      .van-swipe{
          .goods-img{
              width: 100%;
              height: 5rem;
          }
      }
    .goods-info {
        padding: 0.1rem;
      .goods-name {
          margin: 0.1rem 0;
          font-size: 0.3rem;
      }
      .goods-tips {
          display: flex;
          justify-content: space-between;
          .need-score{
              .score{
                color: #ee0a24;
                font-size: 0.32rem;
                font-weight: 600;
            }
          }
      }
    }
    .goods-detail{
        padding: 0.2rem;
        .introduce{
            text-align: center;
            font-size: 0.32rem;
            font-weight: 600;
        }
    }
    .buy-btn{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }
  }
}
</style>
