<template>
  <div>
    <a-row :gutter="16" style="margin-bottom: 5px">
      <a-col :span="6">
        <a-card class="card">
          <a-row style="display: flex">
            <span style="font-size: 14px">电站状态</span>
          </a-row>
          <a-divider class="m-0"></a-divider>
          <a-row style="margin: 15px 0">
            <a-col :span="11">
              <div v-if="plantListInfo.state === 0" class="flex-center">
                <a-icon type="wifi" style="color: #42b983;font-size: 2em"/>
                <div class="font-size12 ml-5">
                  <div>网络状态</div>
                  <div>在线</div>
                </div>
              </div>
              <div v-if="plantListInfo.state === 1" class="flex-center">
                <a-icon type="tool" style="font-size: 2em"/>
                <div class="font-size12 ml-5">
                  <div>网络状态</div>
                  <div>接入中</div>
                </div>
              </div>
              <div v-if="plantListInfo.state === 2" class="flex-center">
                <a-icon type="disconnect" style="font-size: 2em"/>
                <div class="font-size12 ml-5">
                  <div>网络状态</div>
                  <div>部分离线</div>
                </div>
              </div>
            </a-col>
            <a-col :span="2" >
              <a-divider type="vertical" style="height: 40px"></a-divider>
            </a-col>
            <a-col :span="11">
              <div v-if="plantListInfo.alarm === false" class="flex-center">
                <a-icon type="check-circle" style="color: #42b983;font-size: 2em"/>
                <div class="font-size12 ml-5">
                  <div>系统状态</div>
                  <div>正常</div>
                </div>
              </div>
              <div v-if="plantListInfo.alarm === true" class="flex-center">
                <a-icon type="exclamation-circle" style="font-size: 2em;color: #f50"/>
                <div class="font-size12 ml-5">
                  <div>系统状态</div>
                  <div>报警</div>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row >
            <div style="height: 180px">
              <img :src="this.plantListInfo.cover?this.coverUrlWithPrefix(this.plantListInfo.cover):null" class="img">
            </div>
          </a-row>
        </a-card>
      </a-col>

      <a-col :span="9">
        <a-card class="card">
          <a-row style="display: flex">
            <span style="font-size: 14px">当前功率</span>
          </a-row>
          <a-divider class="m-0"></a-divider>
          <a-row style="height: 200px">
            <a-col :span="12"><div id="liquidFill" style="height: 250px"></div></a-col>
            <a-col :span="12">
              <a-row style="height:125px">
                <div class="second-title"><span>发电功率</span></div>
                <span class="big-text">{{plantListInfo.power}}</span>&nbsp;kW
              </a-row>
              <a-divider class="m-0"/>
              <a-row>
                <div class="second-title"><span>装机容量</span></div>
                <span class="big-text">{{plantListInfo.capacity}}</span>&nbsp;kWp
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :span="9">
        <a-card class="card">
          <a-row style="display: flex">
            <span style="font-size: 14px">电站概况</span>
          </a-row>
          <a-divider class="m-0"/>
          <a-row class="gen-box" style="text-align: left">
            <a-col :span="16" class="flex-center">
              <a-icon type="thunderbolt" class="gen-icon" style="color: #fadb14"/> &nbsp;日发电量
            </a-col>
            <a-col :span="8">
              <span style="font-weight: bold">{{plantListInfo.dayGen}}</span>&nbsp;kWh
            </a-col>
          </a-row>

          <a-divider class="m-0"/>
          <a-row class="gen-box" style="text-align: left">
            <a-col :span="16" class="flex-center">
              <a-icon type="table" class="gen-icon" style="color: #a0d911"/> &nbsp;月发电量
            </a-col>
            <a-col :span="8">
              <span style="font-weight: bold">{{monthGen.toFixed(2)}}</span>&nbsp;kWh
            </a-col>
          </a-row>

          <a-divider class="m-0"/>
          <a-row class="gen-box" style="text-align: left">
            <a-col :span="16" class="flex-center">
              <a-icon type="area-chart" class="gen-icon" style="color: #4096ff"/> &nbsp;年发电量
            </a-col>
            <a-col :span="8">
              <span style="font-weight: bold">{{yearGen.toFixed(2)}}</span>&nbsp;kWh
            </a-col>
          </a-row>

          <a-divider class="m-0"/>
          <a-row class="gen-box" style="text-align: left">
            <a-col :span="16" class="flex-center">
              <a-icon type="pie-chart" class="gen-icon" style="color: #13c2c2"/> &nbsp;总发电量
            </a-col>
            <a-col :span="8">
              <span style="font-weight: bold">{{totalGen.toFixed(2)}}</span>&nbsp;kWh
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16" class="mt-10">
      <a-col :span="18" style="height: 450px">
        <a-card>
          <div id="dayLine" style="height: 400px;width: 100%"></div>
        </a-card>
      </a-col>
      <a-col :span="6" >
        <a-row class="flex-center" style="height: 280px">
          <div id="he-plugin-standard" style="width: 100%;"></div>
        </a-row>
        <a-row>
          <a-card style="margin-top: 10px;height: 160px">
            <a-row style="display: flex">
              <span style="font-size: 14px">收益信息</span>
            </a-row>
            <a-divider class="m-0"></a-divider>
            <a-row style="margin-top: 20px">
              <a-col :span="11">
                <div class="font-size12 ml-5">
                  <a-icon type="dollar" style="color: #fadb14;font-size: 2em"/>
                  <div>总收益</div>
                  <div v-if="benefit<10000"><span class="mid-text">{{ benefit }}</span>&nbsp元</div>
                  <div v-else><span class="mid-text">{{ (benefit/10000).toFixed(2) }}</span>&nbsp万元</div>
                </div>
              </a-col>
              <a-col :span="2" >
                <a-divider type="vertical" style="height: 40px"></a-divider>
              </a-col>
              <a-col :span="11">
                <div class="font-size12 ml-5">
                  <a-icon type="rest" style="color: #42b983;font-size: 2em"/>
                  <div>总减排</div>
                  <span v-if="totalGen*0.997<1000">
                    <span class="mid-text">{{ (totalGen*0.997).toFixed(2) }}</span>&nbsp;&nbspKg
                  </span>
                  <span v-else-if="totalGen*0.997>=1000">
                    <span class="mid-text">{{ (totalGen*0.997/1000).toFixed(2) }}</span>&nbsp;&nbsp吨
                  </span>
                </div>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {detailPlant, detailPlantHistory, detailPlantList} from "@/api/api";
import * as echarts from "echarts";
import  'echarts-liquidfill'
import moment from "moment/moment";

export default {
  name: "PlantBoard",
  data() {
    return {
      plantId: null,
      plantListInfo: {},
      plantBasicInfo: {},
      plantHistoryInfo: {},
      plantHistoryDayGen: {},
      plantHistoryCapacity: {},
      monthGen: 0,
      yearGen: 0,
      totalGen: 0,
    }
  },
  methods: {
    fetchPlantListData(){
      detailPlantList(this.plantId).then(res => {
        this.plantListInfo = res.data;
        this.initEchartsLiquidFill();
        this.initWeather();
        //由于日发电没写到历史信息中，需要加上日发电
        this.monthGen += this.plantListInfo.dayGen;
        this.yearGen += this.plantListInfo.dayGen;
        this.totalGen += this.plantListInfo.dayGen;
      }).catch(error => {
        console.error(error)
      })
    },
    fetchPlantHistoryData(){
      detailPlantHistory(this.plantId).then(res => {
        this.plantHistoryInfo = res.data;
        // 绘制历史数据曲线
        this.plantHistoryInfo.sort((a,b)=>{return new Date(a.dayTime) - new Date(b.dayTime)})
        // console.log(this.plantHistoryInfo);
        this.plantHistoryDayGen = this.plantHistoryInfo.map(item=>{
          return [item.dayTime, item.dayGen]
        })
        this.plantHistoryCapacity = this.plantHistoryInfo.map(item=>{
          return [item.dayTime, item.capacity]
        })
        this.initEchartsDayLine();

        // 计算月年总发电量
        this.plantHistoryInfo.forEach(item => {
          // 将字符串类型的日期转换为Date对象
          const date = new Date(item.dayTime);
          // 判断是否为本月份
          if (date.getMonth() === new Date().getMonth()) {
            this.monthGen += item.dayGen;
          }
          // 判断是否为本年份
          if (date.getFullYear() === new Date().getFullYear()) {
            this.yearGen += item.dayGen;
          }
          // 计算总量
          this.totalGen += item.dayGen;
        });
      }).catch(error => {
        console.error(error)
      })
    },
    fetchPlantBasicInfoData(){
      detailPlant(this.plantId).then(res=>{
        this.plantBasicInfo = res.data;
        // console.log(res.data)
      })
    },
    initEchartsLiquidFill() {
      let chartDom = document.getElementById('liquidFill');
      let myChart = echarts.init(chartDom);
      let option = {
        backgroundColor: 'white',
        series: [{
          type: 'liquidFill',
          radius: 140,
          data: [this.plantListInfo.capacity? (this.plantListInfo.power / this.plantListInfo.capacity).toFixed(2):0],
          label: {
            normal: {
              fontSize: 18
            }
          }
        }],
        tooltip: {
          show: true,
          formatter: '功率归一化:{c}'
        },
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#156ACF',
          }
        }
      };
      myChart.setOption(option);
    },
    initEchartsDayLine() {
      // 计算总天数
      let daysDiff = 7;
      if (this.plantHistoryDayGen.length > 0) {
        const startTime = this.plantHistoryDayGen[0][0];
        const endTime = this.plantHistoryDayGen[this.plantHistoryDayGen.length - 1][0];
        const startMoment = moment(startTime);
        const endMoment = moment(endTime);
        daysDiff = endMoment.diff(startMoment, 'days');
      }

      let chartDom = document.getElementById('dayLine');
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        legend: {
          left: 'right'
        },
        title: {
          text: '历史数据',
        },
        dataZoom: [
          {
            type: 'inside',
            start: (daysDiff-7)/daysDiff*100, // 显示最近七天
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'time',
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: "发电量",
            type: 'line',
            data: this.plantHistoryDayGen,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          },{
            name: "装机容量",
            type: 'line',
            data: this.plantHistoryCapacity,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          }]
      };
      myChart.setOption(option);
    },
    initWeather(){
      //和风天气插件调用
      if(this.plantListInfo.lat && this.plantListInfo.lng){
        let city = this.plantListInfo.lng.toString()+','+this.plantListInfo.lat.toString();
        window.WIDGET = {
          "CONFIG": {
            "layout": "2",
            "height": 280,
            "width": 240,
            "background": "1",
            "dataColor": "FFFFFF",
            "city": city,
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
      }
    },
    goBack(){
      this.$router.push("/platform/plantDetails/devices")
    }
  },
  computed:{
    benefit(){
      if(this.plantBasicInfo.elecBenefit && this.totalGen){
        let benefit = this.plantBasicInfo.elecBenefit * this.totalGen;
        if(this.plantBasicInfo.selfUseRate)
          return (benefit*(100-this.plantBasicInfo.selfUseRate)/100).toFixed(2);
        else
          return (benefit).toFixed(2);
      }
      return null;
    }
  },
  created() {
    this.plantId = localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null
    this.fetchPlantListData();
    this.fetchPlantBasicInfoData();
    this.fetchPlantHistoryData();
  },
}
</script>

<style scoped>
.second-title{
  text-align: left;
  margin: 20px 0px;
  font-size: 14px;
}
.big-text{
  font-size: 18px;
  font-weight: bold;
}
.mid-text{
  font-size: 13px;
  font-weight: bold;
}
.gen-box{
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.img{
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.card{
  height: 300px;
}
.gen-icon{
  font-size: 25px;
}

</style>