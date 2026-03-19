<template>
    <div class="main">
      <van-cell-group>
        <van-field
          label="手机号"
          v-model="userInfo.phone"
          center
          readonly
        />
        <van-field
          label="昵称"
          v-model="userInfo.realname"
          center
          readonly
        />
        <van-field
          label="直播账号"
          v-model="userInfo.liveAccount"
          center
          readonly
        />
        <van-field
          label="APP状态"
          v-model="userInfo.status_dictText"
          center
          readonly
        >
          <template #button>
            <van-button size="normal" type="danger" @click="showPicker1= true">修改</van-button>
          </template>
        </van-field>
        <van-popup v-model="showPicker1" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm1"
            @cancel="showPicker1 = false"
          />
        </van-popup>
        <van-field
          label="WEB状态"
          v-model="userInfo.webStatus_dictText"
          center
          readonly
        >
          <template #button>
            <van-button size="normal" type="danger" @click="showPicker2= true">修改</van-button>
          </template>
        </van-field>
        <van-popup v-model="showPicker2" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm2"
            @cancel="showPicker2 = false"
          />
        </van-popup>
        <van-field
          label="APP登录"
          v-model="userInfo.appIsLogin_dictText"
          center
          readonly
        >
          <template #button>
            <van-button size="normal" type="danger" @click="showUpdatePassword">修改密码</van-button>
          </template>
        </van-field>
        <van-popup v-model="showPicker3" :style="{ height: '260px',width: '80%' }">
          <van-form>
            <van-field
              v-model="form.password"
              type="password"
              name="登录密码"
              label="登录密码"
              placeholder="请填写登录密码"
              :rules="[{ required: true, message: '请填写登录密码' }]"
            />
            <van-field
              v-model="form.confirmPassword"
              type="password"
              name="确认密码"
              label="确认密码"
              placeholder="请填写确认密码"
              :rules="[{ required: true, message: '请填写确认密码' }]"
            />
            <van-field
              v-model="form.captcha"
              center
              clearable
              v-if="isSendCode"
              label="验证码"
              placeholder="请输入验证码"
            >
              <template #button>
                <van-button size="small" v-show="!isSend" type="danger" @click="sendCode">发送验证码</van-button>
                <van-count-down v-show="isSend" ref="countDown" :time="60000" :auto-start="false" format="ss" @finish="finish"/>
              </template>
            </van-field>
            <div style="margin: 16px;">
              <van-button round block type="danger" native-type="submit" @click="onSubmitAdd1">提交</van-button>
            </div>
          </van-form>
        </van-popup>
        <van-field
          label="WEB登录"
          v-model="userInfo.webIsLogin_dictText"
          center
          readonly
        >
          <template #button>
            <van-button size="normal" type="danger" @click="showUpdateLive">修改直播密码</van-button>
          </template>
        </van-field>
        <van-popup v-model="showPicker4" :style="{ height: '320px',width: '80%' }">
          <van-form>
            <van-field
              label="直播账户"
              v-model="form.liveAccount"
              name="直播账户"
              placeholder="请填写直播账户"
              :rules="[{ required: true, message: '请填写直播账户' }]"
              center
            />
            <van-field
              v-model="form.livePassword"
              type="password"
              name="直播登录密码"
              label="直播登录密码"
              placeholder="请填写直播登录密码"
              :rules="[{ required: true, message: '请填写直播登录密码' }]"
            />
            <van-field
              v-model="form.confirmPassword"
              type="password"
              name="确认直播登录密码"
              label="确认直播登录密码"
              placeholder="请填写直播登录确认密码"
              :rules="[{ required: true, message: '请填写确认直播登录密码' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="danger" native-type="submit" @click="onSubmitAdd2">提交</van-button>
            </div>
          </van-form>
        </van-popup>

        <van-field
          label="积分"
          v-model="userInfo.integral"
          center
          readonly
        >
          <template #button>
            <van-button size="normal" type="danger" @click="showPicker5 = true">修改积分</van-button>
          </template>
        </van-field>
        <van-popup v-model="showPicker5" :style="{ height: '160px',width: '80%' }">
          <van-form>
            <van-field
              v-model="userInfo.integral"
              name="积分"
              label="积分"
              placeholder="请填写积分"
              :rules="[{ required: true, message: '请填写积分' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="danger" native-type="submit" @click="onConfirm3">提交</van-button>
            </div>
          </van-form>
        </van-popup>
        <van-field
          label="登录记录"
          center
          readonly
        >
          <template #button>
            <van-button size="normal" type="danger" @click="gotoLiveLog">查看</van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>
</template>

<script>
import {Toast} from 'vant'

export default {
  data () {
    return {
      userInfo: {},
      showPicker1: false,
      showPicker2: false,
      showPicker3: false,
      showPicker4: false,
      showPicker5: false,
      isSendCode: false,
      isSend: false,
      time: 60,
      columns: ['正常', '冻结'],
      columns1: ['是', '否'],
      form: {
        password: '',
        captcha: '',
        confirmPassword: '',
        liveAccount: '',
        livePassword: ''
      }
    }
  },
  mounted () {
    // alert('我刷新了')
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.onLoad(this.id)
    } else {
      this.$toast.fail('请稍后再试')
    }
    this.checkIsSendCode()
  },
  methods: {
    onConfirm1 (value) {
      var that = this
      if (value === '正常') {
        value = 1
      } else {
        value = 2
      }
      var data = {
        'ids': that.id,
        'status': value
      }
      that.$axios.post(that.$api.updateUserStatus, data)
        .then(res => {
          if (res.data.code === 200) {
            that.$toast.success('修改成功')
            setTimeout(() => {
              that.showPicker1 = false
              that.onLoad(that.id)
            }, 1000)
          } else {
            that.$toast.fail('修改失败，请稍后再试')
          }
        })
    },
    showUpdatePassword () {
      this.showPicker3 = true
      this.finish()
    },
    finish () {
      this.isSend = false
      this.$refs.countDown.reset()
    },
    sendCode () {
      var that = this
      that.isSend = true
      that.$axios.post(that.$api.sendCode, {
        checkKey: '1629428467008'
      }).then(res => {
        if (res.data.code === 0) {
          that.isSend = true
          Toast.success('发送成功')
          setTimeout(() => {
            that.$refs.countDown.start()
          }, 200)
        } else {
          that.isSend = false
          Toast.fail('发送失败')
        }
      }).catch(res => {
        that.isSend = false
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
    onConfirm3 () {
      var that = this
      var data = {
        'id': that.id,
        'integral': that.userInfo.integral
      }
      that.$axios.post(that.$api.editIntegral, data)
        .then(res => {
          if (res.data.code === 200) {
            that.$toast.success('修改成功')
            setTimeout(() => {
              that.showPicker5 = false
              that.onLoad(that.id)
            }, 1000)
          } else {
            that.$toast.fail('修改失败，请稍后再试')
          }
        })
    },
    onConfirm2 (value) {
      var that = this
      if (value === '正常') {
        value = 1
      } else {
        value = 2
      }
      var data = {
        'ids': that.id,
        'webStatus': value
      }
      that.$axios.post(that.$api.updateUserStatus, data)
        .then(res => {
          if (res.data.code === 200) {
            that.$toast.success('修改成功')
            setTimeout(() => {
              that.showPicker2 = false
              that.onLoad(that.id)
            }, 1000)
          } else {
            that.$toast.fail('修改失败，请稍后再试')
          }
        })
    },
    gotoLiveLog () {
      this.$router.push({
        path: '/loginLogList',
        query: {
          id: this.id
        }
      })
    },
    onSubmitAdd1 () {
      var that = this
      if (that.form.password !== that.form.confirmPassword) {
        Toast.fail('密码不一致')
        return
      }
      that.$axios.post(that.$api.changePassword, {
        id: that.id,
        password: that.form.password,
        captcha: that.form.captcha
      }).then(res => {
        if (res.data.code === 200) {
          Toast.success('修改成功')
          that.form.password = ''
          that.form.confirmPassword = ''
          that.form.captcha = ''
          setTimeout(function () {
            Toast.clear()
            that.showPicker3 = false
            that.onLoad(that.id)
          }, 2000)
        } else {
          Toast.fail(res.data.message)
        }
      }).catch(res => {
        Toast.fail('修改失败')
      })
    },
    showUpdateLive () {
      this.showPicker4 = true
      this.form.liveAccount = this.userInfo.liveAccount
    },
    onSubmitAdd2 () {
      var that = this
      if (that.form.livePassword !== that.form.confirmPassword) {
        Toast.fail('密码不一致')
        return
      }
      that.$axios.post(that.$api.changeLivePassword, {
        id: that.id,
        liveAccount: that.form.liveAccount,
        livePassword: that.form.livePassword
      }).then(res => {
        if (res.data.code === 200) {
          Toast.success('修改成功')
          that.form.password = ''
          that.form.confirmPassword = ''
          that.form.captcha = ''
          that.form.liveAccount = ''
          that.form.livePassword = ''
          setTimeout(function () {
            Toast.clear()
            that.showPicker4 = false
            that.onLoad(that.id)
          }, 2000)
        } else {
          Toast.fail(res.data.message)
        }
      }).catch(res => {
        Toast.fail('修改失败')
      })
    },
    // 加载数据
    onLoad (id) {
      var that = this
      that.$axios.post(that.$api.getUserInfo, {'id': id})
        .then(res => {
          let obj = res.data.result

          if (obj.status === 1) {
            obj.status_dictText = '正常'
          } else if (obj.status === 2) {
            obj.status_dictText = '冻结'
          }
          if (obj.webStatus === 1) {
            obj.webStatus_dictText = '正常'
          } else if (obj.webStatus === 2) {
            obj.webStatus_dictText = '冻结'
          }
          if (obj.appIsLogin === '1') {
            obj.appIsLogin_dictText = '是'
          } else {
            obj.appIsLogin_dictText = '否'
          }
          if (obj.webIsLogin === '1') {
            obj.webIsLogin_dictText = '是'
          } else {
            obj.webIsLogin_dictText = '否'
          }
          that.userInfo = obj
        }).catch(res => {
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .main{
      background: #fff;
      min-height: 100vh;
      padding-top: 0.2rem;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
      padding-bottom:0.5rem ;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
