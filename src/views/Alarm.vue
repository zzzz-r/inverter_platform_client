<template>
  <div style="padding: 0 10px">
    <a-tabs default-active-key="2" style="text-align: left;background-color: #ffffff;margin-top:5px">
      <a-tab-pane key="1" tab="采集器" style="overflow: scroll">
        <DtuAlarmList/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="微型逆变器" style="overflow: scroll">
        <MiAlarmList/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import MiAlarmList from "@/components/MiAlarmList.vue";
import DtuAlarmList from "@/components/DtuAlarmList.vue";

export default {
  name: "Alarm",
  components: {DtuAlarmList, MiAlarmList}
}
</script>

<style scoped>

</style>