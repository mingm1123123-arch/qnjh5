<template>
  <div class="main">
    <div class="tab" >
      <div :to="{ name: 'pub' }" @click="pubArticle"><div class="pub">发布</div></div>
<!--      <router-link :to="{ name: 'pub' }"><div class="pub">发布</div></router-link>-->
      <div class="nav">
        <div :class="navIndex == 1 ? 'nav_act' : ''" @click="navFun(1)">
          关注
          <i :class="navIndex == 1 ? 'act_i' : ''"></i>
        </div>
        <div :class="navIndex == 2 ? 'nav_act' : ''" @click="navFun(2)">
          推荐
          <i :class="navIndex == 2 ? 'act_i' : ''"></i>
        </div>

      </div>
      <router-link :to="{ name: 'follow' }">
        <div class="head_img"><van-icon name="user-circle-o" /></div>
      </router-link>

      <!-- 消息 -->
      <router-link v-if='orders>0' :to="{ name: 'news' }"><div class="radio_zhan">{{orders}}条新消息</div></router-link>
    </div>

    <!-- 列表 -->
    <div class="show_list" ref="backTop">

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
          <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
          <div class="box" v-for="(item, index) in list" :key="index">
            <div class="top" >
              <img :src="item.avatar" alt="" @click="backAlone(item)"/>
              <div class="name"  @click="back(item)">{{item.nickname}}</div>
              <div class="time"  @click="back(item)">{{item.createTime}}</div>
            </div>
            <div class="cen" @click="back(item)">
              <!-- 纯文字 -->
              <div class="txt">{{item.content}}</div>
              <!-- 图-->
<!--              <span class="imgs" v-for="(value, index) in item.images" :key="index"><img :src="value" alt="" :class="item.images.length > 1 ? 'imgMuch' : ''" /></span>-->
            </div>
            <div class="cen" >
              <van-uploader   :max-count="9" multiple accept="image/*" :show-upload="false" :readonly="true" :deletable="false" v-model="item.fileList" v-if="item.fileList && item.fileList.length > 0"/>
            </div>
            <div class="bot">
              <span @click="LikeOrCollectClick(0,item,index)" style="text-align:left;">
                <van-icon :name="(item.clickLike==true?'good-job':'good-job-o')" :style="{color:(item.clickLike==true?'#FBB041':'#888888')}"/>
                {{item.clickLikeCount}}
              </span>
              <span @click="LikeOrCollectClick(1,item,index)" style="text-align:left;">
                <van-icon :name="(item.collect==true?'like':'like-o')" :style="{color:(item.collect==true?'#FE5A49':'#888888')}"/>
                {{item.collectCount}}

              </span>
              <span  @click="back(item)" style="text-align:left;">
                <van-icon name="comment-o" />
                {{item.commentCount}}
              </span>

            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      // 顶部导航背景图片配置
      navIndex: 2,
      list: [],
      orders: 0, // 新消息
      loading: false,
      finished: false,
      refreshing: false,
      current: 1,
      active: 2,
      size: 8,
      UrlName: ''
    }
  },
  watch: {
    '$route' (to, from) {
      // from 对象中要 router 来源信息.
      // do your want
      // console.log(from.name)
      if (from.name) {
        this.UrlName = from.name
      }
    }
  },
  activated () {
    // console.log(this.UrlName)
    if (this.UrlName === 'pub') { // 从发布返回刷新页面数据
      this.onRefresh()
    }
    this.newNumber()
    document.querySelector('.show_list').scrollTop = this.scrollTop
  },
  mounted () {
    // console.log(123);
    // 滚动条的获取
    // window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {

    // 切换导航
    navFun (index) {
      var that = this
      that.navIndex = index

      that.finished = false
      that.current = 1
      that.onLoad()
    },
    // 获取新消息数量
    newNumber () {
      var that = this
      that.$axios.get(that.$api.getUnreadMsgCount)
        .then(res => {
        // console.log(res)
          if (res.data.code === 0) {
            that.orders = res.data.data
          // that.orders=3
          } else {

          }
        })
    },

    // 获取数据
    onLoad () {
      var that = this
      that.loading = true
      if (that.current === 1) {
        that.list = []
      }

      var data = {
        'current': that.current,
        'size': that.size
      }
      // 关注列表
      let url = ''
      if (that.navIndex === 1) {
        url = that.$api.pageByFollowed
      } else {
        url = that.$api.pageByRecommend
      }
      that.$axios.post(url, data)
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            if (res.data.data.records.length > 0) {
              for (let i = 0; i < res.data.data.records.length; i++) {
                if (res.data.data.records[i].images) {
                  var ArrIImg = res.data.data.records[i].images.split(',')
                  let objList = []
                  for (let j = 0; j < ArrIImg.length; j++) {
                    let obj = {
                      url: ArrIImg[j]
                    }
                    objList.push(obj)
                  }
                  res.data.data.records[i].fileList = objList
                  res.data.data.records[i].images = ArrIImg
                }
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
          that.loading = false// false表示加载结束
          that.refreshing = false// 刷新完成
        }).catch(res => {
          that.$toast.fail('访问出错，请稍后再试')
          that.finished = true
          that.$toast.fail('访问出错，请稍后再试')
          that.finished = true
        })
    },
    onRefresh () {
      var that = this
      // 清空列表数据
      that.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      that.loading = true
      that.current = 1
      that.onLoad()
      this.newNumber()
    },

    // 跳转详情面
    back (item) {
      this.$router.push({ name: 'details', query: { 'articleId': item.articleId } })
    },
    // 跳发布感悟
    pubArticle () {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
      if (isAndroid) {
        window.android.pubArticle('skip', '1')
      }
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isIOS) {
        window.webkit.messageHandlers.pubArticle.postMessage({'skip': '1'})
      }
    },
    // 跳转详情面
    backAlone (item) {
      this.$router.push({ name: 'aloneHome', query: { 'userId': item.userId } })
    },
    // 喜欢0+收藏1
    LikeOrCollectClick (type, item, index) {
      // console.log(type,item.clickLike,item.collect,index);
      var that = this
      let url = ''
      // 判断当前是选种状态
      if (type === 0) {
        if (item.clickLike === true) { // 已选中
          url = that.$api.cancelLikeOrCollect// 取消
        } else {
          url = that.$api.likeOrCollect
        }
      } else if (type === 1) {
        if (item.collect === true) { // 已选中
          url = that.$api.cancelLikeOrCollect// 取消
        } else {
          url = that.$api.likeOrCollect
        }
      }

      var data = {
        'articleId': item.articleId,
        'type': type
      }
      this.$axios.get(url, {params: data})
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            if (type === 0) {
              that.list[index].clickLikeCount = item.clickLike === true ? (Number(item.clickLikeCount) - 1 < 0 ? 0 : Number(item.clickLikeCount) - 1) : Number(item.clickLikeCount) + 1
              that.list[index].clickLike = !item.clickLike
            }
            if (type === 1) {
              that.list[index].collectCount = item.collect === true ? (Number(item.collectCount) - 1 < 0 ? 0 : Number(item.collectCount) - 1) : Number(item.collectCount) + 1
              that.list[index].collect = !item.collect
            }

            // console.log(that.list)
          } else {
            that.$toast.fail('操作失败，请稍后再试')
          }
        }).catch(res => {
          // console.log(res)
          that.$toast.fail('操作失败，请稍后再试')
        })
    }

  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log(to, from, document.querySelector('.show_list').scrollTop);
    this.scrollTop = document.querySelector('.show_list').scrollTop
    next()
  },
  beforeRouteEnter (to, from, next) {
    //  console.log(to)
    //  console.log(from)
    //  console.log(next)
    next()
  }

}
</script>

<style scoped lang="less">
.main {
  // width: 100%;
  // height: 100%;
  // overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.tab {
  width: 100%;
  height: 4rem;
  background: url(../assets/images/home.png) no-repeat center center;
  // padding-top: constant(safe-area-inset-top);
  // padding-top: env(safe-area-inset-top);
  div {
    float: left;
  }
  .pub,.nav,.head_img{
    margin-top:0.5rem ;
  }
  .pub {
    color: #4f8dff;
    font-size: 0.3rem;
    width: 1rem;
    height: 0.6rem;
    background: #fff;
    border-radius: 0.3rem;
    text-align: center;
    line-height: 0.6rem;
    margin-left: 0.3rem;
  }
  .nav {
    margin-left: 1.33rem;
    color: #d4d4d4;
    font-size: 0.36rem;

    div {
      margin-right: 0.8rem;
      height: 0.7rem;
      position: relative;
    }
    i {
      display: none;
    }
    .nav_act {
      color: #fff;
      font-weight: bold;
    }
    .act_i {
      display: block;
      position: absolute;
      bottom: 0rem;
      left: 0.05rem;
      z-index: 1;
      width: 30px;
      height: 2px;
      background-color: #fff;
      border-radius: 3px;
    }
  }

  .head_img {
    float: right;
    margin-right: 0.3rem;
    font-size: 0.5rem;
    color: #fff;
  }
}
.radio_zhan {
  width: 2.6rem;
  height: 0.7rem;
  background: #fff;
  margin-top: 1rem;
  border-radius: 0.1rem;
  font-size: 0.3rem;
  color: #ff1800;
  text-align: center;
  line-height: 0.7rem;
  margin: 0.25rem 0 0.25rem 2.45rem;
}
.show_list {
  // padding-top:1rem;
  border-top-left-radius: 0.8rem;
  border-top-right-radius: 0.8rem;
  width: 100%;
  height: ~'calc(100vh - 1.5rem )';
  background: #fff;
  margin-top: -2.5rem;
  overflow: auto;

  .box {
    height: auto;
    margin: 0.3rem 0.3rem 0 0.3rem;
    // background: pink;

    .top {
      width: 100%;
      height: 1rem;
      margin-top: 0.4rem;
      img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        float: left;
        object-fit: cover;
      }
      div {
        width: ~'calc(100vw - 2rem )';
        float: left;
        margin-left: 0.2rem;
        text-align: left;
      }
      .name {
        color: #333333;
        font-size: 0.36rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
      }
      .time {
        color: #888;
        font-size: 0.28rem;
      }
    }
    .cen {
      width: 5.6rem;
      margin-left: 1.1rem;
      text-align: left;

      .txt {
        color: #333333;
        font-size: 0.32rem;
        line-height: 0.45rem;
        text-align: justify;
        margin-bottom: 0.2rem;
      }
      .imgs {
        width: 100%;
        height: auto;

        img {
          width: 5.6rem;
          height: 2.7rem;
          border-radius: 0.2rem;
          margin-left: 0.1rem;
          object-fit: cover;
        }
        .imgMuch {
          width: 1.75rem;
          height: 1.75rem;
          // margin-right:0.1rem ;
        }
      }
    }
    .bot {
      width: 5.6rem;
      color: #888888;
      font-size: 0.26rem;
      border-bottom: 1px #dcdcdc solid;
      margin-left: 1.1rem;
      padding: 0.24rem 0;
      display: flex;
      span {
        flex: 1;
        margin-right:0.3rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .van-icon {
          font-size: 0.36rem;
          padding-right: 0.1rem;
          vertical-align: text-bottom;
          font-weight: bold;
        }
      }
    }
  }
}

</style>
