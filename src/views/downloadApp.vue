<template>
  <div class="download_container">
    <div class="topimage">
      <van-image class="imageclasee"
        src="https://txrxyhoss.ruixinit.top/logo.png"
      />
    </div>
<!--    <div class="middlebut"  >-->
<!--      <van-button class="btn" size="large" icon="https://ttjxoss.panlongshuju.com/default/ttjx.png" round type="info" @click="downloadYyb()">华为下载</van-button>-->
<!--    </div>-->
<!--    <div class="middlebut"  >-->
<!--      <van-button class="btn" size="large" icon="https://tencentoss.yufan.xin/default/1000.webp" round type="info" @click="downloadXiaomi()">小米下载</van-button>-->
<!--    </div>-->
<!--    <div class="middlebut"  >-->
<!--      <van-button class="btn" size="large" icon="https://tencentoss.yufan.xin/default/index1234.jpg" round type="info" @click="downloadVivo()">vivo下载</van-button>-->
<!--    </div>-->
    <div class="buttext">
      <div class="txt">睿芯云汇</div>
    </div>
    <div class="middlebut" >
      <van-button class="btn" size="large"  round type="info" @click="download()">本地下载</van-button>
    </div>
    <div class="buttext">
      <div class="txt">本地下载,会被手机检测到APP未知来源的应用存在安全风险请谨慎安装,是因为部分手机厂商没有上架的原因</div>
<!--      <div class="txt text1">我们的APP已经经过腾讯手机管家安全测试,请大家放心使用</div>-->
    </div>
<!--    <div class="butimg">-->
<!--      <van-image-->
<!--        width="100%"-->
<!--        height="100%"-->
<!--        src="https://tencentoss.yufan.xin/app/20221122/safe1.jpg"-->
<!--        @click="showImage()"-->
<!--      />-->
<!--    </div>-->

</div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {

  data () {
    return {
      androidUrl: 'https://txtxrxyhoss.ruixinit.top/package/hsjl.apk',
      iosUrl: 'https://apps.apple.com/cn/app/%E9%98%BF%E5%90%89%E6%B3%B0/id1247380390',
      yybUrl: 'https://appgallery.huawei.com/app/C108266377',
      isIos: false,
      fileList: [
        {url: 'https://tencentoss.yufan.xin/app/20221122/safe1.jpg'}
      ],
      isAndroid: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 加载数据
    download () {
      let isWeiXin = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1
      if (isWeiXin) {
        this.$toast({
          position: 'top',
          message: '请使用默认浏览器打开!'
        })
      } else {
        // 安卓
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = "javascript: '<script>location.href=\"" + this.androidUrl + "\"<\/script>'"
        document.getElementsByTagName('body')[0].appendChild(iframe)
      }
    },
    downloadYyb () {
      window.location.href = this.yybUrl
    },
    downloadVivo () {
      window.location.href = 'https://h5coml.vivo.com.cn/h5coml/appdetail_h5/browser_v2/index.html?appId=3549270'
    },
    downloadXiaomi () {
      window.location.href = 'http://file.market.xiaomi.com/download/AppStore/0aa52b2e0c357496a9c8793bd5b0d43428f405729/com.yuhui.admin_1.0.1.apk'
    },
    downloadIos () {
      let isWeiXin = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1
      if (isWeiXin) {
        this.$toast({
          position: 'top',
          message: '请使用默认浏览器打开!'
        })
      } else {
        window.location.href = this.iosUrl
      }
    },
    init () {
      var system = this.isIosOrAndroid()
      if (system === 2) {
        this.isIos = true
        this.isAndroid = false
      } else {
        this.isAndroid = true
        this.isIos = false
      }

      // 获取安卓最新版本地址
      this.$axios.get(this.$api.selectAppVesionInfo, {}).then(res => {
        if (res.data && res.data.code === 0 && res.data.data.appUrl) {
          this.androidUrl = res.data.data.appUrl
        }
      }).catch(rej => {
        console.log(rej)
      })
    },
    isIosOrAndroid () {
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      if (isAndroid) {
        return 1
      }
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isiOS) {
        return 2
      }
      return 0
    },
    showImage () {
      ImagePreview(['https://tencentoss.yufan.xin/app/20221122/safe1.jpg'])
    }
  }
}
</script>

<style lang="less" scoped>
.download_container{
    width:100vw;
    height:100vh;
    background: url(../assets/images/downloadback.png) no-repeat center center;
}
.topimage{
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10vh;
  margin-bottom: 50px;
  .imageclasee{
    width: 40vw;
    height: (40*0.7147) vw;
  }
}
.middlebut{
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  .btn{
    width: 200px;
    height: 50px;
    font-size: 20px;
  }
}
.buttext{
  margin:0 auto;
  margin-top: 30px;
  width: 80vw;
  font-size: 24px;
  color: red;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.text1{
  margin-top: 15px;
  color: black;
}
.butimg{
  margin-top: 20px;
  width: 400px;
  height: 200px;
}

</style>
