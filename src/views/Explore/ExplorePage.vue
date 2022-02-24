<template>
  <SideBar active-section="Explore"></SideBar>
  <TopBar title="Explore" ></TopBar>
  <div class="main">

    <div class="filter">
        <span>Resource: </span>
        <InputText class="input" type="text" v-model="resource" />
    </div>

    <div class="table">
      <DataTable :value="tableData" :paginator="true" :rows="10"
                 paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                 :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
        <Column field="subject" header="Subject"></Column>
        <Column field="predicate" header="Precidate"></Column>
        <Column field="object" header="Object"></Column>
        <Column field="context" header="Context"></Column>
        <template #paginatorstart>
          <Button type="button" icon="pi pi-refresh" class="p-button-text" />
        </template>
        <template #paginatorend>
          <Button type="button" icon="pi pi-cloud" class="p-button-text" />
        </template>
      </DataTable>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";


export default defineComponent({
  name: "ExplorePage",
  components: {TopBar, SideBar},
  data() {
    return {
      tableData: [],
      resource: null
    }
  },
  async created() {
    const response = await fetch('http://localhost:8080/rdf4j-server/repositories/skuska/statements', {
      method: 'GET',
      headers: {
        'Accept': 'application/rdf+json'
      }
    })
    const data = await response.json()
    console.log(data)
    var array2 = [] as any
    for (let key in data) {
      //console.log(key)

      for(let secondkey in data[key]) {
        const array = data[key][secondkey]
        //onsole.log(secondkey)

        array.forEach((item: any) =>{
          var object = {
            subject: key,
            predicate: secondkey,
            object: item.value,
            context: item.graphs[0]
          };
          array2.push(object)
        })
      }
    }
    this.tableData = array2
    console.log(this.tableData)
  },
  methods: {
  }
})
</script>

<style scoped>
  .filter {
    padding: 30px 30px 30px 30px;
    width: 1600px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    margin: 30px 15px 0 15px;
  }
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
  .table {
    margin: 30px 15px 0 15px;
    width: 1600px;
  }
  .input {
    background-color: #DCD6D6;
  }

</style>