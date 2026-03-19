<template>
  <div id="app">
      <keep-alive include="home">
        <router-view ></router-view>
      </keep-alive>
     
  </div>
</template>

<script>
export default {
   data() {
          return {
            count: 0,
            isLoading: false
          };
    },
    
    mounted(){
     this.onrem()
    },
    methods:{
      // 计算rem
      onrem(){
        document.addEventListener("DOMContentLoaded",function(){
            document.getElementsByTagName("html")[0].style.fontSize=(document.documentElement.clientWidth/750)*100+"px";
        });
      
        window.onresize = function(){
            document.getElementsByTagName("html")[0].style.fontSize=(document.documentElement.clientWidth/750)*100+"px";
        }
      },
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
}
*{
	margin: 0;
	padding: 0;
  
}
body,html{
  width: 100%;
  height: 100%;
	font-size: 0.26rem;
	font-family: "Microsoft Yahei","FZLTXHK -GBK1-0";
	color: #666;
	background-color: #FAFAFA;
}
.l{
	float: left;
}
.r{
	float: right;
}
ul,ol{
	list-style-type:none
}
img, a img, img:focus {
    border: 0 none;
    outline: 0 none;
}
h1,h2,h3,h4{
	font-weight: normal;
}
a,a:hover{
	text-decoration: none;
	color: #424242;
}

</style>
