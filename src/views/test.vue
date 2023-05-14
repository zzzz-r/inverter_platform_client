<template>
  <div>
    <div id="he-plugin-standard"></div>
  </div>
</template>

<script>
export default {
  created(){
    //和风天气插件调用
    window.WIDGET = {
      "CONFIG": {
        "layout": "2",
        "width": 230,
        "height": 450,
        "background": "1",
        "dataColor": "FFFFFF",
        "city": "116.41,39.92",
        "key": "589304d701b947cbb7e64a853ec069a2"
      }
    };
    (function (d) {
      var c = d.createElement('link')
      c.rel = 'stylesheet'
      c.href = 'https://widget.qweather.net/standard/static/css/he-standard.css?v=1.4.0'
      var s = d.createElement('script')
      s.src = 'https://widget.qweather.net/standard/static/js/he-standard.js?v=1.4.0'
      var sn = d.getElementsByTagName('script')[0]
      sn.parentNode.insertBefore(c, sn)
      sn.parentNode.insertBefore(s, sn)
    })(document)
  },
}
</script>