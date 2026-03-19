<template>
  <div class="main">

    <!-- <div style="width:100%;height:1rem;background:rgb(79, 141, 255);font-size: 25px;position: fixed;top: 0;z-index: 999;">
      <router-link to style="color: #fff !important;"><van-icon name="arrow-left" @click="$router.back(-1)" style='margin:0.2rem 0 0.1rem 0.2rem;'/></router-link>
    </div> -->
        <!-- 列表 -->
        <div class="show_list"  >
            <div class="box">
                 <div class="topRig" v-if='!list.isFollow && (list.currentUserId!=list.userId)'>
                    <div @click="addFollowClick(list.userId)">关注 <van-icon name="plus" /></div>
                  </div>
                  <div class="top">
                      <img :src="list.avatar" alt="" />
                      <div class="name">{{list.nickname}}</div>
                      <div class="time">{{list.createTime}}</div>
                  </div>

                  <div class="cen">
                      <!-- 纯文字 -->
                      <div class="txt">{{list.content}}</div>
                      <!-- 图-->
<!--                      <span class="imgs" v-for="(value, index) in list.images" :key="index"><img :src="value" alt="" :class="list.images.length > 1 ? 'imgMuch' : ''" /></span>-->
                    <van-uploader   :max-count="9" multiple accept="image/*" :show-upload="false" :readonly="true" :deletable="false" v-model="list.fileList" v-if="list.fileList && list.fileList.length > 0"/>
                  </div>
                   <div class="bot">
                      <span @click="LikeOrCollectClick(0)" style="text-align:left;">
                        <van-icon :name="(list.clickLike==true?'good-job':'good-job-o')" :style="{color:(list.clickLike==true?'#FBB041':'#888888')}"/>
                        {{list.clickLikeCount}}
                      </span>
                      <span @click="LikeOrCollectClick(1)" style="text-align:left;">
                        <van-icon :name="(list.collect==true?'like':'like-o')" :style="{color:(list.collect==true?'#FE5A49':'#888888')}"/>
                        {{list.collectCount}}
                      </span>
                      <span   style="text-align:left;">
                        <van-icon name="comment-o" />
                        {{list.commentCount}}
                      </span>
                    </div>
            </div>
          <!-- 列表 -->
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoadCommont" >
              <div class="show_list1"  >
                <div class="box2" v-for="( item , index ) in parentArr" :key="index" :title="index" >
                  <div class="lef" @click="commentClick(item,index)">
                    <img :src="item.avatar" alt="" />
                  </div>
                  <div class="rig" @click="commentClick(item,index)">
                    <div class="name">{{item.nickname}}</div>
                    <div class="txt">{{item.content}}</div>
                    <div class="time">{{item.createTime}}</div>
                  </div>
                  <template v-for="( sonitem , sonindex ) in item.sonArr" >
                    <div class="huifu" :key="sonindex" :title="sonindex" @click="commentClickClear()">
                      <div class="lef">
                        <img :src="sonitem.avatar" alt="" />
                      </div>
                      <div class="rig">
                        <div class="name">{{sonitem.nickname}}</div>
                        <div class="txt">{{sonitem.content}}</div>
                        <div class="time">{{sonitem.createTime}}</div>
                      </div>
                    </div>
                  </template>
                </div>

              </div>
            </van-list>
          </van-pull-refresh>

        </div>

        <div class="detailspingl">
                <van-cell-group>
                  <van-field class="inp" v-model="pingvalue"  :placeholder="placeTxt" />
                </van-cell-group>
                <van-button class="btn" round type="info" @click="onuserActorComment()">发送</van-button>
        </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      navIndex: 1,
      list: '',
      parentArr: [],
      sonArr: [],
      pingvalue: '', // 回复评论
      articleId: '',
      commentId: '',
      size: 15,
      loading: false,
      finished: false,
      refreshing: false,
      parentId: '',
      parentIndex: '',
      placeTxt: '友善评论，文明发言'
    }
  },
  created () {
    this.articleId = this.$route.query.articleId
    this.onLoad(this.$route.query.articleId)
    // this.getCommentList(this.$route.query.articleId)
  },
  methods: {
    // 切换导航
    navFun (index) {
      // console.log(index)
      this.navIndex = index
    },
    onLoad (articleId) {
      var that = this
      var data = {
        articleId: articleId || that.articleId
      }
      that.$axios.get(that.$api.getArticleDetail, {params: data})
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            var data = res.data.data
            if (data.images) {
              let imagesArr = data.images.split(',')
              let fileList = []
              for (let i = 0; i < imagesArr.length; i++) {
                let obj = {
                  url: imagesArr[i]
                }
                fileList.push(obj)
              }
              data.fileList = fileList
            }
            that.list = data
          } else {
            that.$toast.fail('访问出错，请稍后再试1')
          }
        })
    },
    getCommentList () {
      var that = this
      var data = {
        articleId: that.articleId,
        commentId: that.commentId,
        size: that.size
      }
      that.$axios.post(that.$api.getArticleComment, data)
        .then(res => {
          that.loading = false
          that.refreshing = false
          if (res.data.code === 0) {
            let data = res.data.data
            if (data.length > 0) {
              that.commentId = data[data.length - 1].id
              if (that.parentArr.length === 0) {
                that.parentArr = data
              } else {
                that.parentArr = that.parentArr.concat(data)
              }
              if (data.length === that.size) {
                that.finished = false
              } else {
                that.finished = true
              }
            } else {
              that.finished = true
            }
          } else {
            that.finished = true
            that.$toast.fail('访问出错，请稍后再试')
          }
        }).catch(error => {
          console.log('请求出错：' + JSON.stringify(error))
          that.$toast.fail('访问出错，请稍后再试')
          that.loading = false// false表示加载结束
          that.refreshing = false// 刷新完成
          that.finished = true
        })
    },
    commentClickClear () {
      // console.log(item)
      this.parentId = ''
      this.parentIndex = ''
      this.placeTxt = '友善评论，文明发言'
    },
    // 选择回复人
    commentClick (item, index) {
      // console.log(item)
      this.parentId = item.id
      this.parentIndex = index
      this.placeTxt = '回复' + item.nickname
    },
    // 发表评论
    onuserActorComment () {
      var that = this
      if (!that.pingvalue) {
        return
      }
      var data = {
        content: that.pingvalue, // 评论内容
        articleId: that.articleId, // 文章ID
        parentId: that.parentId
      }
      that.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '评论中...',
        forbidClick: true
      })
      that.$axios.post(that.$api.tcomment, data)
        .then(res => {
          that.$toast.clear()
          if (res.data.code === 0) {
            that.list.commentCount += 1
            that.$toast.success('评论成功')
            if (res.data.data.parentId) {
              console.log('返回的结果为：' + JSON.stringify(res.data))
              if (that.parentArr[that.parentIndex].sonArr) {
                that.parentArr[that.parentIndex].sonArr.push(res.data.data)
              } else {
                let sonArr = []
                sonArr.push(res.data.data)
                that.parentArr[that.parentIndex].sonArr = sonArr
              }
            } else {
              that.parentArr.unshift(res.data.data)
              setTimeout(() => {
                window.scrollTo(0, 0)
              }, 100)
            }
            that.pingvalue = ''
            that.parentId = ''
            that.parentIndex = ''
            that.placeTxt = '友善评论，文明发言'
          } else {
            that.$toast.fail('评论出错，请稍后再试')
          }
        }).catch(res => {
          that.$toast.clear()
          that.$toast.fail('评论出错，请稍后再试')
        })
    },
    // 喜欢0+收藏1
    LikeOrCollectClick (type) {
      var that = this
      var item = that.list
      let url = ''
      // console.log(type,item.clickLike,item.collect);
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
        'articleId': that.articleId,
        'type': type
      }
      this.$axios.get(url, {params: data})
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            if (type === 0) {
              that.list.clickLikeCount = item.clickLike === true ? (Number(item.clickLikeCount) - 1 < 0 ? 0 : Number(item.clickLikeCount) - 1) : Number(item.clickLikeCount) + 1
              that.list.clickLike = !item.clickLike
            }
            if (type === 1) {
              that.list.collectCount = item.collect === true ? (Number(item.collectCount) - 1 < 0 ? 0 : Number(item.collectCount) - 1) : Number(item.collectCount) + 1
              that.list.collect = !item.collect
            }

            // console.log(that.list)
          } else {
            that.$toast.fail('操作失败，请稍后再试')
          }
        }).catch(res => {
          // console.log(res)
          that.$toast.fail('操作失败，请稍后再试')
        })
    },
    // 点击关注
    addFollowClick (userId) {
      var that = this
      let url = that.$api.addFollow// 关注

      var data = {
        'followedId': userId
      }
      this.$axios.get(url, {params: data})
        .then(res => {
          if (res.data.code === 0) {
            that.$toast.success('关注成功')
            setTimeout(() => {
              that.onLoad()
            }, 1000)
          } else {
            that.$toast.fail('关注失败，请稍后再试')
          }
        }).catch(res => {
          that.$toast.fail('关注失败，请稍后再试')
        })
    },
    // 下拉刷新
    onRefresh () {
      var that = this
      that.finished = true
      // 清空列表数据
      that.parentArr = []
      that.commentId = ''
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      that.loading = true
      that.onLoad(that.articleId)
      that.onLoadCommont()
    },
    onLoadCommont () {
      setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        this.getCommentList(this.articleId)
      }, 400)
    }
  }
}
</script>

<style  scoped lang="less">

    .main{
      width:100%;
      min-height:100vh;
      background: #fff;
      padding-bottom:1rem;
      -webkit-overflow-scrolling: touch;
    }
    .show_list1{
      width:100%;
      min-height:40vh;
    }
    .show_list{
      // padding-top:1rem;
      //  border-top-left-radius: 0.8rem;
      // border-top-right-radius: 0.8rem;
      width:100%;
      min-height:80vh;
      background: #fff;
      // margin-top:1rem ;

          .box{
             border-bottom:1px #dcdcdc solid;
            height: auto;
            padding: 0.3rem 0.3rem 0 0.3rem;
            // background: pink;
              .topRig{
                width:100%;
                height: 0.55rem;
                text-align: right;
                margin-top: 0.4rem;
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

             .top{
                width:100%;
                height: 1rem;
                margin-top: 0.1rem;
                img{
                   width:1rem;
                  height: 1rem;
                  border-radius: 50%;
                  float: left;
                }
                div{
                  width: ~'calc(100vw - 2rem )';
                  float: left;
                  margin-left: 0.2rem;
                  text-align: left;

                }
                .name{
                  color:#333333;
                  font-size: 0.36rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-weight: bold;
                }
                .time{
                   color:#888;
                   font-size: 0.28rem;
                }
              }

              .cen{
                width:5.6rem;
                margin-left:1.1rem ;
                text-align: left;

                .txt{
                    color: #333333;
                    font-size: .32rem;
                    line-height: .45rem;
                    text-align: justify;
                     margin-bottom:0.2rem ;
                }
                .imgs{
                  width:100%;
                  height:auto;

                  img{
                    width:5.6rem;
                    height:2.7rem;
                    border-radius: .2rem;
                     margin-left: 0.1rem;
                     object-fit: cover;
                  }
                  .imgMuch{
                    width:1.75rem;
                    height:1.75rem;
                    // margin-right:0.1rem ;
                  }
                }
              }
              .bot{
                width:5.6rem;
                color: #888888;
                font-size: .26rem;

               margin-left:1.1rem ;
                padding:.24rem 0;
                display: flex;
                span{
                  flex: 1;
                  margin-right:0.2rem ;
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

    }

  .box2{
    width: 7.5rem;
    .lef{
        width:.9rem;
        height: .9rem;
        float: left;
        margin-left: 0.3rem;
        margin-top: 0.3rem;

        img{
            width:.9rem;
            height: .9rem;
            border-radius: 50%;
            float: left;
        }
    }
    .rig{
      float: left;
      padding-right: 0.3rem;
      margin-left: 0.2rem;
      width:5.8rem;
      height: auto;
      text-align: left;
      border-bottom:1px #D6D6D6 solid;
        .name{
            color:#333333;
            font-size: 0.3rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
             font-weight: bold;
             margin-top: 0.3rem;
        }
        .txt{
            color:#666;
            font-size: 0.26rem;
           margin: 0.15rem 0;
           line-height: 0.36rem;

        }
        .time{
            color:#888;
            font-size: 0.28rem;
            margin-bottom: 0.15rem;
        }
    }
    .huifu{
      width: 6.5rem;
      height: auto;
      overflow: hidden;
      // background: pink;
      margin-left:1.5rem ;
      border-bottom:1px #D6D6D6 solid;
      .lef{
        width:.5rem;
        height: .5rem;
        float: left;
        margin-left: 0.1rem;
        margin-top: 0.3rem;
        img{
            width:.5rem;
            height: .5rem;
            border-radius: 50%;
            float: left;
        }
      }
      .rig{
        float: left;
        padding-right: 0.3rem;
        margin-left: 0.2rem;
        width:4.8rem;
        height: auto;
        text-align: left;
        border-bottom:none;
        .name{
            color:#333333;
            font-size: 0.24rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
             font-weight: bold;
             margin-top: 0.3rem;
             span{
                color:#888;
                font-size: 0.22rem;
                margin-bottom: 0.15rem;
                font-weight: normal;
             }
        }
        .txt{
            color:#666;
            font-size: 0.22rem;
           margin: 0.15rem 0;
           line-height: 0.36rem;

        }

      }
    }

}
.van-cell-group{
  border-radius: 0.3rem;
}
.detailspingl{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1rem;
        background: #F1F1F1;
        align-items: center;
        padding: 0 .3rem;
        border-top: 1px solid #ededed;

    .inp{
      width:5.5rem;
      height: 0.7rem;
      line-height: 0.3rem;
      border-radius: 0.3rem;
    }
    .btn{
       width:1.15rem;
      height: 0.6rem;
      background: #4F8DFF;
      font-size: 0.3rem;
      margin-left:0.3rem ;
    }
    .van-button--normal{
      padding: 0;
    }

}

</style>
