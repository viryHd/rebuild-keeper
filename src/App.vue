<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {

    }
  },
  components: {

  },

  methods: {
    
  },
  created(){
    this.$root.user = window.user || {}

    // 提测时用local
    // this.$root.baseUrl = window.location.protocol + "//" + window.location.hostname + ":1010/v1/image/1/"
    // this.$root.otherUrl = window.location.protocol + "//" + window.location.hostname + ":1010/v1/image/2/"
    this.$root.baseUrl = "http://172.20.17.99:1010/v1/image/1/"
    this.$root.otherUrl = "http://172.20.17.99:1010/v1/image/2/"
  },
  mounted() {
    
  }
};
</script>

<style lang="less">
  #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // padding-bottom: 50px;
}
</style>
