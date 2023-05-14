<template>
  <div>
    <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="data"
        :locale="{ emptyText: '暂无数据' }"
        size="small"
        rowKey="id"
        :bordered="true"
        :loading="loading"
    >
      <template slot="plantName" slot-scope="text" >
        {{text}}
      </template>

      <template slot="alarmName" slot-scope="text,record">
        <a-tag color="#ff4d4f" v-if="record.state === 1">离线</a-tag>
        <span v-else="true">
          <a-tag color="#ff7a45" v-if="record.temperature === 1">温度异常</a-tag>
          <a-tag color="#8c8c8c" v-if="record.freq === 1">频率异常</a-tag>
          <a-tag color="#ff85c0" v-if="record.dcCurrent === 1">PV电流异常</a-tag>
          <a-tag color="#69b1ff" v-if="record.dcVoltage === 1">PV电压异常</a-tag>
          <a-tag color="#5cdbd3" v-if="record.acCurrent === 1">交流电流异常</a-tag>
          <a-tag color="#95de64" v-if="record.acVoltage === 1">交流电压异常</a-tag>
          <a-tag color="#b37feb" v-if="record.gridVoltage === 1">电网电压异常</a-tag>
        </span>
      </template>

      <template slot="updateTime" slot-scope="text,record" >
        <span>{{ new Date(record.updateTime).toLocaleString() }}</span>
      </template>

      <template slot="operation" slot-scope="text,record" >
<!--        <a-button type="link">提交工单</a-button>|-->
        <a-button type="link" @click="toMiDetails(record)">查看详情</a-button>
      </template>

    </a-table>
  </div>
</template>

<script>
import {listAlarmMi, listMi} from "@/api/api";

const columns = [
  {
    title: '设备编号',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '所属电站',
    dataIndex: 'plantName',
    scopedSlots: {customRender: 'plantName'},
    onFilter: (value, record) => { return record.plantName.indexOf(value) === 0;},
  },
  {
    title: '报警名称',
    dataIndex: 'alarmName',
    width:220,
    scopedSlots: {customRender: 'alarmName'},
    filters: [
      {
        text: '离线',
        value: 0,
      },
      {
        text: '温度异常',
        value: 1,
      },
      {
        text: '频率异常',
        value: 2,
      },
      {
        text: 'PV电流异常',
        value: 3,
      },{
        text: 'PV电压异常',
        value: 4,
      },{
        text: '交流电流异常',
        value: 5,
      },{
        text: '交流电压异常',
        value: 6,
      },{
        text: '电网电压异常',
        value: 7,
      },
    ],
    onFilter: (value, record) => {
      switch(value) {
        case 0:
          return record.state === 1;
        case 1:
          return (record.temperature === 1)&&(record.state === 0);
        case 2:
          return (record.freq === 1)&&(record.state === 0);
        case 3:
          return (record.dcCurrent === 1)&&(record.state === 0);
        case 4:
          return (record.dcVoltage === 1)&&(record.state === 0);
        case 5:
          return (record.acCurrent === 1)&&(record.state === 0);
        case 6:
          return (record.acVoltage === 1)&&(record.state === 0);
        case 7:
          return (record.gridVoltage === 1)&&(record.state === 0);
        default:
          return false;
      }
    },
  },
  {
    title: '报警开始时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' },
    sorter: (a, b) => {
      // 将日期字符串转化为时间戳，然后比较
      return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
    },
  },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
];

export default {
  name: "MiAlarmList",
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      plantsFilter: [],
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      listAlarmMi().then( res => {
        // console.log(res.data)
        this.data = res.data;

        // 建立电站筛选列
        let plants = Array.from(new Set(this.data.map(item => item.plantName)))
        this.plantsFilter = plants.map(plant => ({ text: plant, value: plant }))
        // 将筛选项添加到对应的列
        this.columns.forEach(column => {
          if (column.dataIndex === 'plantName') {
            column.filters = this.plantsFilter;
          }
        })

        this.loading=false
      }).catch(error => {
        console.error(error)
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    toMiDetails(record){
      localStorage.setItem("miId", record.id);
      this.$router.push("/platform/plantDetails/mi");
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style>
</style>