<template>
  <div class="side-nav " :style="{ width: this.getSideBarWidth }">
    <span
        class="collapse-icon"
        :class="{ 'rotate-180': this.getCollapsed }"
        @click="this.toggleSideBar()"
    >
      <i class="pi pi-angle-double-left"/>
    </span>
    <div>
      <div v-if="this.getCollapsed" style="height: 99px"></div>
      <img v-if="!this.getCollapsed" class="logo" :src="require('@/assets/rdf_logo.png')">
    </div>
    <div>
      <div v-if="this.getCollapsed" class="ciara" style="width: 30px;transition: 0.3s ease"></div>
      <div v-if="!this.getCollapsed" class="ciara" style="transition: 0.3s ease"></div>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Repositories'" class="active"></div>
      <SideBarLink v-if="this.getSelectedRepository.id.value" icon="pi pi-book"
                   :to="{name: 'RepositoriesPage', params: { name:this.getSelectedRepository.id.value || ' '}}">Repositories</SideBarLink>
      <SideBarLink v-else icon="pi pi-book" :to="{ name: 'RepositoriesPage' }">Repositories</SideBarLink>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Explore' || activeSection === 'About' || activeSection === 'Query'" class="active"></div>
      <div :class="{ disabled: isRepository }">
        <SideBarLink icon="pi pi-compass" :to="{ name: 'ExplorePage', params: { name:this.getSelectedRepository.id.value || ' '} }">Explore</SideBarLink>
      </div>
    </div>
    <div v-if="!this.getCollapsed" class="menu-item">
      <router-link class="sub-section" :class="{'active-sub-section': activeSection === 'About',  disabled: isRepository}" :to="{ name: 'AboutRepositoryPage', params: {name:this.getSelectedRepository.id.value || ' '} }">About Repository</router-link>
      <router-link class="sub-section" :class="{'active-sub-section': activeSection === 'Query',  disabled: isRepository}" :to="{ name: 'QueryPage',params: {name:this.getSelectedRepository.id.value || ' ' } }">Query</router-link>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Update'" class="active"></div>
      <div :class="{ disabled: isRepository }">
        <SideBarLink icon="pi pi-cloud-upload" :to="{name: 'UpdateRepositoryPage', params: { name:this.getSelectedRepository.id.value || ' '} }">Update</SideBarLink>
      </div>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'System'" class="active"></div>
      <SideBarLink icon="pi pi-cog" :to="{name: 'SystemPage'}">System</SideBarLink>
    </div>
  </div>
  <router-view />
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {mapActions, mapState} from "pinia";
import {useStore} from "@/store/store";
import SideBarLink from "@/components/global-components/SideBarLink.vue";

/*
 Author: Patrik Tomov
 Date: 7.5.2022
*/
export default defineComponent({
  name: "SideBar",
  components: { SideBarLink },
  props: ['activeSection'],
  data() {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    ...mapState(useStore, ['selectedRepository']),
    ...mapState(useStore, ['getSelectedRepository']),
    ...mapState(useStore, ['getSideBarWidth']),
    ...mapState(useStore, ['getCollapsed']),
    isRepository() {
      return this.getSelectedRepository.id.value === ""
    },
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
      if (!this.getCollapsed && this.windowWidth < 1400) {
        this.toggleSideBar()
      }
      if (this.getCollapsed && this.windowWidth > 1400) {
        this.toggleSideBar()
      }
    }
  },
  methods: {
    ...mapActions(useStore, ['toggleSideBar']),
  }
})
</script>

<style scoped>
.side-nav {
  position: sticky;
  width: 200px;
  height: 100vh;
  float: left;
  z-index: 2;
  top: 0;
  background-color: #01112C;
  display: flex;
  flex-direction: column;

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
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
/*.toggle-button {*/
/*  display: none;*/
/*}*/

@media only screen and (max-width: 700px) {
  .toggle-button {
    display: table;
    position: sticky;
    z-index: 2;
    height: 100px;
    float: left;
  }
  .side-nav {
    display: none;
  }
}
</style>