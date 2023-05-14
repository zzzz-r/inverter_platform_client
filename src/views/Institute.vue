<template>
  <div class="body-box" style="background-color: #fff;height: 100%">
    <div class="title" style="font-weight: bold">机构管理</div>
    <a-divider></a-divider>
    <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
      <div style="width: 70%;text-align: left">
        <a-input-search v-model="searchText" placeholder="输入要查找的机构名称" style="width: 50%" @search="onSearch" class="mr5" />

        <a-button @click="reSetFilter">重置</a-button>
      </div>
      <div>
        <a-button type="primary" class="mr5" @click="showAddDrawer">
          <a-icon type="plus-circle" />新增机构
        </a-button>
        <a-drawer
            :title="ifAdd? '新增组织机构':'编辑组织机构'"
            placement="right"
            :closable="false"
            :visible="ifAddVisible"
            @close="onAddClose"
            width="500"
        >
          <a-form-model ref="instituteForm" :rules="addRules" :model="editableItem"
                        :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" >
            <a-form-model-item label="上级机构" prop="parent" v-if="this.ifAdd">
              <a-cascader :options="this.data" change-on-select v-model="editableItem.parent" placeholder="请选择上级机构"/>
            </a-form-model-item>
            <a-form-model-item label="机构名称" prop="name">
              <a-input v-model="editableItem.name" placeholder="请输入机构名称"/>
            </a-form-model-item>
            <a-form-model-item label="机构类型" prop="type" placeholder="请选择机构类型">
              <a-select v-model="editableItem.type">
                <a-select-option value="设备商">
                  设备商
                </a-select-option>
                <a-select-option value="运营商">
                  经销商
                </a-select-option>
                <a-select-option value="安装商">
                  安装商
                </a-select-option>
                <a-select-option value="普通">
                  普通
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="联系人" prop="contactName">
              <a-input v-model="editableItem.contactName"/>
            </a-form-model-item>
            <a-form-model-item label="联系电话" prop="contactTel">
              <a-input v-model="editableItem.contactTel"/>
            </a-form-model-item>
            <a-form-model-item label="详细地址" prop="address">
              <a-input v-model="editableItem.address"/>
            </a-form-model-item>
            <a-form-model-item label="机构简介" prop="discription">
              <a-textarea v-model="editableItem.description" />
            </a-form-model-item>
            <a-form-item style="text-align: right">
              <a-button class="mr-5" @click="onAddClose">取消</a-button>
              <a-button type="primary" @click="onSubmitAddOrEdit">确认</a-button>
            </a-form-item>
          </a-form-model>
        </a-drawer>
      </div>
    </div>

    <a-drawer
        title="转移组织机构"
        placement="right"
        :closable="false"
        :visible="ifTransferVisible"
        @close="onTransferClose"
        width="500"
    >
      <a-form-model ref="transferForm" :rules="transferRules" :model="transferItem"
                    :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" >
        <a-form-model-item label="当前上级机构" prop="curParent">
          <a-cascader :options="this.data" change-on-select v-model="transferItem.curParent" :disabled="true"/>
        </a-form-model-item>
        <a-form-model-item label="机构名称" prop="name">
          <a-input v-model="transferItem.name" :disabled="true"/>
        </a-form-model-item>
        <a-form-model-item label="上级机构" prop="parent">
          <a-cascader :options="this.data" change-on-select v-model="transferItem.parent" placeholder="请选择上级机构"/>
        </a-form-model-item>
        <div style="margin: 0 20px;font-size: 12px">
          机构转移后将关联到新机构下，同时该下级机构和所有电站、业主也会一并转移，请谨慎操作！
        </div>
        <a-form-item style="text-align: right">
          <a-button class="mr-5" @click="onTransferClose">取消</a-button>
          <a-button type="primary" @click="onSubmitTransfer">确认</a-button>
        </a-form-item>
      </a-form-model>
    </a-drawer>

    <a-table
        :columns="columns"
        :data-source="ifSearchFiltered ? filteredData : data"
        :row-selection="rowSelection"
        :expanded-row-keys.sync="expandedRowKeys"
        :locale="{ emptyText: '暂无数据' }"
        :defaultExpandAllRows="true"
        v-if="data.length>0"
        :bordered="true"
        size="middle"
        :loading="loading"
    >
      <template slot="operation" slot-scope="text,record">
        <a-tooltip>
          <template slot="title">
            编辑查看
          </template>
          <a-button type="link" @click="showEditDrawer(record.key)"><a-icon type="edit" /></a-button>
        </a-tooltip>

        <a-divider type="vertical" style="margin:0"/>

        <a-tooltip>
          <template slot="title">
            转移机构
          </template>
          <a-button type="link" :disabled="record.pid === null" @click="showTransferDrawer(record.key)">
            <a-icon type="apartment" />
          </a-button>
        </a-tooltip>

        <a-divider type="vertical" style="margin:0"/>

        <a-tooltip>
          <template slot="title">
            删除
          </template>
          <a-button type="link" :disabled="record.pid === null" @click="showDeleteConfirm(record.key)">
            <a-icon type="delete" />
          </a-button>
        </a-tooltip>

      </template>
    </a-table>
  </div>
</template>

<script>
import {deleteInstitute, listInstitute, saveInstitute} from "@/api/api";

const columns = [
  {
    title: '机构名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '机构类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '上级机构',
    dataIndex: 'pid',
    key: 'pid',
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
    key: 'contactName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    ;
  },
};

export default {
  name:"Institute",
  data() {
    return {
      loading: true,
      data: [],
      instituteId: null,
      searchText: "",
      filteredData: [],
      ifSearchFiltered: false,
      columns,
      rowSelection,
      expandedRowKeys: [],
      institutes: {},
      ifAddVisible: false,
      ifTransferVisible: false,
      editableItem: {
        id: null,
        parent: null,
        pid: null,
        name: null,
        type: null,
        contactName: null,
        contactTel: null,
        address: null,
        description: null,
      },
      transferItem: {
        id: null,
        name: null,
        pid: null,
        curParent: null,
        parent: null,
      },
      addRules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
        parent: [{ required: true, message: '请选择上级机构', trigger: 'change' }],
      },
      transferRules: {
        parent: [{ required: true, message: '请选择上级机构', trigger: 'change' }],
      },
      ifAdd: true,
    };
  },
  methods:{
    findChildren(id){
      return this.institutes.filter((item) => item.pid === id);
    },
    buildTree(id){
      const node = { key: id,};
      const currentNode = this.institutes.find(item => item.id === id);
      node.name = currentNode.name;
      node.type = currentNode.type;
      let pNode = this.institutes.find(item => item.id === currentNode.pid);
      node.pid = pNode? pNode.name : null;
      node.contactName = currentNode.contactName;
      node.value = currentNode.id;
      node.label = currentNode.name; // 选择上级机构中的label
      const children = this.findChildren(id);
      if (children.length > 0) {
        node.children = children.map((child) => this.buildTree(child.id));
      }
      return node;
    },
    fetchData(){
      this.loading = true;
      listInstitute().then(res => {
        this.institutes = res.data;
        // console.log(this.institutes);
        this.data = this.institutes
            .filter((item) => item.id === this.instituteId)
            .map((root) => this.buildTree(root.id));
        this.loading = false;
      }).catch(error => {
        console.error(error)
      })
    },
    findInstituteByName(data) {
      let result = null;
      data.forEach(item => {
        if (item.name.includes(this.searchText)) {
          result = item;
          return;
        }
        if (item.children) {
          const childResult = this.findInstituteByName(item.children);
          if (childResult) {
            result = childResult;
            return;
          }
        }
      });
      return result;
    },
    onSearch() {
      this.ifSearchFiltered = true;
      this.filteredData = [];
      const searchText = this.searchText.trim();
      if (!searchText) {
        return;
      }
      this.filteredData.push(this.findInstituteByName(this.data));
    },
    reSetFilter(){
      this.ifSearchFiltered = false;
      this.filteredData = [];
    },
    showAddDrawer(){
      this.ifAddVisible = true;
      this.ifAdd = true;
      this.$nextTick(()=>{
        this.$refs.instituteForm.clearValidate();
      })
      for (let key in this.editableItem) {
        this.editableItem[key] = null
      }
    },
    onAddClose() {
      this.ifAddVisible = false;
    },
    onSubmitAddOrEdit(){
      this.$refs.instituteForm.validate(valid => {
        if (valid) {
          this.editableItem.pid = this.editableItem.parent.slice(-1)[0];
          saveInstitute(this.editableItem).then(res => {
            if(res.code === 0){
              this.$message.success("保存成功");
              this.fetchData();
            }else{
              this.$message.warning("保存失败");
            }
          })
          this.onAddClose();
        }
      })
    },
    showEditDrawer(id){
      this.editableItem.id = id;
      let instituteInfo = this.institutes.find(item => item.id === id);
      this.editableItem.parent = [];
      let pid = instituteInfo.pid;
      // 逆序向上插入寻找父机构，直至根节点
      while(pid !== null){
        this.editableItem.parent.unshift(pid);
        let parentInstitute = this.institutes.find(item => item.id === pid);
        pid = parentInstitute ? parentInstitute.pid : null;
      }
      this.editableItem.name = instituteInfo.name;
      this.editableItem.type = instituteInfo.type;
      this.editableItem.description = instituteInfo.description;
      this.editableItem.address = instituteInfo.address;
      this.editableItem.contactName = instituteInfo.contactName;
      this.editableItem.contactTel = instituteInfo.contactTel;
      this.ifAddVisible = true;
      this.ifAdd = false;
      this.$nextTick(()=>{
        this.$refs.instituteForm.clearValidate();
      })
    },
    onTransferClose(){
      this.ifTransferVisible = false;
      // console.log(this.transferItem.parent)
    },
    showTransferDrawer(id){
      this.ifTransferVisible = true;
      this.$nextTick(()=>{
        this.$refs.transferForm.clearValidate();
      })
      this.transferItem.id = id;
      let instituteInfo = this.institutes.find(item => item.id === id);
      this.transferItem.name = instituteInfo.name;
      this.transferItem.curParent = [];
      this.transferItem.parent = [];
      let pid = instituteInfo.pid;
      while(pid !== null){
        this.transferItem.curParent.unshift(pid);
        let parentInstitute = this.institutes.find(item => item.id === pid);
        if(parentInstitute){
          pid = parentInstitute.pid;
        }else{ // 根节点pid不在institutes中，需删除根节点pid
          this.transferItem.curParent.shift();
          break;
        }
      }
      // console.log(this.transferItem.curParent);
    },
    onSubmitTransfer(){
      this.$refs.transferForm.validate(valid => {
        if (valid) {
          this.transferItem.pid = this.transferItem.parent.slice(-1)[0];
          saveInstitute(this.transferItem).then(res => {
            if(res.code === 0){
              this.$message.success("保存成功");
              this.fetchData();
            }else{
              this.$message.warning("保存失败");
            }
          })
          this.onTransferClose();
        }
      })
    },
    onDelete(id){
      deleteInstitute(id).then(res => {
        if(res.code === 0){
          this.fetchData()
          this.$message.success('删除成功')
        }
      }).catch(error => {
            console.error(error)
      })
    },
    showDeleteConfirm(id){
      this.$confirm({
        title: '删除机构',
        content: '是否确认删除机构及其下所有数据？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => { //使用箭头函数绑定外部函数的上下文，this将指向Vue实例
          this.onDelete(id);
        },
      });
    }
  },
  created() {
    this.instituteId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).instituteId : null
    this.fetchData();
  }
};
</script>

<style scoped>
.title{
  margin-top: 20px;
  margin-left: 30px;
  font-size: 16px;
  text-align: left
}
</style>


