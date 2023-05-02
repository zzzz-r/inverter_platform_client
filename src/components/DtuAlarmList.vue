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
    >

      <template slot="state" slot-scope="text,record">
        <a-tag color="#ff4d4f" v-if="record.state === 1">离线</a-tag>
      </template>

      <template slot="updateTime" slot-scope="text,record" >
        <span>{{ new Date(record.updateTime).toLocaleString() }}</span>
      </template>

      <template slot="operation" slot-scope="text,record" >
        <a-button type="link">提交工单</a-button>
      </template>

    </a-table>
  </div>
</template>

<script>
import {listAlarmDtu} from "@/api/api";

const columns = [
  {
    title: '设备编号',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '所属电站',
    dataIndex: 'plantName',
  },
  {
    title: '报警名称',
    dataIndex: 'state',
    scopedSlots: {customRender: 'state'},
  },
  {
    title: '最后更新时间',
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
  name: "DtuAlarmList",
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
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
      listAlarmDtu().then( res => {
        console.log(res.data)
        this.data = res.data;
        this.loading=false
      }).catch(error => {
        console.error(error)
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style>
</style>