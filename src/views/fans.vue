<template>
     <div class="main">
      <!-- <div style="width:100%;height:1rem;background:rgb(79, 141, 255);font-size: 25px;position: fixed;top: 0;z-index: 999;">
        <router-link to style="color: #fff !important;"><van-icon name="arrow-left" @click="$router.back(-1)" style='margin:0.2rem 0 0.1rem 0.2rem;'/></router-link>
      </div> -->
    <div class="tab" >
      <div class="nav">
        <div  @click="navFun(1)">
          关注
          <i></i>
        </div>
        <div class="nav_act">
          粉丝
          <i class="act_i"></i>
        </div>
      </div>
    </div>

    <div class="listbox">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
             <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
               <van-row class="box" v-for="(item,index) in list" :key="index">
                 <van-col span="18">
                   <div class="top" @click="backAlone(item)">
                     <van-col span="4">
                       <img :src="item.avatar" alt="" />
                     </van-col>
                     <van-col span="16">
                       <div class="name">{{item.nickname}}</div>
                     </van-col>
                   </div>
                 </van-col>
                 <van-col span="6">
                   <div class="cen">
                     <!-- 纯文字 -->
                     <div class="txt"  @click="addFollowClick(item.userId,index,item.eachOtherFollow)">{{item.isFollow}}</div>
                   </div>
                 </van-col>
               </van-row>
            </van-list>
        </van-pull-refresh>
    </div>

     </div>
</template>
<script>
export default {
  data () {
    return {
      navIndex: 1,
      list: [],

      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      size: 15
    }
  },
  methods: {
    // 切换导航
    navFun (index) {
      this.$router.push({ name: 'follow' })
    },
    // 加载数据
    onLoad () {
      var that = this
      that.loading = true
      if (that.current === 1) {
        that.list = []
        window.scrollTo(0, 0)
      }
      var data = {
        'current': that.current,
        'size': that.size
      }
      that.$axios.post(that.$api.getFansPage, data)
        .then(res => {
          // console.log(res)
          that.loading = false// false表示加载结束
          that.refreshing = false// 刷新完成
          if (res.data.code === 0) {
            if (res.data.data.records.length > 0) {
              for (let i = 0; i < res.data.data.records.length; i++) {
                that.list.push(res.data.data.records[i])
              }
              if (res.data.data.records.length === that.size) {
                that.current++
              } else {
                that.finished = true// 是否已加载完成，加载完成后不再触发load事件
              }
            } else {
              that.finished = true// 是否已加载完成，加载完成后不再触发load事件
            }
          } else {
            that.$toast.fail('访问出错，请稍后再试')
            that.finished = true
          }
        }).catch(res => {
          that.$toast.fail('访问出错，请稍后再试')
          that.finished = true
        })
    },
    // 跳转详情面
    backAlone (item) {
      this.$router.push({ name: 'aloneHome', query: { 'userId': item.userId } })
    },
    // 下拉刷新
    onRefresh () {
      var that = this
      // 清空列表数据
      that.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      that.loading = true
      that.current = 1
      that.onLoad()
    },
    // 点击关注
    addFollowClick (userId, index, eachOtherFollow) {
      var that = this
      // var item = that.list
      //  console.log(userId,index);
      let url = ''
      if (eachOtherFollow) { // 互相关注，已关注
        url = that.$api.unFollow// 取消关注
      } else { // 回关
        url = that.$api.addFollow// 关注
      }
      var data = {
        'followedId': userId
      }
      that.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '加载中...',
        forbidClick: true
      })
      this.$axios.get(url, {params: data})
        .then(res => {
          that.$toast.clear()
          if (res.data.code === 0) {
            that.$toast.success('操作成功')
            // setTimeout(() => {
            //   that.onRefresh()
            // }, 1000)
            that.list[index].eachOtherFollow = !that.list[index].eachOtherFollow
            if (that.list[index].eachOtherFollow) {
              that.list[index].isFollow = '互相关注'
            } else {
              that.list[index].isFollow = '回关'
            }
          } else {
            that.$toast.fail('操作失败，请稍后再试')
          }
        }).catch(res => {
          that.$toast.clear()
          that.$toast.fail('操作失败，请稍后再试')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.main{
    background: #fff;
    width:100%;
    min-height: 100vh;
    // padding-top: 0.2rem;
    padding-bottom:1rem ;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.listbox{
    width: 100%;
    height: ~'calc(100vh - 0.86rem )' ;
    margin:0.86rem 0 1rem 0 ;
}
.tab {
  width: 100%;
  height: 0.86rem;
  background: #fff;
  position: fixed;
  top:0rem;
  z-index:999;
  border-bottom: 1px #d6d6d6 solid;
  .nav {
    width: 100%;
    color: #666666;
    display: flex;
    text-align: center;
    div {
      flex:1;
      line-height:0.86rem ;
      height: 0.86rem;
      position: relative;
      font-size: 0.36rem;
    }
    i {
      display: none;
    }
    .nav_act {
      color: #4F8DFF;
      font-weight: bold;
    }
    .act_i {
      display: block;
      position: absolute;
      bottom: 0rem;
      left: 50%;
      margin-left: -.25rem;
      z-index: 1;
      width: .5rem;
      height: 2px;
      background-color: #4F8DFF;
      border-radius: 3px;
    }
  }
}
.box{
    width: 7.1rem;
    height: 1.6rem;
    margin:0rem  0.2rem 0rem 0.2rem;
    background: #fff;
    border-radius: 0.2rem;
    border-bottom: 1px #ccc solid;
    .top{
        //float: left;
        //width:4.5rem;
        height: 1rem;
        margin-top: 0.4rem;
        margin-left: 0.2rem;
        img{
            width:0.9rem;
            height: 0.9rem;
            border-radius: 50%;
            float: left;
            object-fit: cover;
        }
        div{
            //width: ~'calc(100vw - 5rem )';
            //float: left;
            margin-left: 0.2rem;
            text-align: left;

        }
        .name{
            color:#333333;
            font-size: 0.28rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 0.9rem;
            font-weight: bold;
        }
    }
    .cen{
        //float: right;
        width:1.6rem;
        height:0.6rem;
        margin:0.5rem 0.2rem 0.5rem 0.2rem;
        text-align: left;
        box-sizing: border-box;
        .txt{

            width:1.6rem;
            height:0.6rem;
            color: #888888;
            font-size: .3rem;
            background: #fff;
            border: #888888 solid 1px;
            border-radius: 0.32rem;
            line-height: .6rem;
            text-align: center;
             box-sizing: border-box;

        }
        img{
            width:1.2rem;
            height:1.2rem;
            border-radius: 0.2rem;
        }
    }

    .bot{
    width:5.6rem;
    color: #888888;
    font-size: .26rem;
    border-bottom:1px #dcdcdc solid;
    margin-left:1.1rem ;
    padding:.24rem 0;
    display: flex;
    span{
        flex: 1;
        .van-icon{
        font-size: .36rem;
        padding-right:0.1rem ;
        vertical-align: text-bottom;
        font-weight: bold;
        }
    }
        span:first-child{
        text-align: left;
    }
    span:last-child{
        text-align: right;
    }

    }

}
</style>
