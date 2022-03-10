<template>
  <SideBar active-section="About"></SideBar>
  <TopBar title="About Repository" ></TopBar>

  <div class="main">
    <Toast/>
    <div>
      <div class="summary-header"><span>Summary</span></div>
      <div class="summary-container">
        <div class="summary">
          <div class="header">
            <span>Repository Location</span>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>Name: </span>
            </div>
            <div>
              <div class="text-background">
                <span>{{this.$store.state.selectedRepository.id.value}}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>Title: </span>
            </div>
            <div>
              <div class="text-background">
                <span>{{this.$store.state.selectedRepository.title.value}}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>Location: </span>
            </div>
            <div>
              <div class="text-background">
                <span>{{this.$store.state.selectedRepository.uri.value}}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>RDF4J Server: </span>
            </div>
            <div>
              <div class="text-background">
                <span>Nejaky textaaaaaaaa</span>
              </div>
            </div>
          </div>
        </div>
        <div class="summary" style="justify-content: space-around">
          <div class="header">
            <span>Repository Size</span>
          </div>
          <div class="input-container">
            <div style="width: 290px">
              <span>Number of statements: </span>
            </div>
            <div>
              <div class="text-background">
                <span>100000</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 290px">
              <span>Number of labeled contexts: </span>
            </div>
            <div>
              <div class="text-background">
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="separator"></div>
    </div>

    <div class=content-container>
      <div>
        <TabMenu :model="items" @tab-change="changeTab"/>
      </div>
      <div v-if="activeTab === -1"/>
      <div v-if="activeTab === 0">
        <DataTable :value="types" stripedRows responsiveLayout="scroll" :scrollable="true" scrollHeight="380px">
          <Column field="type.value" header="Type" :sortable="true"></Column>
        </DataTable>
      </div>
      <div v-if="activeTab === 1">
        <DataTable :rows="10" :value="contexts" stripedRows responsiveLayout="scroll" :scrollable="true" scrollHeight="380px">
          <Column field="contextID.value" header="Context" :sortable="true"></Column>
        </DataTable>
      </div>
      <div v-if="activeTab === 2" class="namespaces-tab">

        <DataTable :value="namespaces" data-key="prefix.value" stripedRows responsiveLayout="scroll" :scrollable="true" scrollHeight="380px" style="flex-grow: 1;">
          <Column field="prefix.value" header="Prefix" :sortable="true" style="max-width:200px"></Column>
          <Column field="namespace.value" header="Namespace"></Column>
        </DataTable>

        <div class="filter">
          <span style="font-size: 30px;font-weight: bolder">Prefix </span>
          <InputText class="input" style="width: 200px" type="text" v-model="prefix"/>
          <Dropdown v-model="selectedPrefix" style="width: 200px" :options="prefixes" optionLabel="name" placeholder="Select a prefix" @change="changePrefix" />
          <span style="font-size: 30px;font-weight: bolder">Namespace </span>
          <InputText class="input" type="text" v-model="namespace"/>
          <div style="display:flex;justify-content: space-between">
            <Button label="UPDATE" @click="updateNamespace"></Button>
            <Button label="DELETE" @click="deleteNamespace"></Button>
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
import {Repository, SelectedItem} from "@/views/Repositories/types/RepositoriesTypes";

export default defineComponent({
  name: "AboutRepositoryPage",
  props: ['name'],
  components: {SideBar, TopBar},
  data() {
    return {
      activeTab: -1,
      items: [
        {label: 'Types', to: {name: 'Types', params:{name:this.$store.state.selectedRepository.id.value}}},
        {label: 'Context', to: {name: 'Context', params:{name:this.$store.state.selectedRepository.id.value}}},
        {label: 'Namespaces', to: {name: 'Namespaces', params:{name:this.$store.state.selectedRepository.id.value}}}
      ],
      types: [] as Type[],
      contexts: [] as Context[],
      namespaces: [] as Namespace[],
      selectedPrefix: {} as SelectedItem,
      prefix: '' as string,
      namespace: '' as string,
      selectedNamespace: {} as Namespace,
      prefixes: [] as SelectedItem[],
      apiService: null as unknown as APIService
    }
  },
  created() {
    this.apiService = new APIService()
  },
  methods: {
    async changeTab(event: any) {
      this.activeTab = event.index;
      if (event.index === 0) {
        this.apiService.getTypesOfRepository(this.$store.state.selectedRepository.id.value).then((data: Type[]) => this.types = data)
      } else if (event.index === 1) {
        this.apiService.getContextsOfRepository(this.$store.state.selectedRepository.id.value).then((data: Context[]) => this.contexts = data)
      } else {
        await this.apiService.getNamespacesOfRepository(this.$store.state.selectedRepository.id.value).then((data: Namespace[]) => {
          this.namespaces = data
          this.$store.dispatch('setNamespaces', this.namespaces)
          this.prefixes = []
          for (let namespace in this.namespaces) {
            const prefix = {
              name: this.namespaces[namespace].prefix.value
            } as SelectedItem;
            this.prefixes.push(prefix)
          }
        })
      }
    },
    changePrefix() {
      this.prefix = this.selectedPrefix.name
      const namespace: Namespace | undefined = this.namespaces.find((namespace: Namespace) => namespace.prefix.value === this.selectedPrefix.name)
      if (namespace !== undefined) {
        this.selectedNamespace = namespace
        this.namespace = namespace.namespace.value
      }
    },
    async updateNamespace() {
      await this.apiService.updateNamespaceOfRepository(this.$store.state.selectedRepository.id.value, this.prefix, this.namespace)
      this.apiService.getNamespacesOfRepository(this.$store.state.selectedRepository.id.value).then((data: Namespace[]) => {
        this.namespaces = data
        this.prefixes = []
        for (let namespace in this.namespaces) {
          const prefix = {
            name: this.namespaces[namespace].prefix.value
          } as SelectedItem;
          this.prefixes.push(prefix)
        }
      })
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Namespace Updated', life: 3000})
      this.prefix = ''
      this.namespace = ''
      this.selectedPrefix = {} as SelectedItem
    },
    deleteNamespace() {
      this.apiService.deleteNamespaceOfRepository(this.$store.state.selectedRepository.id.value, this.prefix)
      this.namespaces = this.namespaces.filter(val => val.prefix.value !== this.selectedNamespace.prefix.value)
      this.prefixes = this.prefixes.filter(val => val.name !== this.selectedNamespace.prefix.value)
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Namespace Deleted', life: 3000})
      this.prefix = ''
      this.namespace = ''
      this.selectedPrefix = {} as SelectedItem
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
  .header {
    font-size: 30px;
    font-weight: bolder;
  }
  .summary {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 700px;
    height: 170px;
    background-color: white;
    border-radius: 10px;
  }
  .text-background {
    display: inline-block;
    background-color: #DCD6D6;
    border-radius: 10px;
    font-size: 18px;
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
    padding: 15px 15px 15px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 10px;

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
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .input-container {
    display: flex;
    font-size: 20px;
    align-items: center;
    gap: 20px;
  }
</style>