<template>
  <SideBar active-section="Update"></SideBar>
  <TopBar title="Update Repository" ></TopBar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "../../components/global-components/TopBar.vue";
export default defineComponent({
  name: "UpdatePage",
  components: {SideBar, TopBar}
})
</script>

<style scoped>

</style>