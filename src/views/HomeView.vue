<template>
  <a-layout>
    <div style="overflow: scroll">
      <div style="display: flex; justify-content: center">
        <div class="displayBlock">
          <div class="textTitle">
            发电情况
          </div>
          <a-divider style="margin: 0"/>
          <div style="display: flex; flex-direction: column; height: 160px;">
            <a-row class="gen-board">
              <a-col :span="11">
                <div class="display-title"><a-icon type="table" class="gen-icon" style="color: #009688"/> &nbsp;月发电量</div>
                <span class="mid-text">{{ mouthGen.toFixed(2) }}</span>&nbsp;kWh
              </a-col>
              <a-col :span="2"><a-divider type="vertical" style="height: 70px"></a-divider></a-col>
              <a-col :span="11">
                <div class="display-title"><a-icon type="area-chart" class="gen-icon" style="color: #0097A7"/> &nbsp;总发电量</div>
                <span v-if="totalGen<1000"><span class="mid-text">{{ totalGen.toFixed(2)}}</span>&nbsp;kWh</span>
                <span v-else-if="totalGen>=1000"><span class="mid-text">{{ (totalGen/1000).toFixed(2) }}</span>&nbsp;MWh</span>
              </a-col>
            </a-row>
            <a-row><a-divider style="width: 20%;" class="m-0"></a-divider></a-row>
            <a-row class="gen-board">
              <a-col :span="11">
                <div class="display-title"><a-icon type="filter" class="gen-icon" style="color: #42b983"/> &nbsp;总减排</div>
                <span v-if="totalGen*0.997<1000">
                <span class="mid-text">{{ (totalGen*0.997).toFixed(2) }}</span>&nbsp;Kg
              </span>
                <span v-else-if="totalGen*0.997>=1000">
                <span class="mid-text">{{ (totalGen*0.997/1000).toFixed(2) }}</span>&nbsp;吨
              </span>
              </a-col>
              <a-col :span="2"><a-divider type="vertical" style="height: 70px"/></a-col>
              <a-col :span="11">
                <div class="display-title"><a-icon type="star" theme="filled" class="gen-icon" style="color: #4CAF50" /> &nbsp;等效植树量</div>
                <span class="mid-text">{{ (totalGen/18.355).toFixed(1) }}</span>&nbsp;棵
              </a-col>
            </a-row>
          </div>
        </div>

        <div class="displayBlock">
          <div class="textTitle">
            电站状态
          </div>
          <a-divider style="margin: 0"/>
          <div id="stateChart" style="height: 160px;"><a-spin size="large" class="spin" v-if="loading"/></div>
        </div>

        <div class="displayBlock">
          <div class="textTitle">
            所有设备
          </div>
          <a-divider style="margin: 0"/>
          <div id="deviceChart" style="height: 160px;"><a-spin size="large" class="spin" v-if="loading"/></div>
        </div>

        <div class="displayBlock" style="display: flex; flex-direction: column; align-items: center;justify-content: center">
          <div style="font-weight: bold; font-size: 18px;">Hello，「{{user.userName}}」</div>
          <br>
          <div>用户类型：{{user.type === 1 ? "机构用户":"业主"}}</div>
          <div>所属机构：{{user.institute}}</div>
        </div>
      </div>
      <a-card style="margin: 0 10px;border-radius: 10px">
        <div id="historyChart" style="height: 400px"></div>
      </a-card>
    </div>
  </a-layout>
</template>

<script>
import * as echarts from 'echarts'
import {getCount} from "@/api/api";
import moment from "moment";

export default {
  name: "HomeView",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      countData: null,
      stateData: [],
      alarmData: [],
      deviceData: [],
      mouthGen: 0,
      totalGen: 0,
      genHistory: [],
      capacityHistory: [],
      loading: true,
    };
  },
  methods: {
    initStateEcharts() {
      let chartDom = document.getElementById('stateChart');
      let myChart = echarts.init(chartDom);
      let total = 0;
      this.stateData.forEach(item => total+=item.value);
      let option =  {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: 'center',
          right: '5%',
          orient: 'vertical',
          formatter: (name) => {
            let value = 0;
            this.stateData.forEach(item => {
              if (item.name === name) {
                value = item.value;
              }
            });
            this.alarmData.forEach(item => {
              if (item.name === name) {
                value = item.value;
              }
            });
            return `${name}: ${value}`;
          }
        },
        series: [
          {
            name: '状态信息',
            type: 'pie',
            center: ['35%', '50%'],
            radius: ['70%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.stateData
          },
          {
            name: '报警信息',
            type: 'pie',
            center: ['35%', '50%'],
            radius: ['55%', '65%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.alarmData
          },
          {
            name: '',
            type: 'pie',
            center: ['35%', '50%'],
            radius: ['55%', '60%'],
            label: {
              show: true,
              position: 'center',
              formatter: '{a|' + total + '}\n{b|总数}',
              rich: {
                a: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  lineHeight: 40
                },
                b: {
                  fontSize: 15,
                  lineHeight: 20
                }
              }
            },
            data: [{value: total, name: ''}],
            tooltip: {
              show: false
            },
            itemStyle: {
              color: 'rgba(0,0,0,0)'
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
    initDeviceEcharts() {
      let chartDom = document.getElementById('deviceChart');
      let myChart = echarts.init(chartDom);
      let total = 0;
      this.deviceData.forEach(item => total+=item.value);
      let option =  {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: 'center',
          right: '5%',
          orient: 'vertical',
          formatter: (name) => {
            let value = 0;
            this.deviceData.forEach(item => {
              if (item.name === name) {
                value = item.value;
              }
            });
            return `${name}: ${value}`;
          }
        },
        series: [
          {
            name: '设备统计',
            type: 'pie',
            center: ['35%', '50%'],
            radius: ['65%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.deviceData
          },
          {
            name: '',
            type: 'pie',
            center: ['35%', '50%'],
            radius: ['55%', '60%'],
            label: {
              show: true,
              position: 'center',
              formatter: '{a|' + total + '}\n{b|总数}',
              rich: {
                a: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  lineHeight: 40
                },
                b: {
                  fontSize: 15,
                  lineHeight: 20
                }
              }
            },
            data: [{value: total, name: ''}],
            tooltip: {
              show: false
            },
            itemStyle: {
              color: 'rgba(0,0,0,0)'
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
    initEchartsDayLine() {
      const dateSort = (a, b) => {
        const timeA = new Date(a[0]).getTime();
        const timeB = new Date(b[0]).getTime();
        return timeA - timeB;
      }
      this.genHistory.sort(dateSort);
      this.capacityHistory.sort(dateSort);

      let daysDiff = 7;
      if (this.genHistory.length > 0) {
        const startTime = this.genHistory[0][0];
        const endTime = this.genHistory[this.genHistory.length - 1][0];
        const startMoment = moment(startTime);
        const endMoment = moment(endTime);
        daysDiff = endMoment.diff(startMoment, 'days');
      }

      // 绘图
      let chartDom = document.getElementById('historyChart');
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
            type: 'bar',
            data: this.genHistory,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          },{
            name: "装机容量",
            type: 'bar',
            data: this.capacityHistory,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          }]
      };
      myChart.setOption(option);
    },
    fetchData(){
      getCount().then(res => {
        this.countData =res.data;
        // console.log(res.data);
        this.stateData.push({value: res.data.onlineNum, name: '在线'});
        this.stateData.push({value: res.data.offlineNum, name: '离线'});
        this.stateData.push({value: res.data.buildNum, name: '建设中'});
        this.alarmData.push({value: res.data.alarmNum, name: '报警'});
        this.alarmData.push({value: res.data.noAlarmNum, name: '正常'});
        this.deviceData.push({value: res.data.dtuNum, name: 'DTU'});
        this.deviceData.push({value: res.data.miNum, name: '微逆'});
        this.loading = false;
        this.initStateEcharts();
        this.initDeviceEcharts();
        this.countGen();
        if(this.countData.genHistory.length>0){
          this.genHistory = this.countData.genHistory.map(item=>{
            return [item.dayTime, item.dayGen]
          });
          this.capacityHistory = this.countData.genHistory.map(item=>{
            return [item.dayTime, item.capacity]
          });
        }
        this.initEchartsDayLine();
      }).catch(error => {
        this.$message.error(error);
      })
    },
    countGen(){
      let currentMonth = new Date().getMonth(); // 获取当前月份（0-11）
      let genHistory = this.countData.genHistory;

      genHistory.forEach(item => {
        this.totalGen += item.dayGen;
        let date = new Date(item.dayTime);
        if (date.getMonth() === currentMonth) {
          this.mouthGen += item.dayGen;
        }
      });
    },
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.displayBlock{
  background-color: #fff;
  width: 25%;
  margin:25px 12px;
  border-radius: 10px;
  height: 38vh;
  border: 1px solid #e2e2e2;
}
.textTitle{
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 22%;
  text-align: left;
  padding-left: 20px;
}
.textTitle p {
  margin: 0;
}
.gen-board{
  flex: 1;
  display: flex;
  align-items: center;
}
.display-title{
  text-align: left;
  font-size: 13px;
  margin-left: 10px;
}
.mid-text{
  font-size: 13px;
  font-weight: bold;
}
.gen-icon{
  font-size: 20px;
}
.spin{
  margin-top: 20%;
}
</style>
