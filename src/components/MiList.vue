<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
      <div style="width: 70%">
        <a-input-search v-model="miIdSearchText" placeholder="输入查找的逆变器编号" style="width: 40%" @search="onSearch" class="mr-5" />
        <a-input-search v-model="dtuIdSearchText" placeholder="输入连接的DTU编号" style="width: 40%" @search="onSearch" class="mr-5"/>
        <a-button @click="reSetFilter">重置</a-button>
      </div>
      <div>
        <a-button type="primary" class="mr-5" @click="showAddMi">
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
        :scroll="{x: 1200}"
        size="small"
        rowKey="id"
        :loading="loading"
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
        {{ text!=null ? text + "kWh" : "" }}
      </template>

      <template slot="updateTime" slot-scope="text">
        {{ text? new Date(text).toLocaleString():null }}
      </template>

      <template slot="operation" slot-scope="text,record" >
        <a-button type="link" @click="showDeleteConfirm(record.id)">解绑</a-button>|
        <a-button type="link" @click="toMiDetails(record)">查看</a-button>
      </template>

    </a-table>

    <a-modal
        title="新增微型逆变器"
        :visible="ifAddVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOkAdd"
        @cancel="handleCancelAdd"
    >
      <a-form-model :model="param" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }" :rules="rules" ref="addForm">
        <a-form-model-item label="微型逆变器编号" prop="id">
          <a-input v-model="param.id"/>
        </a-form-model-item>

        <a-form-model-item label="连接的DTU编号" prop="dtuId">
          <a-select v-model="param.dtuId">
            <a-select-option v-for="dtu in this.dtuData" :value="dtu.id">
              {{ dtu.id }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="组件容量（kWp）" prop="capacity">
          <a-input v-model="param.capacity"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {addMi, deleteMi, listDtu, listMi} from "@/api/api";
import {EventBus} from "@/main";

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
        ifAddVisible: false,
        confirmLoading: false,
        param:{
          id: null,
          dtuId: null,
          capacity: null,
        },
        rules: {
          id: [{ required: true, message: '请输入微型逆变器设备ID', trigger: 'blur' }],
          dtuId: [{ required: true, message: '请输入连接的DTU编号', trigger: 'change' }],
          capacity: [{ required: true, message: '请输入组件容量', trigger: 'blur' }],
        },
        dtuData: null,
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
        this.loading=false;
      }).catch(error => {
        console.error(error)
      })
    },
    fetchDtuData() {
      listDtu(this.plantId).then( res => {
        this.dtuData = res.data;
      }).catch(error => {
        console.error(error)
      })
    },
    onSelectChange(selectedRowKeys) {
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
    },
    showAddMi(){
      this.ifAddVisible = true;
      if(this.dtuData === null)
        this.fetchDtuData();
    },
    handleOkAdd(){
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          addMi(this.param).then(res => {
            if(res.code === 0){
              this.$message.success("添加成功");
              this.fetchData();
            }else
              this.$message.error("添加失败");
            this.$refs.addForm.resetFields();
            this.ifAddVisible = false;
            this.confirmLoading = false;
          }).catch(error => {
            console.error(error)
          })
        }
      })
    },
    handleCancelAdd(){
      this.ifAddVisible = false;
      this.$refs.addForm.resetFields();
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
    handleDelete(id){
      let deleteRequests;
      if(!id){ // 批量删除
        // 获取选中的行
        const selectedRows = this.data.filter(row => this.selectedRowKeys.includes(row.id))
        // 构建批量删除请求
        deleteRequests = selectedRows.map(row => deleteMi(row.id))
      }else{ // 单个删除
        deleteRequests = [deleteMi(id)];
      }
      Promise.all(deleteRequests)
          .then(() => {
            // 所有请求都成功删除后，重新加载数据
            this.fetchData()
            this.selectedRowKeys = [] // 清空选中的行
            this.$message.success('删除成功')
          })
          .catch(error => {
            console.log(error)
          })
    },
    handleDtuChange(){
      if(this.dtuData !== null)
        this.fetchDtuData();
      this.fetchData();
    }
  },
  created() {
    this.plantId = localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null
    this.fetchData();
    EventBus.$on('dtuChange', this.handleDtuChange)
  }
};
</script>

<style>
</style>