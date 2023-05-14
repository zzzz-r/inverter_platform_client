<template>
  <div style="background: #fff;padding: 10px;height: 100vh">
    <div style="display: flex;justify-content: left;margin: 10px 0">
      <a-select default-value="发电量" style="width: 120px" class="mr-10">
        <a-select-option value="发电量">
          发电量
        </a-select-option>
      </a-select>
      <a-range-picker @change="onSelectedDateChange" />
      <div style="margin-left: auto">
        <a-button class="mr-10" type="primary" @click="fetchData">生成报表</a-button>
        <a-button  class="mr-10" @click="exportGenReport">导出报表<a-icon type="download" /></a-button>
      </div>
    </div>
    <div>
      <a-table
          :columns="columns"
          :data-source="data"
          :locale="{ emptyText: '暂无数据' }"
          size="small"
          rowKey="dayTime"
          :bordered="true"
          :loading="loading"
          :pagination="false"
      >
        <template slot="dayTime" slot-scope="text">
          {{ $moment(text).format('YYYY-MM-DD') }}
        </template>
      </a-table>
      <div style="text-align: left; margin: 10px 10px">
        <span>发电量合计：{{(totalGen).toFixed(2)}} kWh</span>
      </div>
    </div>
 </div>
</template>

<script>
import {exportGenReport, getGenReport} from "@/api/api";
import { serverIp} from "@/config/config";

export default {
  name: "Report",
  data(){
    return{
      plantId: localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null,
      columns: [
        {
          title: '电站名称',
          dataIndex: 'name',
        },
        {
          title: '日期',
          dataIndex: 'dayTime',
          scopedSlots: { customRender: 'dayTime' },
        },
        {
          title: '发电量(kWh)',
          dataIndex: 'dayGen',
        },
      ],
      data: [],
      loading: false,
      startDate: null,
      endDate: null,
      totalGen: 0,
    };
  },
  methods: {
    onSelectedDateChange(date, dateString) {
      this.startDate = dateString[0];
      this.endDate =dateString[1];
      console.log(this.startDate, this.endDate);
    },
    fetchData(){
      this.loading = true;
      getGenReport(this.plantId,this.startDate,this.endDate).then( res => {
        console.log(res.data)
        this.data = res.data;
        this.data.forEach(item => this.totalGen+=item.dayGen);
        this.loading=false
      }).catch(error => {
        this.$message.error(error);
      })
    },
    exportGenReport(){
      exportGenReport(this.plantId, this.startDate, this.endDate);
    }
  },

}
</script>

<style scoped>

</style>