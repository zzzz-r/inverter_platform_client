<template>
  <a-layout>
    <div>{{plantId}}</div>
    <a-layout>
      <!--      侧边栏-->
      <a-layout-sider width="160px" style="background: #fff">
<!--        <a-button type="primary" class="plantBtn">创建电站</a-button>-->
<!--        <a-button type="danger" class="plantBtn">删除电站</a-button>-->
<!--        <a-divider style="margin-top: 15px"></a-divider>-->
        <a-menu
            mode="vertical"
            :default-selected-keys="['1']"
            :default-open-keys="['sub1']"
            :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="1">
            <a-icon type="mail" />
            数据看板
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="calendar" />
            设备列表
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="calendar" />
            关于电站
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0 20px 20px">
        <a-breadcrumb style="margin: 10px 0">
          <a-breadcrumb-item><a-icon type="home"/></a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
            :style="{ background: '#fff', padding: '10px', overflow: 'auto'}"
        >
          <DeviceList/>
        </a-layout-content>

      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import DeviceList from "@/components/DeviceList.vue";
export default {
  name: "PlantDetails",
  data() {
    return {
      collapsed: false,
      plantId: '',
    };
  },
  components:{
    DeviceList,
  },
  created() {
    this.plantId = this.$route.query.plantId  //通过router-link路由获取传参
  }
};
</script>

<style>
.header, .ant-breadcrumb {
  text-align: left;
}
/* 将面包屑上下居中 */
.ant-breadcrumb {
  display: flex;
  align-items: center;
}
/*.plantBtn{*/
/*  margin-top: 15px;*/
/*  width: 80%;*/
/*  !*background-color: #42b983;*!*/
/*}*/

</style>
