<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
      <div style="width: 70%">
        <a-input-search v-model="miIdSearchText" placeholder="输入查找的逆变器编号" style="width: 40%" @search="onSearch" class="mr-5" />
        <a-input-search v-model="dtuIdSearchText" placeholder="输入连接的DTU编号" style="width: 40%" @search="onSearch" class="mr-5"/>
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
        :scroll="{x: 1200}"
        size="small"
        rowKey="id"
    >
      <!--      自定义某列样式，同时在columns中设置scopedSlots-->
      <template slot="state" slot-scope="text">
        <a-tag color="green" v-if="text === 0">在线</a-tag>
        <a-tag color="red" v-else-if="text === 1">离线</a-tag>
      </template>

      <template slot="capacity" slot-scope="text">
        {{ text ? text + "kWp" : "" }}
      </template>

      <template slot="power" slot-scope="text">
        {{ text ? text + "kW" : "" }}
      </template>

      <template slot="dayGen" slot-scope="text">
        {{ text ? text + "kWh" : "" }}
      </template>

      <template slot="operation" slot-scope="text,record" >
        <a-button type="link">解绑</a-button>|
        <a-button type="link" @click="toMiDetails(record)">查看</a-button>
      </template>

    </a-table>
  </div>
</template>

<script>
import {listMi} from "@/api/api";

const columns = [
  {
    title: '设备编号',
    dataIndex: 'id',
    fixed: 'left',
    width:110,
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    width: 100,
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
    title: '连接DTU',
    dataIndex: 'dtuId',
  },
  {
    title: '发电功率',
    dataIndex: 'power',
    scopedSlots: { customRender: 'power' },
    sorter: (a, b) => a.power - b.power,
  },
  {
    title: '当日发电量',
    dataIndex: 'dayGen',
    scopedSlots: { customRender: 'dayGen' },
    sorter: (a, b) => a.dayGen - b.dayGen,
  },
  {
    title: '组件容量',
    dataIndex: 'capacity',
    scopedSlots: { customRender: 'capacity' },
    sorter: (a, b) => a.capacity - b.capacity,
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
    fixed: 'right',
  }
];

export default {
  name: "MiList",
  data() {
    return {
      data: [],
      columns,
      plantId: null,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      miIdSearchText: "",
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
      listMi(this.plantId).then( res => {
        // console.log(res.data)
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
      const miIdSearchText = this.miIdSearchText.trim();
      const dtuIdSearchText = this.dtuIdSearchText.trim();
      if (!miIdSearchText && !dtuIdSearchText) {
        this.filteredData = [];
        return;
      }
      this.filteredData = this.data.filter(item => {
        if (miIdSearchText && !item.id.toString().includes(miIdSearchText)) {
          return false;
        }
        if (dtuIdSearchText && !item.dtuId.toString().includes(dtuIdSearchText)) {
          return false;
        }
        return true;
      });
    },
    reSetFilter(){
      this.ifFiltered = false;
      this.filteredData = [];
    },
    toMiDetails(record){
      // this.$store.commit("setMiListInfo",record);
      localStorage.setItem("miId", record.id);
      this.$router.push("/platform/plantDetails/mi");
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