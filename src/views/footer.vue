<template>
  <div class="suspension-bar">
    <div style="display:flex;flex-direction: row;align-items: center">
      <img src="@/assets/images/logo.png" class="logo-img"/>
      <div class="logo">
        Ethscriptions
        <span class="on">Tools</span>
      </div>
    </div>
    <div class="copyright">Copyright @ETHS Tools {{ $day().year() }}</div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {}
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  watch: {},
  methods: {}
}
</script>

<style scoped lang="less">

.logo {
  margin-left: 10px;
}

.logo-img {
  margin-left: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%
}

@media only screen and (max-width: 600px) {
  .logo-img {
    width: 30px;
    height: 30px;
    border-radius: 50%
  }


  .logo {
    display: flex;
    flex-direction: column;
    justify-content: left;
  }
}

.suspension-bar {
  z-index: 9;
  bottom: 0px !important;
  top: unset;
}

.copyright {
  line-height: 80px;
  color: #fff;
}
</style>
