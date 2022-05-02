<template>

  <Button type="button" icon="pi pi-bars" class="toggle-button" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu"/>
  <TieredMenu id="overlay_tmenu" ref="menu" :model="items" :popup="true" />



  <div class="side-nav " :style="{ width: this.getSideBarWidth }">
<!--    <span-->
<!--        class="collapse-icon"-->
<!--        :class="{ 'rotate-180': this.getCollapsed }"-->
<!--        @click="this.toggleSideBar()"-->
<!--    >-->
<!--      <i class="pi pi-angle-double-left"/>-->
<!--    </span>-->
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
<!--      <i class="pi pi-book icon"></i>-->
<!--      <router-link v-if="this.getSelectedRepository.id.value" class="section" -->
<!--                   :to="{ name: 'RepositoriesPageSelected',params: { name:this.getSelectedRepository.id.value }}">Repositories</router-link>-->
<!--      <router-link class="section" :to="{ name: 'RepositoriesPage' }" v-else>Repositories</router-link>-->
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Explore' || activeSection === 'About' || activeSection === 'Query'" class="active"></div>
      <div :class="{ disabled: isRepository }">
        <SideBarLink icon="pi pi-compass" :to="{ name: 'ExplorePage', params: { name:this.getSelectedRepository.id.value || ' '} }">Explore</SideBarLink>
<!--        <i class="pi pi-compass icon"></i>-->
<!--        <router-link class="section" :to="{ name: 'ExplorePage', params: {name:this.repository.id.value || ' '}}">Explore</router-link>-->
      </div>

    </div>
    <div class="menu-item">
<!--      <SideBarLink icon="pi pi-cog" :to="{name: 'SystemPage'}">System</SideBarLink>-->
<!--      <SideBarLink icon="pi pi-cog" :to="{name: 'SystemPage'}">System</SideBarLink>-->
      <router-link class="sub-section" :class="{'active-sub-section': activeSection === 'About',  disabled: isRepository}" :to="{ name: 'AboutRepositoryPage', params: {name:this.getSelectedRepository.id.value || ' '} }">About Repository</router-link>
      <router-link class="sub-section" :class="{'active-sub-section': activeSection === 'Query',  disabled: isRepository}" :to="{ name: 'QueryPage',params: {name:this.getSelectedRepository.id.value || ' ' } }">Query</router-link>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'Update'" class="active"></div>
      <div :class="{ disabled: isRepository }">
        <SideBarLink icon="pi pi-cloud-upload" :to="{name: 'UpdateRepositoryPage'}">Update</SideBarLink>
<!--        <i class="pi pi-cloud-upload icon"></i>-->
<!--        <router-link class="section" :to="{ name: 'UpdateRepositoryPage' }">Update</router-link>-->
      </div>
    </div>
    <div class="menu-item">
      <div v-if="activeSection === 'System'" class="active"></div>
      <SideBarLink icon="pi pi-cog" :to="{name: 'SystemPage'}">System</SideBarLink>
<!--        <i class="pi pi-cog icon"></i>-->
<!--        <router-link class="section" :to="{ name: 'SystemPage' }">System</router-link>-->

    </div>
  </div>
  <router-view />
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {mapActions, mapState} from "pinia";
import {useStore} from "@/store/store";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";
import SideBarLink from "@/components/global-components/SideBarLink.vue";


export default defineComponent({
  name: "SideBar",
  components: { SideBarLink },
  props: ['activeSection'],
  data() {
    return {
      items: [
        {
          icon:'pi pi-book',
        },
        {
          label:'Explore',
          icon:'pi pi-fw pi-pencil',
          items:[
            {
              label:'AboutRepository',
              icon:'pi pi-fw pi-align-left'
            },
            {
              label:'Right',
              icon:'pi pi-fw pi-align-right'
            },
            {
              label:'Center',
              icon:'pi pi-fw pi-align-center'
            },
            {
              label:'Justify',
              icon:'pi pi-fw pi-align-justify'
            }
          ]
        },
        {
          label:'Users',
          icon:'pi pi-fw pi-user',
          items:[
            {
              label:'New',
              icon:'pi pi-fw pi-user-plus',

            },
            {
              label:'Delete',
              icon:'pi pi-fw pi-user-minus',

            },
            {
              label:'Search',
              icon:'pi pi-fw pi-users',
              items:[
                {
                  label:'Filter',
                  icon:'pi pi-fw pi-filter',
                  items:[
                    {
                      label:'Print',
                      icon:'pi pi-fw pi-print'
                    }
                  ]
                },
                {
                  icon:'pi pi-fw pi-bars',
                  label:'List'
                }
              ]
            }
          ]
        },
        {
          label:'Events',
          icon:'pi pi-fw pi-calendar',
          items:[
            {
              label:'Edit',
              icon:'pi pi-fw pi-pencil',
              items:[
                {
                  label:'Save',
                  icon:'pi pi-fw pi-calendar-plus'
                },
                {
                  label:'Delete',
                  icon:'pi pi-fw pi-calendar-minus'
                }
              ]
            },
            {
              label:'Archieve',
              icon:'pi pi-fw pi-calendar-times',
              items:[
                {
                  label:'Remove',
                  icon:'pi pi-fw pi-calendar-minus'
                }
              ]
            }
          ]
        },
        {
          separator:true
        },
        {
          label:'Quit',
          icon:'pi pi-fw pi-power-off'
        }
      ]
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
  methods: {
    ...mapActions(useStore, ['toggleSideBar']),
    toggle(event: any) {
      (this.$refs['menu'] as any).toggle(event);
    }
  }
})
</script>

<style scoped>
@media only screen and (min-width: 1200px) {
  .side-nav {
    position: relative;
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
  /*.collapse-icon {*/
  /*  position: absolute;*/
  /*  bottom: 0;*/
  /*  padding: 0.75em;*/

  /*  color: white;*/

  /*  transition: 0.2s linear;*/
  /*}*/
  .rotate-180 {
    transform: rotate(180deg);
    transition: 0.2s linear;
  }
  .disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  .toggle-button {
    display: none;
  }
}

@media only screen and (max-width: 1200px) {
  .toggle-button {
    top: 0;
    left: 0;
    height: 101px;
    width: 60px;
    position: fixed;
  }
  .p-button:focus {
    box-shadow: none;
  }
  .p-button:enabled:active {
    background-color: #0A2341;
    border-color: #0A2341;
  }
  .p-button {
    background-color: #0A2341;
  }
  .side-nav {
    display: none;
  }
}


</style>