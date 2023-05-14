<template>
  <div>
    <div>
      <a-form-model ref="ruleForm" :rules="rules" :model="editableItem"
                    :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }" >
        <a-collapse :default-active-key="['1','2','3','4']" :bordered="false">
          <a-collapse-panel key="1" header="基础信息" :style="customStyle">
            <template>
              <!-- 第一步要渲染的组件 -->
              <a-form-model-item label="电站名称" prop="name">
                <a-input v-model="editableItem.name"/>
              </a-form-model-item>

              <a-form-model-item label="电站位置">
                <div id="container"></div>
              </a-form-model-item>

              <div style="display: flex;justify-content: center">
                <a-form-model-item label="省份" prop="province" >
                  <a-select class="posSelect" v-model="editableItem.province" placeholder="请选择省份"
                            @change="onProvinceChange">
                    <a-select-option @click="handleClickProvince" v-for="(province, index) in provinces" :key="index" :value="province">{{ province }}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="城市" prop="city" >
                  <a-select class="posSelect" v-model="editableItem.city" placeholder="请选择城市"
                            @change="onCityChange" :disabled="!(cities.length>0||editableItem.city)">
                    <a-select-option @click="handleClickCity" v-for="(city, index) in cities" :key="index" :value="city">{{ city }}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="区县" prop="county" >
                  <a-select class="posSelect" v-model="editableItem.county" placeholder="请选择区县"
                            @change="onCountyChange" :disabled="!(counties.length>0||editableItem.county)">
                    <a-select-option v-for="(county, index) in counties" :key="index" :value="county">{{ county }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </div>

              <a-form-model-item label="详细地址" prop="address">
                <a-input id="address" v-model="editableItem.address"/>
              </a-form-model-item>

              <div style="display: flex;justify-content: center">
                <a-form-model-item label="经度" prop="lng" style="width: 36%">
                  <a-input id="lng" v-model="editableItem.lng"/>
                </a-form-model-item>
                <a-form-model-item label="纬度" prop="lat" style="width: 36%">
                  <a-input id="lat" v-model="editableItem.lat"/>
                </a-form-model-item>
              </div>

              <a-form-model-item label="建站时间">
                <a-input :disabled="true" :value="$moment(editableItem.buildDate).format('YYYY-MM-DD')"/>
              </a-form-model-item>

              <a-form-model-item label="封面">
                <a-upload
                    :file-list="editableItem.cover"
                    :action=uploadURL
                    list-type="picture-card"
                    @change="handelCoverUploadChange"
                >
                  <div v-if="editableItem.cover.length < 1">
                    <a-icon type="plus" /><div>上传</div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="系统信息" :style="customStyle">
            <template>
              <!-- 第二步要渲染的组件 -->
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="电站类型">
                    <a-select v-model="editableItem.plantType">
                      <a-select-option value="分布式户用">
                        分布式户用
                      </a-select-option>
                      <a-select-option value="分布式商业">
                        分布式商业
                      </a-select-option>
                      <a-select-option value="分布式工业">
                        分布式工业
                      </a-select-option>
                      <a-select-option value="地面电站">
                        地面电站
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="系统类型">
                    <a-select v-model="editableItem.sysType">
                      <a-select-option value="光伏+电网">
                        光伏+电网
                      </a-select-option>
                      <a-select-option value="光伏+电网+用电">
                        光伏+电网+用电
                      </a-select-option>
                      <a-select-option value="光伏+电网+用电+储能">
                        光伏+电网+用电+储能
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="装机容量(kWp)" prop="capacity">
                    <a-input v-model="editableItem.capacity" :disabled="true"/>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="计划自发自用率(%)" v-if="!(editableItem.sysType==='光伏+电网')">
                    <a-input v-model="editableItem.selfUseRate"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="收益信息" :style="customStyle">
            <template>
              <!-- 第三步要渲染的组件 -->
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="度电收益(元/kWh)">
                    <a-input v-model="editableItem.elecBenefit"/>
                  </a-form-model-item>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item label="补贴收益(元/kWh)">
                    <a-input v-model="editableItem.subsidyBenefit"/>
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="总成本(元)">
                    <a-input v-model="editableItem.cost"/>
                  </a-form-model-item>
                </a-col>

                <a-col :span="12">
                  <a-form-model-item label="日还款(元)">
                    <a-input v-model="editableItem.dailyRepay"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="业主信息" :style="customStyle" v-if="user? user.type === 1: false">
            <template>
              <!-- 第四步要渲染的组件 -->
              <a-row :gutter="16" style="text-align: left; margin-top: 15px;">
                <a-col :span="6">
                  <a-card class="card" title="组织机构" >
                    <a-tree
                        :tree-data="institutesTree"
                        :show-line="true"
                        rowKey="id"
                        :defaultExpandAll="true"
                        @select="onInstituteSelect"
                        v-if="institutesTree.length>0"
                        :defaultSelectedKeys="[selectedInstitute]"
                    >
                    </a-tree>
                  </a-card>
                </a-col>

                <a-col :span="10">
                  <a-card class="card" title="选择业主">
                    <a-table
                        :columns="userColumns"
                        :data-source="users"
                        :locale="{ emptyText: '暂无数据' }"
                        size="middle"
                        :rowKey="(record) => record.id"
                        :bordered="true"
                    >

                      <template slot="institute" slot-scope="text,record">
                        {{institutes.find(item => item.id === record.instituteId).name}}
                      </template>

                      <template slot="operation" slot-scope="text,record">
                        <a-tooltip>
                          <template slot="title">
                            添加
                          </template>
                          <a-button type="link" @click="addOwner(record)"><a-icon type="user-add" /></a-button>
                        </a-tooltip>
                      </template>
                    </a-table>
                  </a-card>
                </a-col>

                <a-col :span="8">
                  <a-card class="card" title="已有业主">
                    <a-table
                        :columns="selectedUserColumns"
                        :data-source="selectedUsers"
                        :locale="{ emptyText: '暂无业主' }"
                        size="middle"
                        :rowKey="(record) => record.id"
                    >
                      <template slot="operation" slot-scope="text,record">
                        <a-tooltip>
                          <template slot="title">
                            移除
                          </template>
                          <a-button type="link" @click="removeOwner(record)"><a-icon type="user-delete" /></a-button>
                        </a-tooltip>
                      </template>
                    </a-table>
                  </a-card>
                </a-col>
              </a-row>
            </template>
          </a-collapse-panel>
        </a-collapse>
      </a-form-model>

    </div>
    <div >
      <div class="steps-action">
        <a-button
            type="primary"
            class="steps-but"
            @click="onEditPlantSubmit"
        >
          保存
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {uploadURL} from "@/config/config";
import {addOrEditPlant, detailPlant, listInstitute, listInstituteUser} from "@/api/api";
window._AMapSecurityConfig = {
  securityJsCode: 'f06653a86b643465e607ae67ffddc067'
}

export default {
  name: "AboutPlant",
  data() {
    return{
      current: 0,
      plantId: localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      editableItem: {
        name: null,
        province: undefined,
        city: undefined,
        county: undefined,
        address: null,
        lat: null,
        lng: null,
        plantType: null,
        sysType: null,
        capacity: null,
        selfUseRate: null,
        elecBenefit: null,
        subsidyBenefit: null,
        cost: null,
        dailyRepay: null,
        instituteId: null,
        userId: [],
        cover:[],
      },
      rules: {
        name: [{ required: true, message: '请输入电站名称', trigger: 'blur' }],
        province: [{ required: true, message: '请选择省份', trigger: 'change' }],
        city: [{ required: true, message: '请选择城市', trigger: 'change' }],
        county: [{ required: true, message: '请选择区县', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        lng: [{ required: true, message: '请输入经度', trigger: 'blur' }],
        lat: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
        capacity: [{ required: true, message: '请输入装机容量', trigger: 'blur' }],
      },
      provinces: [], // 保存所有省份数据
      cities: [], // 保存当前省份下的所有城市数据
      counties: [], // 保存当前城市下的所有区县数据
      marker: null,
      customStyle:
          'background: #ffffff;border-radius: 8px;margin-bottom: 10px;border: 0;overflow: auto; text-align: left',
      // 下面是选择机构相关
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      institutes: [],
      instituteId: null,
      institutesTree: [],
      selectedInstitute: null,
      users: [],
      userColumns: [
        {
          title: '登陆账号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '所属机构',
          dataIndex: 'institute',
          key: 'institute',
          scopedSlots: { customRender: 'institute' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      selectedUserColumns:[
        {
          title: '登陆账号',
          dataIndex: 'id',
          key: 'id',
        },{
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName',
          scopedSlots: { customRender: 'userName' },
        },{
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      selectedUsers: [],
    };
  },
  methods:{
    uploadURL() {
      return uploadURL
    },
    fetchData(){
      if(this.plantId){ // 编辑
        detailPlant(this.plantId).then(res=>{
          this.editableItem = JSON.parse(JSON.stringify(res.data));
          this.editableItem.cover = [];
          this.initAMap();
          this.selectedInstitute = res.data.instituteId;
          this.selectedUsers = res.data.userId;
          this.fetchInstituteData();
          if(res.data.cover)
            this.editableItem.cover.push({uid:-1, url:this.coverUrlWithPrefix(res.data.cover)})
        })
      }
    },
    initAMap() {
      AMapLoader.load({
        key: '7206aff33a411fb4ae512f160d58668f',  //设置您的key
        version: "2.0",
        plugins: ['AMap.Geolocation','AMap.Geocoder','AMap.Marker',],
        AMapUI: {
          version: "1.1",
          plugins: [],
        },
        Loca: {
          version: "2.0"
        },
      }).then((AMap) => {
        this.map = new AMap.Map("container", {
          viewMode: "3D",
          zoom: 12,
          zooms: [2, 22],
          center: [this.editableItem.lng, this.editableItem.lat],
        });

        this.marker = new AMap.Marker({
          position: [this.editableItem.lng, this.editableItem.lat],
          map: this.map,
        });

        // 获取所有省份的数据
        AMap.plugin(["AMap.DistrictSearch"], () => {
          const districtSearch = new AMap.DistrictSearch({
            level: "province",
            showbiz: false,
            extensions: "all",
            subdistrict: 1,
          });
          districtSearch.search("中国", (status, result) => {
            if (status === "complete") {
              const districts = result.districtList[0].districtList;
              this.provinces = districts.map((district) => district.name);
            }
          });
        });

        //添加定位等组件
        this.map.addControl(new AMap.Geolocation())

        // 添加地图点击事件
        this.map.on("click", (event) => {
          this.editableItem.lng = event.lnglat.getLng(); // 保存点击位置的经纬度信息
          this.editableItem.lat = event.lnglat.getLat();

          // 移除旧标记
          if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
          }

          // 创建 AMap.Geocoder 对象
          const  geocoder = new AMap.Geocoder({
            city: "全国"
          });
          // 使用 AMap.Geocoder 对象获取完整位置信息
          geocoder.getAddress([this.editableItem.lng, this.editableItem.lat], (status, result) => {
            if (status === "complete" && result.regeocode) {
              const addressComponent = result.regeocode.addressComponent;
              this.editableItem.province = addressComponent.province; // 保存省份信息
              this.editableItem.city = addressComponent.city; // 保存城市信息
              this.editableItem.county = addressComponent.district; // 保存区县信息
              // 创建标记
              this.marker = new AMap.Marker({
                position: [this.editableItem.lng, this.editableItem.lat],
                map: this.map,
              });
            }
          });
        });
      }).catch(e => {
        console.log(e);
      });
    },
    onProvinceChange() {
      this.cities = [];
      this.counties = [];
      const districtSearch = new AMap.DistrictSearch({
        level: "city",
        showbiz: false,
        extensions: "all",
        subdistrict: 1,
      });
      districtSearch.search(this.editableItem.province, (status, result) => {
        if (status === "complete") {
          const districts = result.districtList[0].districtList;
          this.cities = districts.map((district) => district.name);
        }
      });
    },
    onCityChange() {
      this.counties = [];
      // 根据选中的省份和城市，获取对应的区县数据
      this.counties = [];
      const districtSearch = new AMap.DistrictSearch({
        level: "district",
        showbiz: false,
        extensions: "all",
        subdistrict: 1,
      });
      districtSearch.search(this.editableItem.city, (status, result) => {
        if (status === "complete") {
          const districts = result.districtList[0].districtList;
          this.counties = districts.map((district) => district.name);
        }
      });
    },
    onCountyChange() {
      // 根据选中的省份、城市和区县，获取对应的经纬度和详细地址信息
      const address = `${this.editableItem.province}${this.editableItem.city}${this.editableItem.county}`;
      const geocoder = new AMap.Geocoder({
        city: address,
      });
      geocoder.getLocation(address, (status, result) => {
        if (status === "complete" && result.geocodes.length) {
          const location = result.geocodes[0].location;
          this.editableItem.lat = location.lat;
          this.editableItem.lng = location.lng;
          // 将地图移动到选中位置
          this.map.setCenter([this.editableItem.lng, this.editableItem.lat]);
          this.map.setZoom(12);
        }
      });
    },
    handleClickProvince() {
      console.log("handleClickProvince")
      this.editableItem.city = undefined;
      this.editableItem.county = undefined;
    },
    handleClickCity(){
      console.log("handleClickCity")
      this.editableItem.county = undefined;
    },
    handelCoverUploadChange(res){
      this.editableItem.cover = res.fileList;
      if(res.file.status === "done"){
        this.$message.success('上传成功')
        this.editableItem.cover = [];
        this.editableItem.cover.push({
          uid: res.file.uid,
          url: this.coverUrlWithPrefix(res.file.response.data),
        })
      }else if(res.file.status === "error"){
        this.$message.error('上传失败!只能上传小于1Mb的图片文件！')
        this.editableItem.cover = [];
      }else if(res.file.status === 'removed'){
        const removedFile = res.file
        const index = this.editableItem.cover.findIndex(file => file.uid === removedFile.uid)
        if (index !== -1) {
          this.editableItem.cover.splice(index, 1)
        }
      }
    },
    onEditPlantSubmit(){
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.editableItem));
          param.cover= this.editableItem.cover.length>0? this.coverUrlWithoutPrefix(this.editableItem.cover[0].url) : null;
          param.instituteId = this.selectedInstitute;
          param.userId = this.selectedUsers.map(item => {return item.id});
          if(!this.selectedUsers || this.selectedUsers.length<1){
            this.$message.warning("请至少选择一位业主");
            return;
          }
          addOrEditPlant(param).then(res=>{
            console.log(res)
            if(res.code === 0){
              this.$message.success(res.msg)
              this.onAddDrawerClose(true);
            } else{
              this.$message.error(res.msg)
              this.onAddDrawerClose(false);
            }
          })
        } else {
          return false;
        }
      });
    },
    // 下面是选择机构相关
    onInstituteSelect(selectedKeys) {
      if(this.selectedInstitute !== selectedKeys[0]){
        this.selectedUsers = [];
        this.selectedInstitute = selectedKeys[0];
        this.fetchUserData(this.selectedInstitute);
      }
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
        this.fetchUserData(this.selectedInstitute);
      }).catch(error => {
        console.error(error)
      })
    },
    fetchUserData(id){
      listInstituteUser(id, false).then(res => {
        this.users = res.data;
        this.users = this.users.filter(item=> item.instituteId === this.selectedInstitute); //不显示下级
        if(this.selectedUsers.length !== 0){ // 编辑 已获得userId
          this.selectedUsers = this.selectedUsers.map(item => {return {id: item, userName:this.getUsernameById(item)}})
        }
      }).catch(error => {
        console.error(error)
      })
    },
    getUsernameById(id){
      let user = this.users.find(item => item.id === id);
      return user? user.userName: null;
    },
    addOwner(record){
      let existingUser = this.selectedUsers.find(u => u.id === record.id);
      if (!existingUser) {
        this.selectedUsers.push({id:record.id,userName:record.userName});
      }
    },
    removeOwner(record){
      this.selectedUsers = this.selectedUsers.filter(item=>item.id!==record.id);
    },
  },
  created(){
    this.$watch('editableItem.province', (newVal, oldVal) => {
      if(newVal)
        this.onProvinceChange();
    })
    this.$watch('editableItem.city', (newVal, oldVal) => {
      if(newVal)
        this.onCityChange();
    })
    this.$watch('editableItem.county', (newVal, oldVal) => {
      if(newVal)
        this.onCountyChange();
    })
    this.instituteId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).instituteId : null
    this.fetchData();
  }
}
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 400px;
}
.posSelect-container{
  display:flex;
  justify-content: left;
  margin-top: 30px;
}
.posSelect{
  width: 180px;
  margin: 0 10px ;
  overflow: auto;
}
.steps-action {
  margin-top: 24px;
  text-align: center;
}
.steps-but{
  margin:0 5px;
  width: 10%;
}
</style>