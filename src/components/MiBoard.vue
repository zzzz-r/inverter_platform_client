<template>
  <div>
    <a-row>
      <a-card style="display: flow;margin-bottom: 5px">
        <div style="display: inline-block;float: left">
          <a @click="goBack">返回</a>&nbsp&nbsp
          <span style="font-size: 20px;font-weight: bold">逆变器详情</span>
          <a-divider type="vertical"></a-divider>
          <span>ID: {{miInfo?miInfo.id:null}}</span>&nbsp&nbsp&nbsp&nbsp
          <span>连接DTU: {{miInfo?miInfo.dtuId:null}}</span>&nbsp&nbsp&nbsp&nbsp
          <a-tag color="#87d068" v-if="miInfo.state === 0">在线</a-tag>
          <a-tag color="#f50" v-else>离线</a-tag>

          <span v-if="miInfo.state === 0">
            <a-tag color="#87d068" v-if="miInfo.ifAlarm === 0">正常</a-tag>
            <a-tag color="#f50" v-else>报警</a-tag>
          </span>
        </div>
        <a-button type="danger" style="float: right" @click="showDeleteConfirm">移除设备</a-button>
      </a-card>
    </a-row>
    <a-row :gutter="16" style="margin-bottom: 5px">
      <a-col :span="16">
        <a-card>
          <a-row style="display: flex">
            <span style="font-size: 15px">实时发电信息</span>
            <span style="margin-left: auto">数据更新于: {{miInfo.updateTime !== null ? new Date(miInfo.updateTime).toLocaleString():null}}</span>
          </a-row>
          <a-divider class="m-0"></a-divider>
          <a-row style="height: 200px">
            <a-col :span="12"><div id="liquidFill" style="height: 200px"></div></a-col>
            <a-col :span="12">
              <a-row style="height:100px">
                <div class="second-title"><span>当前发电功率</span></div>
                <span class="big-text">{{miInfo.power}}</span>&nbsp;kW
              </a-row>
              <a-divider class="m-0"/>
              <a-row>
                <div class="second-title"><span>设备额定功率</span></div>
                <span class="big-text">{{miInfo.capacity}}</span>&nbsp;kWp
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <a-row class="display-box" style="background-color: #EDFBFD ">
            <a-col :span="12">
              <div class="display-title">日发电量</div>
              <span class="mid-text">{{ miInfo ? miInfo.dayGen : null}}</span>&nbsp;kW
            </a-col>
            <a-col :span="12">
              <div class="display-title">温度</div>
              <span class="mid-text">{{ miInfo ? miInfo.temperature : null}}</span>&nbsp;℃
            </a-col>
          </a-row>
          <a-row class="display-box" style="background-color: #F0FDED">
            <a-col :span="12">
              <div class="display-title">电网电压</div>
              <span class="mid-text">{{ miInfo ? miInfo.gridVoltage: null}}</span>&nbsp;V
            </a-col>
            <a-col :span="12">
              <div class="display-title">电网频率</div>
              <span class="mid-text">{{ miInfo ? miInfo.freq : null}}</span>&nbsp;Hz
            </a-col>
          </a-row>
          <a-row class="display-box" style="background-color: #FAFFCB">
            <a-col :span="12" >
              <div class="display-title">PV输入电压</div>
              <span class="mid-text">{{ miInfo ? miInfo.dcVoltage : null}}</span>&nbsp;V
            </a-col>
            <a-col :span="12">
              <div class="display-title">PV输入电流</div>
              <span class="mid-text">{{ miInfo ? miInfo.dcCurrent : null}}</span>&nbsp;A
            </a-col>
          </a-row>
          <a-row class="display-box" style="background-color: #FCEBDD ">
            <a-col :span="12">
              <div class="display-title">交流输出电压</div>
              <span class="mid-text">{{ miInfo ? miInfo.acVoltage : null}}</span>&nbsp;V
            </a-col>
            <a-col :span="12">
              <div class="display-title">交流输出电流</div>
              <span class="mid-text">{{ miInfo ? miInfo.acCurrent : null}}</span>&nbsp;A
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-card >
        <div id="dayLine" style="height: 450px;width: 100%"></div>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import {deleteMi, getMiAllInfo, getMiDayPowerInfo} from "@/api/api";
import * as echarts from "echarts";
import  'echarts-liquidfill'

export default {
  name: "MiBoard",
  data() {
    return {
      miId: null,
      miInfo: {},
      miDayPowerInfo: {},
      powerData: {},
      temperatureData: {},
      gridVoltageData: {},
      freqData: {},
    }
  },
  methods: {
    initEchartsLiquidFill() {
      let chartDom = document.getElementById('liquidFill');
      let myChart = echarts.init(chartDom);
      let option = {
        backgroundColor: 'white',
        series: [{
          type: 'liquidFill',
          radius: 160,
          data: [this.miInfo.capacity? (this.miInfo.power / this.miInfo.capacity).toFixed(2):0],
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
      let chartDom = document.getElementById('dayLine');
      let myChart = echarts.init(chartDom);
      // 绘制图表
      const today = new Date(); // 获取当前时间
      today.setHours(0, 0, 0, 0); // 将小时、分、秒和毫秒数都设置为 0
      const startOfDay = today.getTime(); // 获取今天开始的时间戳
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1; // 获取今天结束的时间戳
      let option;
      option = {
        legend: {
          left: 'right'
        },
        title: {
          text: '24小时参数变化曲线',
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
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
          min: startOfDay,
          max: endOfDay,
          splitNumber: 8,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: "发电功率",
            type: 'line',
            data: this.powerData,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          },{
            name: "温度",
            type: 'line',
            data: this.temperatureData,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          },{
            name: "电网电压",
            type: 'line',
            data: this.gridVoltageData,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          }, {
            name: "电网频率",
            type: 'line',
            data: this.freqData,
            smooth: true,
            symbol: 'none',
            sampling: 'lttb',
          }]
      };
      myChart.setOption(option);
    },
    goBack(){
      this.$router.push("/platform/plantDetails/devices")
    },
    showDeleteConfirm(id) {
      this.$confirm({
        title: '删除微型逆变器',
        content: '确定要删除选中微型逆变器吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => { //使用箭头函数绑定外部函数的上下文，this将指向Vue实例
          this.handleDelete(id);
        },
      });
    },
    handleDelete(){
      deleteMi(this.miId).then(() => {
        this.goBack();
        this.$message.success('删除成功');
      }).catch(error => {
        console.log(error)
      })
    },
  },
  mounted() {
    this.miId = localStorage.getItem("miId") ? JSON.parse(localStorage.getItem("miId")) : null

    getMiAllInfo(this.miId).then(res => {
      this.miInfo = res.data;
      // console.log(res.data);
      this.initEchartsLiquidFill();
    }).catch(error => {
      console.error(error)
    })

    getMiDayPowerInfo(this.miId).then(res=> {
      // console.log(res.data);
      this.miDayPowerInfo = res.data;
      this.miDayPowerInfo.sort((a,b)=>{return new Date(a.updateTime) - new Date(b.updateTime)})
      this.powerData = this.miDayPowerInfo.map(item=>{
        return [item.updateTime, item.power]
      })
      this.temperatureData = this.miDayPowerInfo.map(item=>{
        return [item.updateTime, item.temperature]
      })
      this.gridVoltageData = this.miDayPowerInfo.map(item=>{
        return [item.updateTime, item.gridVoltage]
      })
      this.freqData = this.miDayPowerInfo.map(item=>{
        return [item.updateTime, item.freq]
      })
      this.initEchartsDayLine();
    })
  },
}
</script>

<style scoped>
.second-title{
  text-align: left;
  margin: 15px 0px;
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
.display-box{
  height: 56px;
  margin: 0;
  border-radius: 8px;
}
.display-title{
  text-align: left;
  font-size: 13px;
  margin:5px 10px;
}

</style>