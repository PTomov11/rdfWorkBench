<template>
  <SideBar :active-section="activeSection"></SideBar>
  <TopBar :title="title"></TopBar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar from "@/components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";

export default defineComponent({
  name: "MenuLayout",
  components: {TopBar, SideBar},
  props: ['title', 'activeSection']
})
</script>
