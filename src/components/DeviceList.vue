<template>
  <div style="background: #fff;padding: 10px">
    <a-tabs default-active-key="2" @change="onTabChange" style="text-align: left">
      <a-tab-pane key="1" tab="采集器">
        <DtuList/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="微型逆变器" force-render>
        <MiList/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import MiList from "@/components/MiList.vue";
import DtuList from "@/components/DtuList.vue";

export default {
  components: {DtuList, MiList},
  methods:{
    onTabChange(key){
    },
  },
};
</script>
