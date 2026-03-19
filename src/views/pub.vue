<template>
     <div class="main">
      <!-- <div style="width:100%;height:1rem;background:rgb(79, 141, 255);font-size: 25px;position: fixed;top: 0;z-index: 999;">
        <router-link to style="color: #fff !important;"><van-icon name="arrow-left" @click="$router.back(-1)" style='margin:0.2rem 0 0.1rem 0.2rem;'/></router-link>
      </div> -->
      <div class="tear">
          <van-field
              v-model="txt"
              autosize
              type="textarea"
              placeholder="说点什么吧～"
              show-word-limit
          />
      </div>

      <div class="imglist">
          <div class="imgs" v-for="(item,index) in fileList" :key="index" >
           <van-icon name="clear" class="imgdel" @click="deleteImg(index)"/>
            <img :src="item" alt="">
          </div>

          <van-uploader  :max-count="9" :preview-image="false" accept="image/*"   multiple  :after-read="uploadImg">
          </van-uploader>
      </div>

        <van-button class="sub" type="primary" block @click="submit">发布</van-button>
     </div>
</template>
<script>

export default {
  data () {
    return {

      fileList: [
        // 'https://img01.yzcdn.cn/vant/leaf.jpg',
        // 'https://img01.yzcdn.cn/vant/leaf.jpg',
        // 'https://img01.yzcdn.cn/vant/leaf.jpg',
      ],
      txt: ''
    }
  },

  methods: {
    uploadImg (file) {
      var that = this
      // console.log(file)
      var num = Number(file.length) + Number(that.fileList.length)
      if (num > 9) {
        that.$toast.fail('图片超出上传数量，最多上传9张。')
        return false
      }
      let formData = new FormData()
      if (file.constructor !== Array) { // 单个文件
        formData.append('file', file.file)
      } else { // 多个文件
        file.forEach(element => {
          formData.append('file', element.file)
        })
      }

      // 3.发送
      // console.log(formData)
      // 请求头携带的信息
      let token = sessionStorage.getItem('token')
      let instance = axios.create({
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token
        }
      })
      that.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '加载中...',
        forbidClick: true
      })
      instance.post(
        that.$api.fileUpload,
        formData
      ).then(res => {
        that.$toast.clear()
        if (res.data.code === 0) {
          that.$toast.success('上传成功')
          for (let i = 0; i < res.data.data.length; i++) {
            that.fileList.push(res.data.data[i])
          }
        } else {
          that.$toast.fail('上传失败，请稍后再试')
        }
      }).catch(res => {
        // console.log(res)
        that.$toast.clear()
        that.$toast.fail({
          'message': '上传失败，请稍后再试',
          'duration': 3000
        })
      })
    },
    deleteImg (index) {
      var that = this
      that.fileList.splice(index, 1)
    },
    // 发布
    submit () {
      var that = this
      if ((!that.txt || that.txt === '') && that.fileList.length === 0) {
        that.$toast.fail('请填写感悟内容！')
        return
      }
      var data = {
        'content': that.txt,
        'images': that.fileList.toString()
      }
      this.$axios.post(that.$api.tarticle, data)
        .then(res => {
          // console.log(res)
          if (res.data.code === 0) {
            that.$toast.success('发布成功')
            setTimeout(function () {
              that.$router.go(-1)
            }, 1500)
          } else {
            that.$toast.fail('发布失败，请稍后再试')
          }
        }).catch(res => {
          // console.log(res)
          that.$toast.fail('发布失败，请稍后再试')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.main{
    min-height: 100vh;
    background: #FAFAFA;
    box-sizing: border-box;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.tear{
  width: 6.9rem;
  height: 3rem;
  margin:0 0 0.3rem 0.3rem;
  border-radius: 0.2rem;
  box-shadow: 3px 3px #ddd;
  margin-top:0.2rem ;
  .van-cell{
    height: 100%;

  }

}

.imglist{
  width: 6.9rem;
  margin:0.3rem 0 0.3rem 0.3rem;
  overflow: hidden;
}
.van-button{
  background: #4F8DFF;
  width: 6.4rem;
  height: .8rem;
  border-radius: .45rem;
  position: fixed;
  bottom: 1rem;
  left: .5rem;
}
.van-button--primary{
  border: 1px solid #4F8DFF;
}
.van-button--normal{
  font-size: .3rem;
}

.imgs{
   float: left;
  margin: 0 0.15rem 8px 0.12rem;
  position: relative;
  img{
    width: 2.03rem;
    height: 2.03rem;
    border-radius: 0.2rem;
    object-fit:cover;
  }
  .imgdel{
    position: absolute;
    top: 0.1rem;
    right: 0.1rem;
    z-index: 9;
    font-size: 0.4rem;
  }

}

.addimg{
    float: left;
    width: 2.03rem;
    height: 2.03rem;
    margin: 0 0.15rem 8px 0.12rem;
    border-radius: 0.2rem;
    font-size:0.8rem;
    border:1px #DCDCDC solid ;
    text-align: center;
    line-height: 2.03rem;
    color: #DCDCDC;
    box-sizing: border-box;
}

</style>
<style>
.van-field__control{
  color: #333;
  font-size: .3rem;
}

</style>
