<template>
    <div class="main">
        <div v-html="html"></div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      html: '',
      id: '',
      type: ''
    }
  },
  mounted () {
    // alert('我刷新了')
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.type = this.$route.query.type
      this.onLoad(this.id, this.type)
    } else {
      this.$toast.fail('请稍后再试')
    }
  },
  methods: {

    // 加载数据
    onLoad (id, type) {
      var that = this

      that.$axios.get(that.$api.getPrivacyAgreementById + '?id=' + id + '&type=' + type)
        .then(res => {
          const regex = new RegExp('<img', 'gi')
          that.html = res.data.replace(regex, `<img style="max-width: 100%; height: auto"`)
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
