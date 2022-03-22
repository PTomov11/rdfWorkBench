<template>
  <div class="side-nav">
<!--    <span-->
<!--        class="collapse-icon"-->
<!--        :class="{ 'rotate-180': collapsed }"-->
<!--        @click="toggleSidebar"-->
<!--    >-->
<!--      <i class="pi pi-angle-double-left"/>-->
<!--    </span>-->
    <div>
      <img  class="logo" :src="require('@/assets/rdf_logo2.png')">
    </div>
    <div>
      <div class="ciara"></div>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Repositories'" class="active"></div>
      <i class="pi pi-book icon"></i>
      <router-link v-if="this.$store.state.selectedRepository.id.value" class="section" :to="{ name: 'RepositoriesPageSelected',params: {name:this.$store.state.selectedRepository.id.value }}">Repositories</router-link>
      <router-link class="section" :to="{ name: 'RepositoriesPage'}" v-else>Repositories</router-link>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Explore' || activeSection === 'About' || activeSection === 'Query'" class="active"></div>
      <i class="pi pi-compass icon"></i>
      <router-link class="section" :to="{ name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value || ' '} }">Explore</router-link>
    </div>
    <div class="menu-item">
      <router-link class="sub-section" :class="{'active-sub-section': activeSection === 'About'}" :to="{ name: 'AboutRepositoryPage', params: {name:this.$store.state.selectedRepository.id.value || ' '} }">About Repository</router-link>
      <router-link class="sub-section" :class="{'active-sub-section': activeSection === 'Query'}" :to="{ name: 'QueryPage',params: {name:this.$store.state.selectedRepository.id.value || ' ' } }">Query</router-link>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Update'" class="active"></div>
      <i class="pi pi-cloud-upload icon"></i>
      <router-link class="section" :to="{ name: 'UpdateRepositoryPage' }">Update</router-link>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'System'" class="active"></div>
      <i class="pi pi-cog icon"></i>
      <router-link class="section" :to="{ name: 'SystemPage' }">System</router-link>
    </div>
  </div>
  <router-view />
</template>

<script>

import {defineComponent} from "vue";
import {SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED} from "@/store/store";

export default defineComponent({
  name: "SideBar",
  props: ['activeSection'],
  data() {
    return {
      activeTab: null,
      // collapsed: this.$store.state.collapsed
    }
  }
})
</script>

<style scoped>
  .side-nav {
   /* Full-height: remove this if you want "auto" height */
    float: left;
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    bottom: 0;
    background-color: #01112C; /* Black */
    /*overflow-x: hidden; !* Disable horizontal scroll *!*/
    display: flex;
    flex-direction: column;
    /*align-items: flex-start;*/

    transition: 0.3s ease;
  }
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 200px;
    height: 45px;
    color: white;
    font-weight: bolder;
    font-size: 20px;
  }
  .ciara {
    width: 180px;
    margin: 0 10px 0 10px;
    border: 1px solid #DA5800;
    transform: matrix(1,0,0,1,0,0);
  }
  .icon {
    margin-left: 25px
  }
  .section {
    margin-left: 10px;
    text-decoration: none;
    color: white;
  }
  .sub-section {
    font-size: 15px;
    font-weight: normal;
    color: white;
    margin: 0 0 7px 50px;
    text-decoration: none;
    color: white;
  }
  .active {
    border-left: 8px solid #DA5800;
    height: 30px;
    position: absolute;
  }
  .active-sub-section {
    color: #DA5800;
  }
  .collapse-icon {
    position: absolute;
    bottom: 0;
    padding: 0.75em;

    color: white;

    transition: 0.2s linear;
  }
  .rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
  }
</style>