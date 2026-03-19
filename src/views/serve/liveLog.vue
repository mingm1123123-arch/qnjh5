<template>
  <div class="main">
    <van-dropdown-menu>
      <van-dropdown-item v-model="webType" :options="option" @change="handleItemChange"/>
      <van-dropdown-item title="筛选" ref="item">
        <van-field
          readonly
          clearable
          clickable
          name="picker"
          :value="searchParam.liveTypeName"
          label="直播类型"
          placeholder="点击选择直播类型"
          @click="showPicker4 = true"
        />
        <van-popup v-model="showPicker4" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm4"
            @cancel="showPicker4 = false"
          />
        </van-popup>
        <van-field
          label="手机号"
          v-model="searchParam.phone"
          name="手机号"
          placeholder="请填写手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
          center
        />
        <van-field
          label="直播间名称"
          v-model="searchParam.liveName"
          name="直播间名称"
          placeholder="请填写直播间名称"
          :rules="[{ required: true, message: '请填写直播间名称' }]"
          center
        />
        <van-field
          readonly
          clearable
          clickable
          name="picker"
          :value="searchParam.typeName"
          label="记录类型"
          placeholder="点击选择记录类型"
          @click="showPicker5 = true"
        />
        <van-popup v-model="showPicker5" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns1"
            @confirm="onConfirm5"
            @cancel="showPicker5 = false"
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
            <van-cell title="直播间名称:" :value="item.liveName" />
            <van-cell title="手机号:" :value="item.phone" />
            <van-cell title="昵称:" :value="item.realname" />
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
            <van-cell title="开始观看的时间:" :value="item.startTime" />
            <van-cell title="结束观看时间:" :value="item.endTime" />
            <van-cell title="观看时长:" :value="item.timeStr" />
            <van-cell title="IP:" :value="item.lastLoginIp" />
            <van-cell title="省份:" :value="item.province" />
            <van-cell title="城市:" :value="item.city" />
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
      showPicker5: false,
      active1: '',
      columns: [
        { text: '直播', value: '1' },
        { text: '新直播', value: '2' },
        { text: 'VIP直播', value: '3' },
        { text: 'VVIP直播', value: '4' }
      ],
      columns1: [
        { text: '观看记录', value: '1' },
        { text: '观看记录统计', value: '2' }
      ],
      webType: '1',
      option: [
        { text: '用户管理', value: '0' },
        { text: '直播记录', value: '1' },
        { text: '商品兑换', value: '2' }
      ],
      searchParam: {
        liveType: ''
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
        this.getLiveLogList()
      }, 400)
    },

    onConfirm4 (value) {
      this.searchParam.liveType = value.value
      this.searchParam.liveTypeName = value.text
      this.showPicker4 = false
    },
    onConfirm5 (value) {
      this.searchParam.type = value.value
      this.searchParam.typeName = value.text
      this.showPicker5 = false
    },
    onConfirmSearch () {
      var that = this
      // 清空列表数据
      that.dataList = []
      that.pageNo = 1
      this.getLiveLogList()
      this.$refs.item.toggle()
    },
    onConfirmRest () {
      this.searchParam = {
      }
      this.pageNo = 1
      this.dataList = []
      this.getLiveLogList()
      this.$refs.item.toggle()
    },
    handleItemChange (value) {
      if (value === '0') {
        this.$router.push({
          path: '/userManager'
        })
      } else if (value === '2') {
        this.$router.push({
          path: '/goodLog'
        })
      }
    },

    getLiveLogList () {
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      let params = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        type: that.searchParam.liveType,
        phone: that.searchParam.phone,
        liveName: that.searchParam.liveName
      }
      let queryUrl = that.$api.liveLogList
      if (that.searchParam.type === '2') {
        queryUrl = that.$api.selectTAppLiveLogStatistics
      }
      that.$axios.get(queryUrl, {params: params}).then(res => {
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
