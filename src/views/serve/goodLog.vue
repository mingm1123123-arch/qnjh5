<template>
  <div class="main">
    <van-dropdown-menu>
      <van-dropdown-item v-model="webType" :options="option" @change="handleItemChange"/>
      <van-dropdown-item title="筛选" ref="item">
        <van-field v-model="searchParam.phone" label="手机号" placeholder="请输入手机号" clearable/>
        <van-field
          readonly
          clearable
          clickable
          name="picker"
          :value="searchParam.statusName"
          label="兑换状态"
          placeholder="点击选择兑换状态"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
        <div style="margin: 16px;padding-bottom: 16px;">
          <van-col span="16">
            <van-button round block type="danger" native-type="submit" @click="onConfirmSearch">查询</van-button>
          </van-col>
          <van-col span="6" offset="2">
            <van-button round block native-type="submit" @click="onConfirmRest">重置</van-button>
          </van-col>
        </div>
      </van-dropdown-item>
      </van-dropdown-menu>
    <div>
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
            <van-cell title="手机号:" :value="item.phone" />
            <van-cell title="昵称:" :value="item.userName" />
            <van-cell title="头像:"  style="height: 110px;">
              <template #icon>
                <van-image
                  width="100"
                  height="100"
                  :src="item.avatar"
                  style="position: absolute ;right: 0;"
                />
              </template>
            </van-cell>
            <van-cell title="商品名称:" :value="item.name" />
            <van-cell title="兑换积分:" :value="item.integral" />
            <van-cell title="兑换数量:" :value="item.num" />
            <van-cell title="创建时间:" :value="item.createTime" />
            <van-cell title="兑换时间:" :value="item.updateTime" />
            <van-cell title="兑换状态:" :value="item.status_dictText" />
            <van-cell v-show="item.status === '0'">
              <van-button round block type="danger" @click="checkGoodOld(item.id)">兑换</van-button>
            </van-cell>
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
      active: 0,
      showPicker: false,
      isSendCode: false,
      showPicker1: false,
      showPicker3: false,
      showPicker4: false,
      active1: '',
      columns: [
        { text: '未兑换', value: '0' },
        { text: '已兑换', value: '1' }
      ],
      webType: '2',
      option: [
        { text: '用户管理', value: '0' },
        { text: '直播记录', value: '1' },
        { text: '商品兑换', value: '2' }
      ],
      searchParam: {
        phone: '',
        realname: '',
        status: '',
        appIsLogin: '',
        webIsLogin: '',
        webStatus: ''
      }
    }
  },
  mounted () {
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
    },
    getList () {
      setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        this.getGoodLogList()
      }, 400)
    },
    onConfirm (value) {
      this.searchParam.status = value.value
      this.searchParam.statusName = value.text
      this.showPicker = false
    },
    onConfirmSearch () {
      this.pageNo = 1
      this.dataList = []
      this.getGoodLogList()
      this.$refs.item.toggle()
    },
    onConfirmRest () {
      this.searchParam = {
        phone: '',
        realname: '',
        status: '',
        webStatus: ''
      }
      this.pageNo = 1
      this.dataList = []
      this.getGoodLogList()
      this.$refs.item.toggle()
    },
    handleItemChange (value) {
      if (value === '0') {
        this.$router.push({
          path: '/userManager'
        })
      } else if (value === '1') {
        this.$router.push({
          path: '/liveLog'
        })
      }
    },
    checkGoodOld (id) {
      var that = this
      Dialog.confirm({
        title: '是否兑换？'
      })
        .then(() => {
          that.checkGood(id)
        })
        .catch(() => {
        })
    },
    checkGood (id) {
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      let params = {
        id: id,
        status: '1'
      }

      that.$axios.post(that.$api.editGoodLog, params).then(res => {
        if (res.data.code === 200) {
          Toast.loading({
            message: '编辑成功',
            forbidClick: true,
            dduration: 3000
          })
          that.pageNo = 1
          that.dataList = []
          that.getGoodLogList()
        } else {
          Toast.loading({
            message: '编辑失败',
            forbidClick: true,
            dduration: 3000
          })
          that.finished = true
        }
      }).catch(res => {
        Toast.loading({
          message: '编辑失败',
          forbidClick: true,
          dduration: 3000
        })
        Toast.clear()
      })
    },
    getGoodLogList () {
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      let params = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        phone: that.searchParam.phone,
        status: that.searchParam.status
      }

      that.$axios.get(that.$api.goodLogList, {params: params}).then(res => {
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
          Toast.clear()
        } else {
          Toast.loading({
            message: '查询失败',
            forbidClick: true,
            dduration: 3000
          })
          that.finished = true
        }
        that.loading = false// false表示加载结束
        that.refreshing = false// 刷新完成
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
