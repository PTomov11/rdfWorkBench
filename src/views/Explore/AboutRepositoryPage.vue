<template>
  <SideBar active-section="About"></SideBar>
  <TopBar title="About Repository" ></TopBar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TopBar from "@/components/global-components/TopBar.vue";
import SideBar from "@/components/global-components/SideBar.vue";

export default defineComponent({
  name: "Aboutpage",
  components: {SideBar, TopBar}
})
</script>

<style scoped>

</style>