<template>
  <div>
    <a-tabs default-active-key="2" @change="onTabChange" style="text-align: left">
      <a-tab-pane key="1" tab="采集器">
        Content of Tab Pane 1
      </a-tab-pane>
      <a-tab-pane key="2" tab="微型逆变器" force-render>
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
          <div style="width: 70%">
            <a-input-search v-model="miIdSearchText" placeholder="输入查找的设备编号" style="width: 40%" @search="onSearch" class="mr5" />
            <a-input-search v-model="dtuIdSearchText" placeholder="输入连接的DTU编号" style="width: 40%" @search="onSearch" class="mr5"/>
            <a-button @click="reSetFilter">重置</a-button>
          </div>
          <div>
            <a-button type="primary" class="mr5">
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
            size="default"
            :locale="{ emptyText: '暂无数据' }"
        >
          <!--      自定义某列样式，同时在columns中设置scopedSlots-->
          <template slot="state" slot-scope="text">
            <a-tag :color="text === '在线' ? 'green' : 'red'">{{text}}</a-tag>
          </template>

          <template slot="operation" >
            <a-button type="link">解绑</a-button>|
            <a-button type="link">查看</a-button>
          </template>

        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import handle from "ant-design-vue/lib/vc-slider/src/Handle";

const columns = [
  {
    title: '设备编号',
    dataIndex: 'id',
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    // 筛选框
    filters: [
      {
        text: '在线',
        value: '在线',
      },
      {
        text: '离线',
        value: '离线',
      }
    ],
    onFilter: (value, record) => record.state.indexOf(value) === 0,
  },
  {
    title: '连接DTU',
    dataIndex: 'connectDTU',
  },{
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
];

const data = [];
for (let i = 0; i < 46; i++) {
  let state = i % 2 === 0 ? "在线" : "离线";
  data.push({
    key: i,
    id: `Edward King ${i}`,
    state: state,
    connectDTU: `London, Park Lane no. ${i+1}`,
  });
}

export default {
  data() {
    return {
      data,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      current_tab: ['2'],
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
    start() {
      this.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onTabChange(key){
      console.log(key);
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
        if (miIdSearchText && !item.id.includes(miIdSearchText)) {
          return false;
        }
        if (dtuIdSearchText && !item.connectDTU.includes(dtuIdSearchText)) {
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
};
</script>

<style>
.mr5{
  margin-right: 5px;
}
</style>
