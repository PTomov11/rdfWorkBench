<template>
  <SideBar active-section="About"></SideBar>
  <TopBar title="About Repository" ></TopBar>

  <div class="main">

    <div class="summary-header">
      Summary
    </div>

    <div class="summary">

    </div>

    <div class="summary">

    </div>

    <div class="separator"></div>

    <TabMenu :model="items" />
    <router-view />


  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TopBar from "@/components/global-components/TopBar.vue";
import SideBar from "@/components/global-components/SideBar.vue";

export default defineComponent({
  name: "AboutRepositoryPage",
  components: {SideBar, TopBar},
  data() {
    return {
      items: [
        {label: 'Types', to: '/types'},
        {label: 'Context', to: '/context'},
        {label: 'Namespaces', to: '/namespaces'}
      ]
    }
  }

})
</script>

<style lang="scss" scoped>
  .summary-header {
    width: 100%;
    font-size: 70px;
    font-weight: bolder;
    text-align: center;
    height: 100px;
    margin-top: 10px;
  }
  .summary {
    width: 700px;
    height: 150px;
    background-color: white;
    border-radius: 10px;
    margin: 0 15px 0 75px;
  }
  .separator {
    width: 100%;
    height: 30px;
    background-color: #01112C;
    margin-top: 30px;
  }
  .main {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    top: 90px;
    left: 190px;
    width: 90%;
    background-color: #DCD6D6;
  }
  .p-component {
    font-size: 2rem;
  }
  .p-tabmenu {
    width: 100%;
    background-color: #DCD6D6;
  }
  .p-tabmenu-nav {
    justify-content: space-between !important;
  }
</style>