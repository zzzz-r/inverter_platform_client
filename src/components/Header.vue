<template>
  <a-layout-header class="header">
    <!--      logo位置-->
    <div class="logo" />
    <!--      用户头像-->
    <div class="user-avatar">
      <a-avatar icon="user" v-if="!user.avatar"/>
      <img v-else :src="coverUrlWithPrefix(user.avatar)" class="avatar-img">
<!--      v-if="!user.avatar"-->
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()" style="color: white;margin-left: 5px">
          <span>{{ user.userName }} </span><a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <router-link :to="{ path: '/platform/user'}">个人中心</router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <a @click="openNotification">联系我们</a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3" @click="logout">
            退出登录
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <!--      顶部导航栏-->
    <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '64px', width: '60%', textAlign: 'left'}"
        :selected-keys="[ $route.meta.navIndex || '0']"
    >

      <a-menu-item key="1" class="top-nav">
        <router-link to="/platform/home">首页</router-link>
      </a-menu-item>
      <a-menu-item key="2" class="top-nav">
        <router-link to="/platform/plant">我的电站</router-link>
      </a-menu-item>
      <a-menu-item key="3" class="top-nav" v-if="user.type === 1">
        <router-link to="/platform/alarm">报警查询</router-link>
      </a-menu-item>
      <a-sub-menu key="4" class="top-nav" v-if="user.type === 1" >
        <span slot="title">权限管理</span>
        <a-menu-item key="4-1">
          <router-link to="/platform/institute">机构管理</router-link>
        </a-menu-item>
        <a-menu-item key="4-2">
          <router-link to="/platform/instituteUser">机构用户管理</router-link>
        </a-menu-item>
        <a-menu-item key="4-3">
          <router-link to="/platform/customer">业主管理</router-link>
        </a-menu-item>
      </a-sub-menu>
          </a-menu>

  </a-layout-header>
</template>

<script>
import {EventBus} from "@/main";
import {removePlusRoutes} from "@/router";

export default {
  name: "Header",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    };
  },
  methods:{
    logout(){
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    },
    handleAvatarChange(){
      this.user =  localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};
    },
    openNotification() {
      this.$notification.open({
        message: '联系方式',
        description:
            '使用遇到问题了吗？联系邮箱1019345956@qq.com',
        icon: <a-icon type="smile" style="color: #108ee9" />,
      });
    },
  },
  mounted() {
    EventBus.$on('userInfoChange', this.handleAvatarChange)
  }
};
</script>

<style scoped>
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
.top-nav{
  width: 130px;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
}
.user-avatar {
  height: 31px;
  margin: 16px 0;
  float: right;
  display: flex;
  align-items: center;
}
.avatar-img{
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
}
</style>