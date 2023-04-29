<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
      <div style="width: 70%">
        <a-input-search v-model="dtuIdSearchText" placeholder="输入查找的DTU设备编号" style="width: 60%" @search="onSearch" class="mr-5" />
        <a-button @click="reSetFilter">重置</a-button>
      </div>
      <div>
        <a-button type="primary" class="mr-5">
          添加设备
        </a-button>
        <a-button type="primary" :disabled="!hasSelected" style="margin-right: 20px">
          批量删除
        </a-button>
      </div>
    </div>
    <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="ifFiltered ? filteredData : data"
        :locale="{ emptyText: '暂无数据' }"
        size="small"
        rowKey="id"
    >
      <!--      自定义某列样式，同时在columns中设置scopedSlots-->
      <template slot="state" slot-scope="text">
        <a-tag color="green" v-if="text === 0">在线</a-tag>
        <a-tag color="red" v-else-if="text === 1">离线</a-tag>
      </template>

      <template slot="connectNum" slot-scope="text">
        {{text}}
      </template>

      <template slot="operation" >
        <a-button type="link">解绑</a-button>|
        <a-button type="link">查看</a-button>
      </template>

    </a-table>
  </div>
</template>

<script>
import {listDtu} from "@/api/api";

const columns = [
  {
    title: '设备编号',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    // 筛选框
    filters: [
      {
        text: '在线',
        value: 0,
      },
      {
        text: '离线',
        value: 1,
      }
    ],
    onFilter: (value, record) => record.state === value,
  },
  {
    title: '连接设备数',
    dataIndex: 'connectNum',
    scopedSlots: { customRender: 'connectNum' },
    sorter: (a, b) => a.connectNum - b.connectNum,
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
  name: "DtuList",
  data() {
    return {
      data: [],
      columns,
      plantId: null,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      dtuIdSearchText: "",
      filteredData: [],
      ifFiltered: false,
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
      listDtu(this.plantId).then( res => {
        console.log(res.data)
        this.data = res.data;
        this.loading=false
      }).catch(error => {
        console.error(error)
      })
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onSearch() {
      this.ifFiltered = true;
      const dtuIdSearchText = this.dtuIdSearchText.trim();
      if (!dtuIdSearchText) {
        this.filteredData = [];
        return;
      }
      this.filteredData = this.data.filter(item => {
        if (dtuIdSearchText && !item.id.toString().includes(dtuIdSearchText)) {
          return false;
        }
        return true;
      });
    },
    reSetFilter(){
      this.ifFiltered = false;
      this.filteredData = [];
    }
  },
  created() {
    this.plantId = localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null
    this.fetchData();
  }
};
</script>

<style>
</style>