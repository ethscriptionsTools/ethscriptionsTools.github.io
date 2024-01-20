<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'APP',
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-loading-spinner i {
  color: #0e0e0e!important;
}

.el-loading-spinner .el-loading-text {
  color: #0e0e0e!important;
}


.dialog-loading {
  .el-dialog {
    display: flex;
    align-items: center;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      width: 100%;
      font-size: 50px;

      .el-loading-spinner {
        margin-top: 15px;
      }
    }
  }

  //width: 300px;
  //height: 300px;
}

</style>
