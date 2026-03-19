<template>
     <div class="main">
        <!-- <div style="width:100%;height:1rem;background:rgb(79, 141, 255);font-size: 25px;position: fixed;top: 0;z-index: 999;">
            <router-link to style="color: #fff !important;"><van-icon name="arrow-left" @click="$router.back(-1)" style='margin:0.2rem 0 0.1rem 0.2rem;'/></router-link>
        </div> -->
        <!-- 列表 -->
        <div class="show_list">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" >
              <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              >
              <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
                  <div class="box" v-for="( item , index ) in list" :key="index" :title="index"  @click="back(item)">
                      <div class="top">
                          <img :src="item.avatar" alt="" />
                          <div class="name">{{item.nickname}}</div>
                          <div class="msg" v-if="item.type === 'COMMENT'">{{item.msg}}</div>
                          <div class="msg" v-if="item.type === 'LIKE'" style="color:#FBB041">
                            <span  style="text-align:left;">
                              <van-icon name="good-job" />
                            </span>
                          </div>
                          <div class="msg" v-if="item.type === 'COLLECT'" style="color:#FE5A49">
                            <span style="text-align:left;">
                              <van-icon name="like"/>
                            </span>
                          </div>
                          <div class="time">{{item.createTime}}</div>
                      </div>
                      <div class="cen">
                          <!-- 纯文字 -->
                          <div class="txt" v-if="!item.image">{{item.content}}</div>
                          <!-- 图-->
                          <img :src="item.image" alt="" v-else>

                      </div>
                  </div>
                  <div v-if='list.length==0'>
                    <van-empty description="" />
                  </div>
              </van-list>
          </van-pull-refresh>
        </div>
     </div>
</template>
<script>
export default {
  name: 'news',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      current: 1// 分页
    }
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
        'size': 10
      }
      that.$axios.post(that.$api.getUnreadMsgPage, data)
        .then(res => {
          //   console.log(res)
          if (res.data.code === 0) {
            if (res.data.data.records.length > 0) {
              for (let i = 0; i < res.data.data.records.length; i++) {
                that.list.push(res.data.data.records[i])
              }
              if (res.data.data.records.length === 10) {
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
        })
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
    // 跳转详情面
    back (item) {
      this.$router.replace({ name: 'details', query: { 'articleId': item.articleId } })
    }
  }

}
</script>
<style lang="less" scoped>
.main{
    background: #FAFAFA;
    width:100%;
    min-height: 80vh;
    padding-top: 0.2rem;
    padding-bottom:1rem ;
}
.box{
    width: 7.1rem;
    height: 1.6rem;
    margin:0.2rem  0.2rem 0.2rem 0.2rem;
    background: #fff;
    border-radius: 0.2rem;
    box-shadow: 3px 3px #dcdcdc;
    .top{
        float: left;
        width:5rem;
        height: 1rem;
        margin-top: 0.2rem;
        margin-left: 0.2rem;
        img{
            width:1rem;
            height: 1rem;

            border-radius: 50%;
            float: left;
        }
        div{
            width: ~'calc(100vw - 4rem )';
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
        .txt{
            color:#333333;
            font-size: 0.26rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

        }
      .msg{
        color:#888;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.28rem;
      }
        .time{
            color:#888;
            font-size: 0.28rem;
        }
    }
    .cen{
        float: right;
        width:1.2rem;
        height:1.2rem;
        margin:0.18rem 0.2rem 0.18rem 0.2rem;
        text-align: left;
        box-sizing: border-box;
        .txt{
            width:1.2rem;
            height:1.2rem;
            color: #666666;
            font-size: .24rem;
            background: #F5F5F5;
             border-radius: 0.2rem;
            line-height: .38rem;
            text-align: justify;
            padding:0.1rem;
             box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;  /* 超出部分省略号 */
            word-break: break-all;  /* break-all(允许在单词内换行。) */
            display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
            -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
            -webkit-line-clamp: 3; /** 显示的行数 **/

        }
        img{
            width:1.2rem;
            height:1.2rem;
            border-radius: 0.2rem;
            object-fit: cover;
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
