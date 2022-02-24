<template>
  <SideBar active-section="Repositories"></SideBar>
  <TopBar title="Repositories" ></TopBar>

  <div class="main">
    <div>

      <div class="card">
        <DataTable :value="tableData" v-model:selection="selectedProduct2" selectionMode="single" dataKey="id"
                   @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" responsiveLayout="scroll">
          <Column field="id.value" header="Name"></Column>
          <Column field="title.value" header="Description"></Column>
          <Column field="uri.value" header="Location"></Column>
          <Column header="Location"> <Button></Button></Column>
        </DataTable>
      </div>
      <Button label="CREATE NEW REPOSITORY"></Button>


    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import APIService from "@/services/APIService";
import SideBar from "@/components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";

export default defineComponent({
  name: "RepositoriesList",
  components: {TopBar, SideBar},
  data() {
    return {
      tableData: [],
      selectedProduct2: null
    }
  },
  created() {
    const apiService = new APIService();
    apiService.getListOfRepositories().then(data => this.tableData = data);
    console.log(this.tableData)
  },
  methods: {
    onRowSelect(event: { data: { name: string; }; }) {
      //this.$toast.add({severity: 'info', summary: 'Product Selected', detail: 'Name: ' + event.data.name, life: 3000});
      console.log("TU")
    },
    onRowUnselect(event: { data: { name: string; }; }) {
      console.log("TU")
      //this.$toast.add({severity: 'warn', summary: 'Product Unselected', detail: 'Name: ' + event.data.name, life: 3000});
    }
  }

  // methods: {
  //   async handleClick() {
  //     const response = await fetch('http://localhost:8080/rdf4j-server/repositories', {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/sparql-results+json'
  //       }
  //     })
  //     const data = await response.json()
  //     this.tableData = data.results.bindings
  //     console.log(this.tableData)
  //   }
  // }


})
</script>

<style scoped>
  .main {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 100px;
    left: 201px;
    width: 89.5%;
    height: 89%;
    background-color: #DCD6D6;
  }
</style>