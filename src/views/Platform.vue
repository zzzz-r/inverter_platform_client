<template>
  <div>
    <a-layout style="height: 100vh;overflow: auto">
      <Header/>
      <router-view/>
    </a-layout>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: 'Platform',
  components: {
    Header
  }
}
</script>
