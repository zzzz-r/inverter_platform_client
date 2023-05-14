<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
      <div style="width: 70%">
        <a-input-search v-model="dtuIdSearchText" placeholder="输入查找的DTU设备编号" style="width: 60%" @search="onSearch" class="mr-5" />
        <a-button @click="reSetFilter">重置</a-button>
      </div>
      <div>
        <a-button type="primary" class="mr-5" @click="showAddDtu">
          添加设备
        </a-button>
        <a-button type="primary" :disabled="!hasSelected" style="margin-right: 20px" @click="showDeleteConfirm(null)">
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
        :loading="loading"
    >
      <!--      自定义某列样式，同时在columns中设置scopedSlots-->
      <template slot="state" slot-scope="text">
        <a-tag color="green" v-if="text === 0">在线</a-tag>
        <a-tag color="red" v-else-if="text === 1">离线</a-tag>
      </template>

      <template slot="connectNum" slot-scope="text">
        {{text}}
      </template>

      <template slot="operation" slot-scope="text,record">
        <a-button type="link" @click="showDeleteConfirm(record.id)">删除</a-button>
      </template>

    </a-table>
    <a-modal
        title="新增DTU"
        :visible="ifAddVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOkAdd"
        @cancel="handleCancelAdd"
    >
      <a-input addon-before="请输入DTU编号：" v-model="addDtuId"></a-input>
    </a-modal>
  </div>
</template>

<script>
import {addDtu, deleteDtu, deletePlant, listDtu} from "@/api/api";
import {EventBus} from "@/main";

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
      ifAddVisible: false,
      confirmLoading: false,
      addDtuId: '',
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
    },
    showAddDtu(){
      this.ifAddVisible = true;
    },
    handleOkAdd(){
      if(this.addDtuId === ''){
        this.$message.warning("请输入DTU编号");
        return;
      }
      this.confirmLoading = true;
      let param = { id: this.addDtuId, plantId: this.plantId};
      addDtu(param).then(res => {
        if(res.code === 0){
          this.$message.success("添加成功");
          this.fetchData();
          this.addDtuId = '';
          EventBus.$emit('dtuChange') // 触发miList更新
        }else
          this.$message.error("添加失败");
        this.ifAddVisible = false;
        this.confirmLoading = false;
      }).catch(error => {
        console.error(error)
      })
    },
    handleCancelAdd(){
      this.ifAddVisible = false;
      this.addDtuId = '';
    },
    showDeleteConfirm(id) {
      this.$confirm({
        title: '删除DTU',
        content: '确定要删除选中DTU设备吗？该DTU下属所有设备也将被一并删除',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => { //使用箭头函数绑定外部函数的上下文，this将指向Vue实例
            this.handleDelete(id);
        },
      });
    },
    handleDelete(id){
      let deleteRequests;
      if(!id){ // 批量删除
        // 获取选中的行
        const selectedRows = this.data.filter(row => this.selectedRowKeys.includes(row.id))
        // 构建批量删除请求
        deleteRequests = selectedRows.map(row => deleteDtu(row.id))
      }else{ // 单个删除
        deleteRequests = [deleteDtu(id)];
      }
      Promise.all(deleteRequests)
          .then(() => {
            // 所有请求都成功删除后，重新加载数据
            this.fetchData()
            this.selectedRowKeys = [] // 清空选中的行
            this.$message.success('删除成功')
            EventBus.$emit('dtuChange') // 删除成功后触发miList更新
          })
          .catch(error => {
            console.log(error)
          })
    },
  },
  created() {
    this.plantId = localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null
    this.fetchData();
  }
};
</script>

<style>
</style>