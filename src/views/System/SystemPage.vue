<template>
  <SideBar active-section="System"></SideBar>
  <TopBar title="System" ></TopBar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "../../components/global-components/TopBar.vue";

export default defineComponent({
  name: "SystemPage",
  components: {SideBar, TopBar}
})
</script>

<style scoped>

</style>