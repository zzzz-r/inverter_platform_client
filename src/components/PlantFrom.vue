<template>
  <div>
    <a-drawer
        title="添加电站"
        placement="top"
        height="600"
        :visible="ifVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="onAddDrawerClose"
    >
      <div style="margin: 0 50px">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content">
          <a-form :form="form" :model="editableItem" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" >
            <template v-if="current === 0">
              <!-- 第一步要渲染的组件 -->
                <a-form-item label="电站名称">
                  <a-input v-model="editableItem.name"
                           v-decorator="['name', { rules: [{ required: true, message: '请输入电站名称' }] }]"
                  />
                </a-form-item>
              <a-form-item label="电站区域">
                <div id="container"></div>
              </a-form-item>
              <a-form-item label="Select" has-feedback>
                <a-select
                    v-decorator="[
          'select',
          { rules: [{ required: true, message: 'Please select your country!' }] },
        ]"
                    placeholder="Please select a country"
                >
                  <a-select-option value="china">
                    China
                  </a-select-option>
                  <a-select-option value="usa">
                    U.S.A
                  </a-select-option>
                </a-select>
              </a-form-item>
<!--              <template class="posSelect-container">-->
                <a-form-item label="province" has-feedback>
                  <a-select v-decorator="['province', { rules: [{ required: true, message: '请输入电站名称' }] }]"
                      class="posSelect" v-model="province" placeholder="请选择省份" @change="onProvinceChange">
                    <a-select-option @click="handleClickProvince" v-for="(province, index) in provinces" :key="index" :value="province">{{ province }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select  v-decorator="['name2', { rules: [{ required: true, message: '请输入电站名称' }] }]"
                      class="posSelect" v-model="city" placeholder="请选择城市" @change="onCityChange" v-show="cities.length>0||city">
                    <a-select-option @click="handleClickCity" v-for="(city, index) in cities" :key="index" :value="city">{{ city }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-select  v-decorator="['name3', { rules: [{ required: true, message: '请输入电站名称' }] }]"
                      class="posSelect" v-model="county" placeholder="请选择区县" @change="onCountyChange" v-show="counties.length>0||county">
                    <a-select-option v-for="(county, index) in counties" :key="index" :value="county">{{ county }}</a-select-option>
                  </a-select>
                </a-form-item>
<!--              </template>-->
              <a-form-item label="详细地址">
                <a-input id="address" v-model="editableItem.address"
                         v-decorator="['address', { rules: [{ required: true, message: '请输入电站详细地址' }] }]"
                />
              </a-form-item>
              <a-form-item label="经纬度" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
                <a-input id="lng" v-model="editableItem.lng"
                         v-decorator="['lng', { rules: [{ required: true, message: '请输入经度' }] }]"
                         style="width: 48%; margin-right: 4%"
                />
                <a-input id="lat" v-model="editableItem.lat"
                         v-decorator="['lat', { rules: [{ required: true, message: '请输入纬度' }] }]"
                         style="width: 48%"
                />
              </a-form-item>
            </template>
            <template v-else-if="current === 1">
              <!-- 第二步要渲染的组件 -->
              <input type="text" placeholder="请输入系统信息" />
            </template>
            <template v-else-if="current === 2">
              <!-- 第三步要渲染的组件 -->
              <input type="text" placeholder="请输入收益信息" />
            </template>
            <template v-else-if="current === 3">
              <!-- 第四步要渲染的组件 -->
              <input type="text" placeholder="请输入业主信息" />
            </template>
          </a-form>
        </div>
        <div class="steps-action">
          <a-button v-if="current > 0" class="steps-but" @click="prev">
            上一步
          </a-button>
          <a-button v-if="current < steps.length - 1" class="steps-but" type="primary" @click="next">
            下一步
          </a-button>
          <a-button
              v-if="current == steps.length - 1"
              type="primary"
              class="steps-but"
              @click="$message.success('Processing complete!')"
          >
            提交
          </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import GetPosMap from "@/components/GetPosMap.vue";
import AMapLoader from '@amap/amap-jsapi-loader';
window._AMapSecurityConfig = {
  securityJsCode: 'f06653a86b643465e607ae67ffddc067'
}

export default {
  name: "PlantFrom",
  components: {GetPosMap},
  data() {
    return{
      current: 0,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      steps: [
        {
          title: '基础信息',
          content: 'First-content',
        },
        {
          title: '系统信息',
          content: 'Second-content',
        },
        {
          title: '收益信息',
          content: 'Last-content',
        },
        {
          title: '业主信息',
          content: 'Last-content',
        }
      ],
      editableItem: {
        id: "",
        name: "",
        province: "",
        city: "",
        county: "",
        address: "",
        lat: "",
        lng: "",
        buildDate: "",
        plantType: "",
        sysType: "",
        capacity: "",
        selfUseRate: "",
        elecBenefit: "",
        subsidyBenefit: "",
        cost: "",
        daily_repay: "",
        ownerName: "",
        ownerTel: "",
        cover: "",
      },
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
  props:{
    ifVisible: Boolean,
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
  methods:{
    onAddDrawerClose() {
      this.ifVisible = false;
      this.$emit("drawerClose",this.ifVisible)
    },
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    },
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
  mounted() {
    this.initAMap();
    console.log(this.cities.length)
  },
}
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 400px;
}
.posSelect-container{
  display:flex;
  justify-content: left;
  margin-top: 30px;
}
.posSelect{
  width: 180px;
  margin: 0 10px ;
  overflow: auto;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fff;
  min-height: 200px;
  text-align: center;
  padding: 20px 20px;
}
.steps-action {
  margin-top: 24px;
  text-align: center;
}
.steps-but{
  margin:0 5px;
  width: 10%;
}
</style>