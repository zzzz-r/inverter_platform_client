<template>
  <div className="nav-header-wrapper">
    <div id="he-plugin-standard"></div>
  </div>
</template>

<script src="https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0"></script>
<script>
export default {
  created(){
    //和风天气插件调用
    window.WIDGET = {
      "CONFIG": {
        "layout": "1",
        "width": "450",
        "height": "150",
        "background": "1",
        "dataColor": "FFFFFF",
        "key": "1b9531ce6dea4cd2995818f186ca4051"
      }
    }
  },
}

</script>

<style scoped>
.nav-header-wrapper {
  /*height: 90px;*/
  z-index: 99;
}
</style>
