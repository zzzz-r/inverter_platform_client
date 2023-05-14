<template>
  <div class="body-box">
    <a-drawer
        :title="ifAdd? '新增用户':'编辑用户'"
        placement="right"
        :closable="false"
        :visible="ifDrawerVisible"
        @close="onDrawerClose"
        width="500"
    >
      <a-form-model ref="userForm" :rules="rules" :model="editableItem"
                    :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" >
        <a-form-model-item label="组织机构" prop="institute">
          <a-input v-model="editableItem.institute" :disabled="true"></a-input>
        </a-form-model-item>
        <a-form-model-item label="登陆账号" prop="id" v-if="!ifAdd">
          <a-input v-model="editableItem.id" :disabled="!ifAdd"/>
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="userName" placeholder="请选择机构类型">
          <a-input v-model="editableItem.userName"/>
        </a-form-model-item>
        <a-form-model-item label="初始密码" prop="password" placeholder="请选择机构类型" v-if="ifAdd">
          <a-input v-model="editableItem.password"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="phone">
          <a-input v-model="editableItem.phone"/>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="editableItem.email"/>
        </a-form-model-item>
        <a-form-item style="text-align: right">
          <a-button class="mr-5" @click="onDrawerClose">取消</a-button>
          <a-button type="primary" @click="onSubmitAddOrEdit">确认</a-button>
        </a-form-item>
      </a-form-model>
    </a-drawer>

    <a-row :gutter="16" style="text-align: left; margin-top: 15px">
      <a-col :span="5">
        <a-card class="card" title="组织机构" >
          <a-tree
              :tree-data="institutesTree"
              :show-line="true"
              rowKey="id"
              :defaultExpandAll="true"
              @select="onInstituteSelect"
              v-if="institutesTree.length>0"
          >
          </a-tree>
        </a-card>
      </a-col>

      <a-col :span="19">
        <a-card class="card" title="业主">
          <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
            <div style="text-align: left">
              <span style="margin-right: 20px;color: #4096ff">是否显示下级用户</span>
              <a-switch v-model:checked="ifShowChildren"  />
              <span style="margin-left: 20px;">共<b/>{{userNum}}位用户</span>
            </div>
            <div>
              <a-button type="primary" class="mr5" @click="showAddDrawer">
                <a-icon type="plus-circle" />新增业主
              </a-button>
            </div>
          </div>
          <a-table
              :columns="columns"
              :data-source="users"
              :locale="{ emptyText: '暂无数据' }"
              size="middle"
              :rowKey="(record) => record.id"
              :bordered="true"
              :loading="loading"
          >
            <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px"
            >
              <a-input
                  v-ant-ref="c => (searchInput = c)"
                  :placeholder="`Search ${column.dataIndex}`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block;"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
              />
              <a-button
                  type="primary"
                  icon="search"
                  size="small"
                  style="width: 90px; margin-right: 8px"
                  @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
              >
                搜索
              </a-button>
              <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                重置
              </a-button>
            </div>
            <a-icon
                slot="filterIcon"
                slot-scope="filtered"
                type="search"
                :style="{ color: filtered ? '#108ee9' : undefined }"
            />
            <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
            v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
          >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
              <template v-else>
                {{ text }}
              </template>
            </template>

            <template slot="createTime" slot-scope="text,record">
              <span>{{ new Date(record.createTime).toLocaleDateString() }}</span>
            </template>

            <template slot="institute" slot-scope="text,record">
              {{institutes.find(item => item.id === record.instituteId).name}}
            </template>

            <template slot="type" slot-scope="text,record">
              {{institutes.find(item => item.id === record.instituteId).type}}
            </template>

            <template slot="operation" slot-scope="text,record">
              <a-tooltip>
                <template slot="title">
                  编辑
                </template>
                <a-button type="link" @click="showEditDrawer(record)"><a-icon type="edit" /></a-button>
              </a-tooltip>

              <a-divider type="vertical" style="margin:0"/>

              <a-tooltip>
                <template slot="title">
                  重置密码
                </template>
                <a-button type="link"  @click="showResetConfirm(record.id, record.userName)">
                  <a-icon type="reload" />
                </a-button>
              </a-tooltip>

              <a-divider type="vertical" style="margin:0"/>

              <a-tooltip>
                <template slot="title">
                  删除
                </template>
                <a-button type="link" @click="showDeleteConfirm(record.id, record.userName)">
                  <a-icon type="delete" />
                </a-button>
              </a-tooltip>

            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  adminUserEdit,
  adminUserRegister,
  deleteUser,
  listInstitute,
  listInstituteUser,
  resetPassword,
  saveInstitute
} from "@/api/api";

export default {
  name: "InstituteUser",
  data() {
    return {
      loading: false,
      institutes: [],
      instituteId: null,
      institutesTree: [],
      users: [],
      columns: [
        {
          title: '登陆账号',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
              record.id
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
              record.userName
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        {
          title: '所属机构',
          dataIndex: 'institute',
          key: 'institute',
          scopedSlots: { customRender: 'institute' },
        },
        {
          title: '机构类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' },
          filters: [
            {
              text: '设备商',
              value: '设备商',
            }, {
              text: '经销商',
              value: '经销商',
            },{
              text: '安装商',
              value: '安装商',
            },{
              text: '普通',
              value: '普通',
            },
          ],
          onFilter: (value, record) => this.institutes.find(item => item.id === record.instituteId).type === value,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          sorter: (a, b) => {
            // 将日期字符串转化为时间戳，然后比较
            return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      selectedInstitute: null,
      ifShowChildren: true,
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      ifDrawerVisible: false,
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      editableItem: {
        instituteId: null,
        institute: null,
        id: null,
        userName: null,
        password: null,
        email: null,
        phone: null,
        type: null,
      },
      ifAdd: true,
    };
  },
  methods: {
    onInstituteSelect(selectedKeys) {
      this.selectedInstitute = selectedKeys[0];
      this.fetchUserData(this.selectedInstitute);
    },
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
      node.title = currentNode.name;
      const children = this.findChildren(id);
      if (children.length > 0) {
        node.children = children.map((child) => this.buildTree(child.id));
      }
      return node;
    },
    fetchInstituteData(){
      listInstitute().then(res => {
        this.institutes = res.data;
        this.institutesTree = this.institutes
            .filter((item) => item.id === this.instituteId)
            .map((root) => this.buildTree(root.id));
        this.fetchUserData(this.institutesTree[0].key);
        this.selectedInstitute = this.institutesTree[0].key;
      }).catch(error => {
        console.error(error)
      })
    },
    fetchUserData(id){
      this.loading = true;
      listInstituteUser(id, false).then(res => {
        this.users = res.data;
        if(!this.ifShowChildren)
          this.users = this.users.filter(item=> item.instituteId === this.selectedInstitute);
        this.loading = false;
      }).catch(error => {
        console.error(error)
      })
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    onResetPwd(id) {
      resetPassword(id).then(res => {
        if(res.code === 0)
          this.$message.success('重置成功');
      }).catch(error => {
        this.$message.warning(error);
      })
    },
    showResetConfirm(id,userName){
      this.$confirm({
        title: '重置密码',
        content: `是否确认将用户( ${userName} )的密码重置为123456？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => { //使用箭头函数绑定外部函数的上下文，this将指向Vue实例
          this.onResetPwd(id);
        },
      });
    },
    onDeleteUser(id){
      deleteUser(id).then(res => {
        if(res.code === 0) {
          this.$message.success('删除成功');
          if(this.users){
            this.users = this.users.filter(item => item.id !== id);
          }
        }
      }).catch(error => {
        this.$message.warning(error);
      })
    },
    showDeleteConfirm(id,userName){
      this.$confirm({
        title: '删除用户',
        content: `是否确认删除用户：${userName} ？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => { //使用箭头函数绑定外部函数的上下文，this将指向Vue实例
          this.onDeleteUser(id);
        },
      });
    },
    onDrawerClose(){
      this.ifDrawerVisible = false;
    },
    showEditDrawer(record){
      this.ifAdd = false;
      this.$nextTick(()=>{
        this.$refs.userForm.clearValidate();
      })
      this.ifDrawerVisible = true;
      for (let key in this.editableItem) {
        this.editableItem[key] = null
      }
      this.editableItem.institute = this.institutes.find(item => item.id === record.instituteId).name
      this.editableItem.id = record.id;
      this.editableItem.instituteId = record.instituteId;
      this.editableItem.userName = record.userName;
      this.editableItem.email = record.email;
      this.editableItem.phone = record.phone;
    },
    showAddDrawer(){
      this.ifAdd = true;
      this.ifDrawerVisible = true;
      this.$nextTick(()=>{
        this.$refs.userForm.clearValidate();
      })
      for (let key in this.editableItem) {
        this.editableItem[key] = null
      }
      this.editableItem.institute = this.institutes.find(item => item.id === this.selectedInstitute).name;
      this.editableItem.type = 0;
      this.editableItem.instituteId = this.selectedInstitute;
    },
    onSubmitAddOrEdit(){
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if(this.ifAdd){ // 添加
            adminUserRegister(this.editableItem).then(res => {
              if (res.code === 0) {
                this.$message.success("添加成功");
                this.fetchUserData(this.selectedInstitute);
              } else {
                this.$message.error(res.msg);
              }
            })
          }else{ // 修改
            // console.log(this.editableItem)
            adminUserEdit(this.editableItem).then(res => {
              if(res.code === 0){
                this.$message.success("保存成功");
                this.users.forEach(item=>{
                  if(item.id === this.editableItem.id){
                    item.userName = this.editableItem.userName;
                    item.email = this.editableItem.email;
                    item.phone = this.editableItem.phone;
                  }
                });
              }else{
                this.$message.error(res.msg);
              }
            })
          }
          this.onDrawerClose();
        }
      })
    },
  },
  created() {
    this.instituteId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).instituteId : null
    this.fetchInstituteData();
  },
  watch:{
    ifShowChildren(){
      if(this.ifShowChildren === false){
        this.users = this.users.filter(item=> item.instituteId === this.selectedInstitute);
      }else{
        this.fetchUserData(this.selectedInstitute);
      }
    }
  },
  computed:{
    userNum(){
      return this.users ? this.users.length : 0;
    }
  }
};
</script>

<style scoped>
.card{
  height: 100vh;
  overflow: scroll;
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>