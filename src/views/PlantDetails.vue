<template>
  <a-layout>
    <a-layout>
      <!--      侧边栏-->
      <a-layout-sider width="160px" style="background: #fff">
        <a-menu
            mode="vertical"
            :default-selected-keys="['1']"
            :style="{ height: '100%', borderRight: 0 }"
            :selected-keys="[ $route.meta.sideNavIndex ]"
        >
          <a-menu-item key="0">
            <router-link :to="{ path: '/platform/plant'}" style="text-decoration:underline">返回电站列表</router-link>
          </a-menu-item>

          <a-menu-item key="1">
            <router-link :to="{ path: '/platform/plantDetails/board'}">
              <a-icon type="dashboard" />
              数据看板
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link :to="{ path: '/platform/plantDetails/devices'}">
              <a-icon type="profile" />
              设备列表
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link :to="{ path: '/platform/plantDetails/report'}">
              <a-icon type="calendar" />
              数据报表
            </router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <router-link :to="{ path: '/platform/plantDetails/info'}">
              <a-icon type="codepen" />
              关于电站
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0 20px 20px">
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

  },
  components:{
    DeviceList,
  },
  created() {
    this.plantId = localStorage.getItem("plantId") ? JSON.parse(localStorage.getItem("plantId")) : null
  }
};
</script>

<style scoped>

</style>
