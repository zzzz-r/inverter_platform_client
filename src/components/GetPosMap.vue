<template>
  <div>
    <div id="container"></div>
    <div class="posSelect-container">
      <a-select class="posSelect" v-model="province" placeholder="请选择省份" @change="onProvinceChange">
        <a-select-option @click="handleClickProvince" v-for="(province, index) in provinces" :key="index" :value="province">{{ province }}</a-select-option>
      </a-select>
      <a-select class="posSelect" v-model="city" placeholder="请选择城市" @change="onCityChange" v-show="cities.length>0||city">
        <a-select-option @click="handleClickCity" v-for="(city, index) in cities" :key="index" :value="city">{{ city }}</a-select-option>
      </a-select>
      <a-select class="posSelect" v-model="county" placeholder="请选择区县" @change="onCountyChange" v-show="counties.length>0||county">
        <a-select-option v-for="(county, index) in counties" :key="index" :value="county">{{ county }}</a-select-option>
      </a-select>
    </div>
  </div>
</template>


<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import handle from "ant-design-vue/lib/vc-slider/src/Handle";
window._AMapSecurityConfig = {
  securityJsCode: 'f06653a86b643465e607ae67ffddc067'
}

export default {
  name: "GetPosMap",
  computed: {
    handle() {
      return handle
    }
  },
  data() {
    return {
      lat: 0,
      lng: 0,
      province: undefined,
      city: undefined,
      county: undefined,
      provinces: [], // 保存所有省份数据
      cities: [], // 保存当前省份下的所有城市数据
      counties: [], // 保存当前城市下的所有区县数据
      marker: null,
    };
  },
  watch:{
    province(){
      if(this.province)
        this.onProvinceChange();
    },
    city(){
      if(this.city)
        this.onCityChange();
    },
    county(){
      if(this.county)
        this.onCountyChange();
    },
  },
  created() {

  },
  mounted() {
    this.initAMap();
    console.log(this.cities.length)
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: '7206aff33a411fb4ae512f160d58668f',  //设置您的key
        version: "2.0",
        plugins: ['AMap.Geolocation','AMap.Geocoder','AMap.Marker',],
        AMapUI: {
          version: "1.1",
          plugins: [],
        },
        Loca: {
          version: "2.0"
        },
      }).then((AMap) => {
        this.map = new AMap.Map("container", {
          viewMode: "3D",
          zoom: 5,
          zooms: [2, 22],
          center: [105.602725, 37.076636],
        });

        // 获取所有省份的数据
        AMap.plugin(["AMap.DistrictSearch"], () => {
          const districtSearch = new AMap.DistrictSearch({
            level: "province",
            showbiz: false,
            extensions: "all",
            subdistrict: 1,
          });
          districtSearch.search("中国", (status, result) => {
            if (status === "complete") {
              const districts = result.districtList[0].districtList;
              this.provinces = districts.map((district) => district.name);
            }
          });
        });

        //添加定位等组件
        this.map.addControl(new AMap.Geolocation())

        // 添加地图点击事件
        this.map.on("click", (event) => {
          this.lng = event.lnglat.getLng(); // 保存点击位置的经纬度信息
          this.lat = event.lnglat.getLat();

          // 移除旧标记
          if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
          }

          // 创建 AMap.Geocoder 对象
          const  geocoder = new AMap.Geocoder({
            city: "全国"
          });
          // 使用 AMap.Geocoder 对象获取完整位置信息
          geocoder.getAddress([this.lng, this.lat], (status, result) => {
            if (status === "complete" && result.regeocode) {
              const addressComponent = result.regeocode.addressComponent;
              this.province = addressComponent.province; // 保存省份信息
              this.city = addressComponent.city; // 保存城市信息
              this.county = addressComponent.district; // 保存区县信息
              // 创建标记
              this.marker = new AMap.Marker({
                position: [this.lng, this.lat],
                map: this.map,
              });
            }
          });
        });
      }).catch(e => {
        console.log(e);
      });
    },
    onProvinceChange() {
      console.log("onProvinceChange")
      this.cities = [];
      this.counties = [];
      const districtSearch = new AMap.DistrictSearch({
        level: "city",
        showbiz: false,
        extensions: "all",
        subdistrict: 1,
      });
      districtSearch.search(this.province, (status, result) => {
        if (status === "complete") {
          const districts = result.districtList[0].districtList;
          this.cities = districts.map((district) => district.name);
        }
      });
    },
    onCityChange() {
      console.log("onCityChange")
      this.counties = [];
      // 根据选中的省份和城市，获取对应的区县数据
      this.counties = [];
      const districtSearch = new AMap.DistrictSearch({
        level: "district",
        showbiz: false,
        extensions: "all",
        subdistrict: 1,
      });
      districtSearch.search(this.city, (status, result) => {
        if (status === "complete") {
          const districts = result.districtList[0].districtList;
          this.counties = districts.map((district) => district.name);
        }
      });
    },
    onCountyChange() {
      console.log("onCountyChange")
      // 根据选中的省份、城市和区县，获取对应的经纬度和详细地址信息
      const address = `${this.province}${this.city}${this.county}`;
      const geocoder = new AMap.Geocoder({
        city: address,
      });
      geocoder.getLocation(address, (status, result) => {
        if (status === "complete" && result.geocodes.length) {
          const location = result.geocodes[0].location;
          this.lat = location.lat;
          this.lng = location.lng;
          // 将地图移动到选中位置
          this.map.setCenter([this.lng, this.lat]);
          this.map.setZoom(10);
        }
      });
    },
    handleClickProvince() {
      console.log("handleClickProvince")
      this.city = undefined;
      this.county = undefined;
    },
    handleClickCity(){
      console.log("handleClickCity")
      this.county = undefined;
    }

  },
}
</script>
<style scoped>


</style>