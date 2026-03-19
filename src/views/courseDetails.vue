<template>
  <div class="main">
    <!-- 列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoadCommont" >
        <div class="show_list"  >
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
      parentArr: [],
      sonArr: [],
      pingvalue: '', // 回复评论
      courseId: '',
      type: '',
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
    this.courseId = this.$route.query.courseId
    this.type = this.$route.query.type
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  },
  methods: {
    onLoad (courseId, type) {
      var that = this
      var data = {
        courseId: courseId || that.courseId,
        type: type || that.type,
        commentId: that.commentId,
        size: that.size
      }
      that.$axios.post(that.$api.tcoursecommentlist, data)
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
    // 选择回复人
    commentClick (item, index) {
      // console.log(item)
      this.parentId = item.id
      this.parentIndex = index
      this.placeTxt = '回复' + item.nickname
    },
    commentClickClear () {
      // console.log(item)
      this.parentId = ''
      this.parentIndex = ''
      this.placeTxt = '友善评论，文明发言'
    },
    // 发表评论
    onuserActorComment () {
      var that = this
      if (!that.pingvalue) {
        return
      }
      var data = {
        content: that.pingvalue, // 评论内容
        courseId: that.courseId, // 文章ID
        parentId: that.parentId,
        type: that.type
      }
      that.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '评论中...',
        forbidClick: true
      })
      that.$axios.post(that.$api.tcoursecomment, data)
        .then(res => {
          that.$toast.clear()
          if (res.data.code === 0) {
            that.$toast.success('评论成功')
            if (res.data.data.parentId) {
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
    onLoadCommont () {
      let that = this
      setTimeout(() => {
        if (that.refreshing) {
          that.refreshing = false
        }
        that.onLoad(that.courseId, that.type)
      }, 200)
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
      that.onLoadCommont()
    }
  }
}
</script>

<style  scoped lang="less">

    .main{
      width:100%;
      min-height:100vh;
      background: #fff;
      height: auto;
      padding-bottom:1rem;
      -webkit-overflow-scrolling: touch;
    }

    .show_list{
      // padding-top:1rem;
      //  border-top-left-radius: 0.8rem;
      // border-top-right-radius: 0.8rem;
      width:100%;
      min-height:40vh;
      background: #fff;
          .box{
             border-bottom:1px #dcdcdc solid;
            height: auto;
            padding: 0.3rem 0.3rem 0 0.3rem;
            // background: pink;

             .top{
                width:100%;
                height: 1rem;
                margin-top: 0.4rem;
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
    height: auto;
    overflow: hidden;

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
