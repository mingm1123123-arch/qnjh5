<template>
  <div class="main">
    <!-- <div style="width:100%;height:1rem;background:rgb(79, 141, 255);font-size: 25px;position: fixed;top: 0;z-index: 999;">
      <router-link to style="color: #fff !important;"><van-icon name="arrow-left" @click="$router.back(-1)" style='margin:0.2rem 0 0.1rem 0.2rem;'/></router-link>
    </div> -->
    <!-- 列表 -->
    <div class="show_list" ref="backTop">
      <div class="topRig" v-if='!aloneHomeRes.isFollow'>
        <div @click="addFollowClick()">关注 <van-icon name="plus" /></div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
          <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
          <div class="box" v-for="(item, index) in list" :key="index">
            <div class="top" @click="back(item)">
              <img :src="avatar" alt="" />
              <div class="name">{{nickname}}</div>
              <div class="time">{{item.createTime}}</div>
            </div>
            <div class="cen" >
              <!-- 纯文字 -->
              <div class="txt" @click="back(item)">{{item.content}}</div>
              <!-- 图-->
<!--              <span class="imgs" v-for="(value, index) in item.images" :key="index"><img :src="value" alt="" :class="item.images.length > 1 ? 'imgMuch' : ''" /></span>-->
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
      userId: '',
      avatar: '',
      nickname: '',
      UrlName: '',
      aloneHomeRes: ''
    }
  },
  watch: {
    '$route' (to, from) {
      // from 对象中要 router 来源信息.
      // do your want
      console.log(from)
      if (from.name) {
        this.UrlName = from.name
      }
    }
  },
  activated () {
    this.userId = this.$route.query.userId
    this.onRefresh()
    this.getFollowStatus()
    document.querySelector('.show_list').scrollTop = this.scrollTop
  },
  methods: {
    // 获取数据
    onLoad () {
      var that = this
      that.loading = true
      if (that.current === 1) {
        that.list = []
      }

      var data = {
        'current': that.current,
        'size': 10,
        'userId': that.userId
      }
      that.$axios.post(that.$api.articlePageByUserId, data)
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            that.avatar = res.data.data.avatar
            that.nickname = res.data.data.nickname
            var articlePageRes = res.data.data.articlePageRes
            if (!articlePageRes) {
              that.finished = true// 是否已加载完成，加载完成后不再触发load事件
              return false
            }
            if (articlePageRes.records.length > 0) {
              for (let i = 0; i < articlePageRes.records.length; i++) {
                if (articlePageRes.records[i].images) {
                  var ArrIImg = articlePageRes.records[i].images.split(',')
                  articlePageRes.records[i].images = ArrIImg
                  let fileList = []
                  for (let i = 0; i < ArrIImg.length; i++) {
                    let obj = {
                      url: ArrIImg[i]
                    }
                    fileList.push(obj)
                  }
                  articlePageRes.records[i].fileList = fileList
                }
                that.list.push(articlePageRes.records[i])
              }
              if (articlePageRes.records.length === 10) {
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
    },
    // 点击关注
    getFollowStatus () {
      var that = this
      let url = that.$api.selectFollowStatus // 关注
      var data = {
        'userId': that.userId
      }
      this.$axios.get(url, {params: data})
        .then(res => {
          if (res.data.code === 0) {
            that.aloneHomeRes = res.data.data
          }
        })
    },
    // 点击关注
    addFollowClick () {
      var that = this
      let url = that.$api.addFollow// 关注

      var data = {
        'followedId': that.userId
      }
      this.$axios.get(url, {params: data})
        .then(res => {
          if (res.data.code === 0) {
            that.$toast.success('关注成功')
            that.aloneHomeRes.isFollow = true
          } else {
            that.$toast.fail('关注失败，请稍后再试')
          }
        }).catch(res => {
          that.$toast.fail('关注失败，请稍后再试')
        })
    },
    // 跳转详情面
    back (item) {
      this.$router.push({ name: 'details', query: { 'articleId': item.articleId } })
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.topRig{
  height: 0.55rem;
  text-align: right;
  margin-top: 0.4rem;
  padding-right: 0.2rem;
  div{
    display: inline-block;
    width:1.4rem;
    height: 0.55rem;
    background: #4F8DFF;
    color:#fff;
    font-size: 0.3rem;
    text-align: center;
    line-height: 0.55rem;
    border-radius: 0.3rem;
  }
}
.tab {
  width: 100%;
  height: 3.5rem;
  background: url(../assets/images/home.png) no-repeat center center;
  padding-top: 0.5rem;
  div {
    float: left;
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
  // margin-top:1rem;
  width: 100%;
  // height: ~'calc(100vh - 3rem )';
  height: 100%;
  background: #fff;
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
