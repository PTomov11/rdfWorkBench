<template>
  <SideBar active-section="Repositories"></SideBar>
  <TopBar title="Repositories" ></TopBar>

  <div class="main">

  </div>
</template>

<script lang="ts">
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "../../components/global-components/TopBar.vue";
import {defineComponent} from "vue";
export default defineComponent({
  name: "RepositoriesPage",
  components: {TopBar, SideBar}
})
</script>

<style scoped>
  .main {
    position: absolute;
    top: 100px;
    left: 200px;
    width: 87%;
    height: 90%;
    background-color: #DCD6D6;
  }
</style>