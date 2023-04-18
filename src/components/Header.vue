<template>
  <a-layout-header class="header">
    <!--      logo位置-->
    <div class="logo" />
    <!--      用户头像-->
    <div class="user-avatar">
      <a-avatar icon="user"/>
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()" style="color: white;margin-left: 5px">
          username <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <a href="http://www.alipay.com/">个人中心</a>
          </a-menu-item>
          <a-menu-item key="1">
            <a href="http://www.taobao.com/">联系我们</a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3">
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

        :style="{ lineHeight: '64px', width: '60%'}"
    >
<!--      :selectedKeys="selectedNavyKey"-->
      <a-menu-item key="1" class="top-nav">
        <router-link to="/">首页</router-link>
      </a-menu-item>
      <a-menu-item key="2" class="top-nav">
        <router-link to="/plant">我的电站</router-link>
      </a-menu-item>
      <a-menu-item key="3" class="top-nav">
        <router-link to="/map">报警查询</router-link>
      </a-menu-item>
      <a-menu-item key="4" class="top-nav">
        权限管理
      </a-menu-item>
    </a-menu>

  </a-layout-header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
    };
  },
  props:{
    selectedNavyKey: ['1'],
  }
};
</script>

<style scoped>
.header{
  height: ;
}
.logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left;
}
.top-nav{
  width: 20%;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
}
.user-avatar {
  height: 31px;
  /*background: green;*/
  margin: 16px 0;
  float: right;
  display: flex;
  align-items: center;
}
</style>