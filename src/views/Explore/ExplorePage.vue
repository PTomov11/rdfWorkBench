<template>
  <SideBar active-section="Explore"></SideBar>
  <TopBar title="Explore" ></TopBar>
  <div class="main">

    <div class="filter">
      <div class="input-container">
        <div style="width: 150px">
          <span>Resource: </span>
        </div>
        <div>
          <InputText class="input" type="text" v-model="resource" style="width: 400px"/>
        </div>
      </div>
      <div class="input-container">
        <div style="width: 150px">
          <span>Download format: </span>
        </div>
        <div>
          <Dropdown v-model="selectedFormat" :options="formats" optionLabel="name" placeholder="Select a format" />
        </div>
        <div>
          <Button label="DOWNLOAD" @click="downloadFile"></Button>
        </div>
      </div>
    </div>


    <DataTable :value="tableData" :paginator="true" :alwaysShowPaginator="false" :rows="9" :loading="loading"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
      <Column header="Subject">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.subject.length > 45" @click="query(slotProps.data.subject)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.subject}}" v-tooltip.right="{ value: slotProps.data.subject }">{{truncate(slotProps.data.subject, 45, '...')}}</router-link>
          <router-link v-else @click="query(slotProps.data.subject)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.subject}}">{{slotProps.data.subject}}</router-link>
        </template>
      </Column>
      <Column header="Predicate">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.predicate.length > 40" @click="query(slotProps.data.predicate)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.predicate}}" v-tooltip.right="{ value: slotProps.data.predicate }">{{truncate(slotProps.data.predicate, 40, '...')}}</router-link>
          <router-link v-else @click="query(slotProps.data.predicate)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.predicate}}">{{slotProps.data.predicate}}</router-link>
        </template>
      </Column>
      <Column header="Object">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.object.length > 40" @click="query(slotProps.data.object)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.object}}" v-tooltip.right="{ value: slotProps.data.object }">{{truncate(slotProps.data.object, 40, '...')}}</router-link>
          <router-link v-else @click="query(slotProps.data.object)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.object}}">{{slotProps.data.object}}</router-link>
        </template>
      </Column>
      <Column header="Context">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.context.length > 40" @click="query(slotProps.data.context)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.context}}" v-tooltip.right="{ value: slotProps.data.context }">{{truncate(slotProps.data.context, 40, '...')}}</router-link>
          <router-link v-else @click="query(slotProps.data.context)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.context}}">{{slotProps.data.context}}</router-link>
        </template>
      </Column>
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" class="p-button-text" />
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-cloud" class="p-button-text" />
      </template>
    </DataTable>


  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";
import APIService from "@/services/APIService";
import {Statement, Type} from "@/views/Explore/types/ExploreTypes";
import helperUtils from "@/services/helperUtils";


export default defineComponent({
  name: "ExplorePage",
  props: ['name'],
  components: {TopBar, SideBar},
  data() {
    return {
      tableData: [] as Statement[],
      resource: '' as string,
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
      loading: false,
      selectedFormat: '',
      formats: [
        {name: 'Turtle'},
        {name: 'RDF/JSON'},
        {name: 'TriG'},
      ],
      jsonData: null as any
    }
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    this.loading = true
    // download mock
    // this.apiService.getStatements(this.name).then(data => {
    //   this.jsonData = data
    //   console.log(this.jsonData)
    //   console.log(JSON.stringify(this.jsonData))
    // })
    this.apiService.getStatements(this.name).then(data => {
      const namespaces = this.$store.state.namespaces
      this.jsonData = data
      this.tableData = this.helperUtils.prepareStatements(data, namespaces)
      this.loading = false
    })
  },
  methods: {
    query(queryString: string) {
      this.resource = queryString
      //this.apiService.query(this.name)
    },
    downloadFile() {
      const blob = new Blob([this.jsonData], {type:"application/trig"})
      const href = URL.createObjectURL(blob)

      const a = Object.assign(document.createElement("a"), {
        href,
        style: "display:none",
        download: "file.trig"
      })

      a.click()
      URL.revokeObjectURL(href)
      a.remove()
    },
    truncate (text: string, length: number, suffix: any) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
  }
})
</script>

<style scoped>
  .filter {
    padding: 30px 30px 30px 30px;
    display: flex;
    justify-content: flex-start;
    width: 1600px;
    height: 100px;
    background-color: white;
    border-radius: 10px;
    flex-direction: row;
    gap: 50px;
  }
  .main {
    padding: 20px 0 30px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: flex-start;
    row-gap: 50px;
    position: absolute;
    top: 100px;
    left: 200px;
    width: 89%;
    min-height: 89%;
    height: fit-content;
    background-color: #DCD6D6;
  }
  .input-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  :deep(.p-datatable) {
    width: 1600px;
  }
  :deep([role=cell]) {
    width: 400px;
  }
</style>