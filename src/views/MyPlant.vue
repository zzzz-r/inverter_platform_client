<template>
  <div style="background: #fff;padding: 10px;height: 100%">
    <a-tabs v-model:activeKey="curTab" style="text-align: left">
      <a-tab-pane key="1" tab="电站列表" style="background-color: #fff">
        <div
              :style="{ background: '#fff', padding: '0 10px', overflow: 'auto'}"
          >
            <PlantFrom :ifVisible="ifAddDrawerVisible" :plantId="passPlantID" @drawerClose="onAddDrawerClose" ></PlantFrom>
            <div style="margin-bottom: 12px; display: flex; justify-content: space-between">
              <div style="width: 70%;text-align: left">
                <a-input-search v-model="plantIdSearchText" placeholder="输入要查找的电站名称" style="width: 50%" @search="onSearch" class="mr5" />

                <a-button @click="reSetFilter">重置</a-button>
              </div>
              <div>
<!--                <a-button shape="round" class="mr5" @click="exportData">-->
<!--                  导出数据<a-icon type="download" />-->
<!--                </a-button>-->
                <a-button type="primary" class="mr5" @click="showAddDrawer(null)">
                  添加电站
                </a-button>
                <a-button type="primary" @click="showDeleteConfirm(null)" :disabled="!hasSelected" style="margin-right: 20px">
                  批量删除
                </a-button>
              </div>
            </div>
            <a-table
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :columns="columns"
                :data-source="ifSearchFiltered ? filteredData : data"
                rowKey="id"
                size="small"
                :locale="{ emptyText: '暂无数据' }"
                :scroll="{x: 1700}"
                :loading="loading"
            >
              <template slot="state" slot-scope="text">
                <a-tag color="green" v-if="text === 0">
                  通讯正常
                </a-tag>
                <a-tag v-else-if="text === 1">
                  接入中
                </a-tag>
                <a-tag color="red" v-else-if="text === 2">
                  设备离线
                </a-tag>
              </template>

              <template slot="alarm" slot-scope="text">
                <a-icon type="exclamation-circle" style="color: red" v-if="text !== false" />
                <a-icon type="check-circle" style="color: green" v-else />
              </template>

              <template slot="institute" slot-scope="text">
                {{text}}
              </template>

              <template slot="capacity" slot-scope="text">
                {{ text !== null ? text + "kWp" : "" }}
              </template>

              <template slot="power" slot-scope="text">
                {{ text !== null ? text + "kW" : "" }}
              </template>

              <template slot="owner" slot-scope="text">
                <span v-for="(owner, index) in text">{{ owner }}<br v-if="index !== text.length - 1"></span>
              </template>

              <template slot="pwRate" slot-scope="text,record">
                {{ record.power && record.capacity ? (record.power/record.capacity*100).toFixed(2) + '%' : ""}}
              </template>

              <template slot="dayGen" slot-scope="text">
                {{ text!==null ? text + "kWh" : "" }}
              </template>

              <template slot="genHour" slot-scope="text,record">
                {{ record.dayGen!==null && record.capacity ? (record.dayGen/record.capacity).toFixed(2) + 'h' : ""}}
              </template>

              <template slot="buildDate" slot-scope="text">
                {{$moment(text).format('YYYY-MM-DD')}}
              </template>

              <template slot="operation" slot-scope="text">
                <a-tooltip v-if="user.type === 1">
                  <template slot="title">
                    编辑
                  </template>
                  <a-button type="link" @click="showAddDrawer(text.id)"><a-icon type="edit" /></a-button>
                </a-tooltip>

                <a-divider type="vertical" style="margin:0"/>

                <a-tooltip v-if="user.type === 1">
                  <template slot="title">
                    删除
                  </template>
                  <a-button type="link" @click="showDeleteConfirm(text.id)"><a-icon type="delete" /></a-button>
                </a-tooltip>

                <a-divider type="vertical" style="margin:0" v-if="user.type === 1"/>

                <a-tooltip>
                  <template slot="title">
                    查看
                  </template>
                  <a-button type="link" @click="toPlantDetail(text.id)">
                    <a-icon type="profile" />
                  </a-button>
                </a-tooltip>

              </template>

            </a-table>
          </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="电站地图" force-render>
        <div id="plantMap" v-if="curTab === '2'" style="height: 100vh"></div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import {deletePlant, listPlant} from "@/api/api";
import PlantFrom from "@/components/PlantFrom.vue";
import {plantListExpURL} from "@/config/config";
import AMapLoader from "@amap/amap-jsapi-loader";
window._AMapSecurityConfig = {
  securityJsCode: 'f06653a86b643465e607ae67ffddc067'
}

export default {
  name: "MyPlant",
  components: {
    PlantFrom
  },
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      // 电站列表
      collapsed: false,
      data: [],
      institutesFilter: [],
      columns: [
        {
          title: '电站ID',
          dataIndex: 'id',
          fixed: 'left',
          width:100,
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: '电站名称',
          dataIndex: 'name',
          fixed: 'left',
          width:150,
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
          // 筛选框
          filters: [
            {
              text: '通讯正常',
              value: 0,
            },
            {
              text: '接入中',
              value: 1,
            },
            {
              text: '全部设备离线',
              value: 2,
            },
            {
              text: '部分设备离线',
              value: 3,
            }
          ],
          onFilter: (value, record) => record.state === value,
        },
        {
          title: '报警',
          dataIndex: 'alarm',
          width: 100,
          scopedSlots: { customRender: 'alarm' },
          filters: [
            {
              text: '有报警',
              value: 1,
            },
            {
              text: '无报警',
              value: 0,
            }
          ],
          onFilter: (value, record) => record.alarm === (value === 1),
        },
        {
          title: '所属机构',
          dataIndex: 'institute',
          scopedSlots: { customRender: 'institute' },
          filters: this.institutesFilter,
          onFilter: (value, record) => { return record.institute.indexOf(value) === 0;},
        },
        {
          title: '业主',
          dataIndex: 'owner',
          scopedSlots: { customRender: 'owner' },
        },
        {
          title: '装机容量',
          dataIndex: 'capacity',
          scopedSlots: { customRender: 'capacity' },
          sorter: (a, b) => a.capacity - b.capacity,
        },
        {
          title: '发电功率',
          dataIndex: 'power',
          scopedSlots: { customRender: 'power' },
          sorter: (a, b) => a.power - b.power,
        },
        {
          title: '功率归一化',
          dataIndex: 'pwRate',
          scopedSlots: { customRender: 'pwRate' },
          sorter: (a, b) => a.power / a.capacity - b.power / b.capacity,
        },
        {
          title: '当日发电量',
          dataIndex: 'dayGen',
          scopedSlots: { customRender: 'dayGen' },
          sorter: (a, b) => a.dayGen - b.dayGen,
        },
        {
          title: '当日满发小时',
          dataIndex: 'genHour',
          scopedSlots: { customRender: 'genHour' },
          sorter: (a, b) => a.dayGen / a.capacity - b.dayGen / b.capacity,
        },
        {
          title: '建站时间',
          dataIndex: 'buildDate',
          scopedSlots: { customRender: 'buildDate' },
          sorter: (a, b) => {
            // 将日期字符串转化为时间戳，然后比较
            return new Date(a.buildDate).getTime() - new Date(b.buildDate).getTime()
          },
        },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          fixed: 'right'
        }
      ],
      selectedRowKeys: [],
      loading: true,
      plantIdSearchText: "",
      filteredData: [],
      ifSearchFiltered: false,
      ifAddDrawerVisible: false,
      passPlantID: null,
      // 地图
      curTab: '1',
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
      listPlant(null)
          .then(res => {
            this.data = res.data
            // console.log(res.data)

            // 建立机构筛选列
            let institutes = Array.from(new Set(this.data.map(item => item.institute)))
            this.institutesFilter = institutes.map(institute => ({ text: institute, value: institute }))
            // 将筛选项添加到对应的列
            this.columns.forEach(column => {
              if (column.dataIndex === 'institute') {
                column.filters = this.institutesFilter;
              }
            })

            this.loading=false
          })
          .catch(error => {
            console.error(error)
          })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onSearch() {
      this.ifSearchFiltered = true;
      const plantIdSearchText = this.plantIdSearchText.trim();
      if (!plantIdSearchText) {
        this.filteredData = [];
        return;
      }
      this.filteredData = this.data.filter(item => {
        if (plantIdSearchText && !item.name.includes(plantIdSearchText)) {
          return false;
        }
        return true;
      });
    },
    reSetFilter(){
      this.ifSearchFiltered = false;
      this.filteredData = [];
    },
    deleteSelectedRows() {
      // 获取选中的行
      const selectedRows = this.data.filter(row => this.selectedRowKeys.includes(row.id))
      // 构建批量删除请求
      const deleteRequests = selectedRows.map(row => deletePlant(row.id))
      // 执行所有删除请求
      Promise.all(deleteRequests)
          .then(() => {
            // 所有请求都成功删除后，重新加载数据
            this.fetchData()
            this.selectedRowKeys = [] // 清空选中的行
            this.$message.success('删除成功')
          })
          .catch(error => {
            // 处理错误响应
            console.log(error)
          })
    },
    handleSingleDelete(id){
      deletePlant(id)
          .then(response => {
            // 更新表格数据
            this.fetchData()
            this.$message.success('删除成功')
          })
          .catch(error => {
            console.error(error)
          })
    },
    showDeleteConfirm(id) {
      this.$confirm({
        title: '删除电站',
        content: '确定要删除电站吗？这将导致电站所有数据丢失，请谨慎操作！',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => { //使用箭头函数绑定外部函数的上下文，this将指向Vue实例
          if(id)
            this.handleSingleDelete(id);
          else
            this.deleteSelectedRows();
        }
      });
    },
    showAddDrawer(id) {
      this.ifAddDrawerVisible = true;
      this.passPlantID = id;
    },
    onAddDrawerClose(ifVisible){
      this.ifAddDrawerVisible=ifVisible;
      this.fetchData();
    },
    exportData(){
      window.open(plantListExpURL);
    },
    toPlantDetail(plantId){
      // this.$store.commit("setPlantId",plantId);
      localStorage.setItem("plantId", plantId);
      this.$router.push("/platform/plantDetails");
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
        this.map = new AMap.Map("plantMap", {
          viewMode: "3D",
          zoom: 5,
          zooms: [2, 22],
          center: [105.602725, 32.076636],
        });

        //添加定位等组件
        try{
          this.map.addControl(new AMap.Geolocation())
        }catch (e){
          console.log(e);
        }

        for(let i = 0; i < this.data.length; i++) {
          const marker = new AMap.Marker({
            position: [this.data[i].lng, this.data[i].lat],
            title: this.data[i].name,
            extData: {
              id: this.data[i].id
            }
          });
          marker.on('click', (e) => {
            localStorage.setItem("plantId", e.target.getExtData().id);
            this.$router.push("/platform/plantDetails");
          });
          marker.setMap(this.map);
        }
      }).catch(e => {
        console.log(e);
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  watch:{
    curTab(){
      if(this.curTab === '2'){
        this.initAMap();
      }
    }
  }
};
</script>


<style>
.mr5{
  margin-right: 5px;
}
</style>