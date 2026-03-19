<template>
  <div class="main">
    <van-dropdown-menu>
      <van-dropdown-item title="筛选" ref="item">
        <van-field v-model="searchParam.phone" label="手机号" placeholder="请输入手机号" clearable/>
        <van-field v-model="searchParam.realname" label="昵称" placeholder="请输入昵称" clearable/>
        <van-popup v-model="showPicker1" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm1"
            @cancel="showPicker1 = false"
          />
        </van-popup>
        <van-field
          readonly
          clearable
          clickable
          name="picker"
          :value="searchParam.appIsLogin"
          label="APP登录"
          placeholder="点击选择APP登录"
          @click="showPicker3 = true"
        />
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
            <van-cell title="APP状态:" :value="item.status_dictText" />
            <van-cell title="APP登录:" :value="item.appIsLogin_dictText" />
            <van-cell title="积分:" :value="item.integral" />
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
      columns: ['全部', '正常', '冻结'],
      columns1: ['全部', '是', '否'],
      webType: '0',
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
      },
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        integral: 0,
        captcha: '',
        email: '',
        avatarList: [],
        inviterCode: ''
      },
      form2: {
        phone: ''
      }
    }
  },
  mounted () {
    this.checkIsSendCode()
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
        this.getUserList()
      }, 400)
    },
    onConfirm (value) {
      this.searchParam.status = value
      this.showPicker = false
    },
    onConfirm1 (value) {
      this.searchParam.webStatus = value
      this.showPicker1 = false
    },
    onConfirm3 (value) {
      this.searchParam.appIsLogin = value
      this.showPicker3 = false
    },
    onConfirm4 (value) {
      this.searchParam.webIsLogin = value
      this.showPicker4 = false
    },
    onConfirmSearch () {
      this.pageNo = 1
      this.dataList = []
      this.getUserList()
      this.$refs.item.toggle()
    },
    afterRead (file) {
      var that = this
      file.status = 'uploading'
      file.message = '上传中...'
      const formData = new FormData()
      formData.append('file', file)
      formData.append('description', '这是文件描述')
      that.$axios.postForm(that.$api.upload, file).then(res => {
        if (res.data.code === 0) {
          that.form.avatar = res.data.message
          that.form.avatarList = [
            {
              url: res.data.message
            }
          ]
        } else {
          file.status = 'failed'
          file.message = '上传失败'
        }
      }).catch(res => {
        file.status = 'failed'
        file.message = '上传失败'
      })
    },
    onSubmitAdd1 () {
      var that = this
      that.$axios.post(that.$api.changeLiveUser, {
        phone: that.form2.phone
      }).then(res => {
        if (res.data.code === 0) {
          Toast.success('添加成功')
          that.form2.phone = ''
          setTimeout(function () {
            Toast.clear()
          }, 2000)
        } else {
          Toast.fail(res.data.message)
        }
      }).catch(res => {
        Toast.fail('添加失败')
      })
    },
    goToSeeDetail (id) {
      this.$router.push({
        path: '/userDetail',
        query: {
          id: id
        }
      })
    },
    sendCode () {
      var that = this
      that.$axios.post(that.$api.sendCode, {
        checkKey: '1629428467008'
      }).then(res => {
        if (res.data.code === 0) {
          Toast.success('发送成功')
        } else {
          Toast.fail('发送失败')
        }
      }).catch(res => {
        Toast.fail('发送失败')
      })
    },
    checkIsSendCode () {
      var that = this
      that.$axios.post(that.$api.getDictItemSingle, {
        code: 'EMAIL_CHECK_CODE'
      }).then(res => {
        if (res.data.code === 0 && res.data.result === '1') {
          that.isSendCode = true
        }
      }).catch(res => {
        that.isSendCode = false
      })
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
      this.getUserList()
      this.$refs.item.toggle()
    },
    handleItemChange (value) {
      if (value === '1') {
        this.$router.push({
          path: '/liveLog'
        })
      } else if (value === '2') {
        this.$router.push({
          path: '/goodLog'
        })
      }
    },
    onSubmitAdd () {
      var that = this
      if (that.form.password !== that.form.confirmPassword) {
        Toast.fail('密码不一致')
        return
      }
      that.$axios.post(that.$api.addUser, that.form).then(res => {
        if (res.data.code === 200) {
          that.form = {
            username: '',
            password: '',
            confirmPassword: '',
            avatar: '',
            integral: 0,
            captcha: '',
            email: '',
            avatarList: [],
            inviterCode: ''
          }
          this.$refs.userModel.toggle()
          that.onRefresh()
          Toast.success('添加成功')
        } else {
          Toast.fail(res.data.message)
        }
      }).catch(res => {
        Toast.fail('添加失败')
      })
    },
    getUserList () {
      var that = this
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      let params = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        phone: that.searchParam.phone,
        realname: that.searchParam.realname,
        status: that.searchParam.status,
        webStatus: that.searchParam.webStatus
      }
      if (that.searchParam.status === '正常') {
        params.status = 1
      } else if (that.searchParam.status === '冻结') {
        params.status = 2
      } else {
        params.status = ''
      }
      if (that.searchParam.webStatus === '正常') {
        params.webStatus = 1
      } else if (that.searchParam.webStatus === '冻结') {
        params.webStatus = 2
      } else {
        params.webStatus = ''
      }
      if (that.searchParam.appIsLogin === '是') {
        params.appIsLogin = 1
      } else if (that.searchParam.appIsLogin === '否') {
        params.appIsLogin = 2
      } else {
        params.appIsLogin = ''
      }
      if (that.searchParam.webIsLogin === '是') {
        params.webIsLogin = 1
      } else if (that.searchParam.webIsLogin === '否') {
        params.webIsLogin = 0
      } else {
        params.webIsLogin = ''
      }
      that.$axios.post(that.$api.userList, params).then(res => {
        if (res.data.code === 0) {
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
