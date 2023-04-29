<template>
  <a-layout>
    <a-layout>
      <!--      侧边栏-->
      <a-layout-sider width="160px" style="background: #fff">
<!--        <a-button type="primary" class="plantBtn">创建电站</a-button>-->
<!--        <a-button type="danger" class="plantBtn">删除电站</a-button>-->
<!--        <a-divider style="margin-top: 15px"></a-divider>-->
        <a-menu
            mode="vertical"
            :default-selected-keys="['1']"
            :style="{ height: '100%', borderRight: 0 }"
            @click="handleClickMenu"
        >
          <a-menu-item key="0">
            <router-link :to="{ path: '/platform/plant'}" style="text-decoration:underline">返回电站列表</router-link>
          </a-menu-item>

          <a-menu-item key="1">
            <router-link :to="{ path: '/platform/plantDetails/board'}">
              <a-icon type="calendar" />
              数据看板
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link :to="{ path: '/platform/plantDetails/devices'}">
              <a-icon type="calendar" />
              设备列表
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="calendar" />
            关于电站
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0 20px 20px">
<!--        <a-breadcrumb separator="/" style="margin: 10px 0">-->
<!--          <a-breadcrumb-item href="/platform"><a-icon type="home"/></a-breadcrumb-item>-->
<!--          <a-breadcrumb-item href="/platform/plant">List</a-breadcrumb-item>-->
<!--          <a-breadcrumb-item>App</a-breadcrumb-item>-->
<!--        </a-breadcrumb>-->
<!--        <a-breadcrumb :routes="breadcrumbs">-->
<!--          <template slot="itemRender" slot-scope="{ route, params, routes, paths }">-->
<!--        <span v-if="routes.indexOf(route) === routes.length - 1">-->
<!--          {{ route.breadcrumbName }}-->
<!--        </span>-->
<!--            <router-link v-else :to="`${basePath}/${paths.join('/')}`">-->
<!--              {{ route.breadcrumbName }}-->
<!--            </router-link>-->
<!--          </template>-->
<!--        </a-breadcrumb>-->
        <a-layout-content
            :style="{ overflow: 'auto', marginTop: '10px'}"
        >
          <router-view/>
        </a-layout-content>

      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import DeviceList from "@/components/DeviceList.vue";
import router from '@/router'
export default {
  name: "PlantDetails",
  props:{

  },
  data() {
    return {
      collapsed: false,
      plantId: '',
      basePath: '/platform',
      breadcrumbs: [],
    };
  },
  methods:{
    handleClickMenu(e){
      console.log(e);
      if(e.key === "2"){
        console.log("1");
      }
    },
  },
  components:{
    DeviceList,
  },
  created() {
    this.plantId = localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null
    // const matchedRoutes = router.currentRoute.matched
    // this.breadcrumbs = matchedRoutes.map(route => ({
    //   path: route.path,
    //   breadcrumbName: route.meta?.breadcrumb || route.name
    // }))
  }
};
</script>

<style scoped>

</style>
