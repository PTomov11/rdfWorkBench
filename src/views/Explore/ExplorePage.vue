<template>
  <SideBar active-section="Explore"></SideBar>
  <TopBar title="Explore" ></TopBar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";


export default defineComponent({
  name: "ExplorePage",
  components: {TopBar, SideBar}
})
</script>

<style scoped>

</style>