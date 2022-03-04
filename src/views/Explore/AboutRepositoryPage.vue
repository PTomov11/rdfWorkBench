<template>
  <SideBar active-section="About"></SideBar>
  <TopBar title="About Repository" ></TopBar>

  <div class="main">

    <div>
      <div class="summary-header"><span>Summary</span></div>
      <div class="summary-container">
        <div class="summary">

        </div>
        <div class="summary">

        </div>
      </div>
    </div>

    <div>
      <div class="separator"></div>
    </div>

    <div class=content-container>
      <div>
        <TabMenu :model="items" @tab-change="change"/>
      </div>
      <div v-if="activeTab === -1"/>
      <div v-if="activeTab === 0">
        <DataTable class="table" :value="types" stripedRows responsiveLayout="scroll" style="min-height: 390px">
          <Column field="type.value" header="Name"></Column>
        </DataTable>
      </div>
      <div v-if="activeTab === 1">
        <DataTable :rows="10" class="table" :value="contexts" stripedRows responsiveLayout="scroll" style="min-height: 390px">
          <Column field="contextID.value" header="Name"></Column>
        </DataTable>
      </div>
      <div v-if="activeTab === 2" class="namespaces-tab">
        <div>
          <DataTable class="table" :value="namespaces" stripedRows responsiveLayout="scroll" style="min-height: 390px">
            <Column field="prefix.value" header="Prefix"></Column>
            <Column field="namespace.value" header="Namespace"></Column>
          </DataTable>
        </div>
        <div>
          <div class="filter">

          </div>
        </div>
      </div>
    </div>
    <router-view />


  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TopBar from "@/components/global-components/TopBar.vue";
import SideBar from "@/components/global-components/SideBar.vue";
import {Context, Namespace, Type} from "@/views/Explore/types/ExploreTypes";
import APIService from "@/services/APIService";

export default defineComponent({
  name: "AboutRepositoryPage",
  props: ['name'],
  components: {SideBar, TopBar},
  data() {
    return {
      activeTab: -1,
      items: [
        {label: 'Types', to: {name: 'Types', params:{name:this.$store.state.selectedRepository}}},
        {label: 'Context', to: {name: 'Context', params:{name:this.$store.state.selectedRepository}}},
        {label: 'Namespaces', to: {name: 'Namespaces', params:{name:this.$store.state.selectedRepository}}}
      ],
      types: [] as Type[],
      contexts: [] as Context[],
      namespaces: [] as Namespace[],
      apiService: null as unknown as APIService
    }
  },
  created() {
    this.apiService = new APIService()
  },
  methods: {
    change(event: any) {
      this.activeTab = event.index;
      if (event.index === 0) {
        this.apiService.getTypesOfRepository(this.$store.state.selectedRepository).then((data: Type[]) => this.types = data)
      } else if (event.index === 1) {
        this.apiService.getContextsOfRepository(this.$store.state.selectedRepository).then((data: Context[]) => this.contexts = data)
      } else {
        this.apiService.getNamespacesOfRepository(this.$store.state.selectedRepository).then((data: Namespace[]) => this.namespaces = data)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .summary-header {
    font-size: 60px;
    font-weight: bolder;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .summary {
    width: 700px;
    height: 150px;
    background-color: white;
    border-radius: 10px;
  }
  .separator {
    height: 30px;
    background-color: #01112C;
    margin-top: 30px;
  }
  .main {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    position: absolute;
    top: 100px;
    left: 200px;
    width: 89%;
    min-height: 89%;
    background-color: #DCD6D6;
  }
  .summary-container {
    display: flex;
    justify-content: space-around;
  }
  .content-container {
    display: flex;
    flex-direction: column;
    padding: 20px 20px 20px 20px;
    row-gap: 10px;
  }
  .filter {
    padding: 30px 30px 30px 30px;
    width: 500px;
    height: 380px;
    background-color: white;
    border-radius: 10px;
  }
  .table {
    min-width: 500px;
  }
  :deep(.p-tabmenu-nav) {
    justify-content: space-between;
    background: #DCD6D6;
    border-bottom-width: 4px;

  }
  ::v-deep .p-tabmenuitem {
    font-size: 35px;
  }
  ::v-deep .p-tabmenu .p-tabmenu-nav .p-highlight .p-menuitem-link {
    background: #DCD6D6;
    border-width: 0 0 4px 0;
    border-color: #DA5800;
    color: #6c757d;

  }
  ::v-deep .p-tabmenu .p-tabmenu-nav .p-menuitem-link {
    background-color: #DCD6D6;
  }

  ::v-deep .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):focus {
    box-shadow: none;
  }
  ::v-deep .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):hover {
    background-color: #DCD6D6;
    //padding-bottom: 18px;
    border-width: 0 0 4px 0;
  }
  .namespaces-tab {
    justify-content: space-between;
    flex-direction: row;
    display: flex;
  }
</style>