<template>
  <a-layout>
    <div style="display: flex; justify-content: center">
      <div class="displayBlock">
        <div class="textTitle">
          发电情况
        </div>
        <a-divider style="margin: 0"/>
      </div>
      <div class="displayBlock">
        <div class="textTitle">
          电站状态
        </div>
        <a-divider style="margin: 0"/>
      </div>
      <div class="displayBlock">
        <div class="textTitle">
          所有设备
        </div>
        <a-divider style="margin: 0"/>
      </div>
      <div class="displayBlock">

      </div>
    </div>
  </a-layout>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
    };
  }
};
</script>

<style scoped>
.displayBlock{
  background-color: #fff;
  width: 25%;
  margin:25px 12px;
  border-radius: 10px;
  height: 38vh;
  border: 1px solid #e2e2e2;
}
.textTitle{
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 22%;
  text-align: left;
  padding-left: 20px;
}
.textTitle p {
  margin: 0;
}
</style>
