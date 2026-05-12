<template>
  <div class="download_container">
    <!-- 装饰性背景元素 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Logo区域 -->
    <div class="topimage">
      <div class="logo-wrapper">
        <van-image
          class="imageclasee"
          src="https://txrxyhoss.ruixinit.top/logo.png"
        />
      </div>
    </div>
    <!-- 下载按钮 -->
    <div class="download-section">
      <van-button
        class="download-btn"
        size="large"
        round
        @click="download()"
      >
        <van-icon name="down" size="20" style="margin-right: 8px;" />
        立即下载APP
      </van-button>
    </div>
    <!-- 应用信息卡片 -->
    <div class="info-card">
      <div class="app-name">睿芯云汇</div>
      <div class="app-desc">本地下载,会被手机检测到APP未知来源的应用存在安全风险请谨慎安装,是因为部分手机厂商没有上架的原因</div>
    </div>



  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {

  data () {
    return {
      androidUrl: 'https://txrxyhoss.ruixinit.top/package/rxyh.apk',
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
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: rotate 30s linear infinite;
  }
}

// 背景装饰
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(5px);

    &.circle-1 {
      width: 220px;
      height: 220px;
      top: -60px;
      right: -60px;
      animation: float 8s ease-in-out infinite;
    }

    &.circle-2 {
      width: 160px;
      height: 160px;
      bottom: 120px;
      left: -40px;
      animation: float 10s ease-in-out infinite;
      animation-delay: 2s;
    }

    &.circle-3 {
      width: 120px;
      height: 120px;
      top: 45%;
      right: 25px;
      animation: float 9s ease-in-out infinite;
      animation-delay: 1s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-25px) scale(1.05);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Logo区域
.topimage{
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15vh;
  margin-bottom: 35px;
  position: relative;
  z-index: 1;

  .logo-wrapper {
    text-align: center;
    position: relative;

    .imageclasee{
      width: 35vw;
      height: (35*0.7147) vw;
      border-radius: 22px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2),
                  0 0 40px rgba(255, 255, 255, 0.15);
      animation: logoFloat 4s ease-in-out infinite;
    }
  }
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

// 信息卡片
.info-card {
  margin: 0 20px 40px;
  padding: 28px 25px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 22px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08),
              0 0 0 1px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  text-align: center;
  position: relative;
  z-index: 1;

  .app-name {
    font-size: 32px;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 14px;
    letter-spacing: 2px;
  }

  .app-desc {
    font-size: 14px;
    color: #718096;
    line-height: 1.8;
  }
}

// 下载区域
.download-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
  position: relative;
  z-index: 1;

  .download-btn {
    width: 340px;
    max-width: 90%;
    height: 56px;
    font-size: 18px;
    font-weight: bold;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    border: none;
    color: white;
    box-shadow: 0 12px 35px rgba(255, 107, 107, 0.35),
                0 0 0 1px rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
      transform: scale(0.96);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.3);
    }
  }
}
</style>
