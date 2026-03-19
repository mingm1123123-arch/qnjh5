<template>
  <div class="main">
    <!-- 列表 -->
      <van-list  finished-text="没有更多了">
        <div class="show_list"  >
          <div style="font-size: 0.6rem;margin-top: 20px;align-content: center;text-align: center;">
            新闻
          </div>
          <div class="box2" v-if="parentArr.length > 0" v-for="( item , index ) in parentArr" :key="index" :title="index" style="display: flex;justify-content: center;">
            <div style="border: black 1px solid;width: 92vw;margin-top: 15px;border-radius: 0.2rem;" @click="onskip(item.id)">
              <div style="margin-left: 15px;margin-top: 15px;">
                <span style="font-size: 0.4rem;line-height: 0.6rem;">{{item.title}}</span>
              </div>
              <div style="margin-left: 15px;margin-bottom: 15px;margin-top: 10px;">
                <span style="font-size: 0.3rem;line-height: 0.5rem;">{{item.timeFormat}}</span>
              </div>
            </div>
          </div>
          <div v-else style="display: flex;flex-direction: column; justify-content: center;">
            <div style="margin-top: 3rem;margin-left: 42%">
              <span>暂无新闻</span>
            </div>
          </div>
        </div>
      </van-list>
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
    this.onLoad()
  },
  methods: {
    onLoad () {
      var that = this
      that.$axios.get(that.$api.messageList)
        .then(res => {
          that.loading = false
          console.log(JSON.stringify(res.data))
          if (res.data.code === 200) {
            res.data.result.forEach(item => {
              var date = new Date(item.createTime)
              item.timeFormat = date.toLocaleString()
            })
            that.parentArr = res.data.result
          } else {
            that.finished = true
          }
        }).catch(error => {
          that.loading = false// false表示加载结束
          that.refreshing = false// 刷新完成
          that.finished = true
        })
    },
    onLoadCommont () {
      setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        this.onLoad()
      }, 400)
    },
    onskip (id) {
      this.$router.push({ name: 'richText', query: { 'id': id, 'type': 'MESSAGE' } })
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
      min-height:100vh;
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
