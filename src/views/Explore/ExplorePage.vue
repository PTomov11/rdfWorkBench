<template>
  <SideBar active-section="Explore"></SideBar>
  <TopBar title="Explore" ></TopBar>
  <div class="main">
    <div>

      <div class="filter">
        <div class="input-container">
          <div style="width: 120px">
            <span>Resource: </span>
          </div>
          <div>
            <InputText class="input" type="text" v-model="resource" style="width: 400px"/>
          </div>
        </div>
      </div>

    </div>
    <div>
      <div class="table">
        <DataTable :value="tableData" :paginator="true" :rows="9" :loading="loading"
                   paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                   :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
          <Column header="Subject">
            <template #body="slotProps">
              <router-link @click="query(slotProps.data.subject)" :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository}, query:{resource: slotProps.data.subject}}">{{slotProps.data.subject}}</router-link>
            </template>
          </Column>
          <Column field="predicate" header="Predicate"></Column>
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

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";
import APIService from "@/services/APIService";
import {Statement, Type} from "@/views/Explore/types/ExploreTypes";


export default defineComponent({
  name: "ExplorePage",
  props: ['name'],
  components: {TopBar, SideBar},
  data() {
    return {
      tableData: [] as Statement[],
      resource: '' as string,
      apiService: null as unknown as APIService,
      loading: false
    }
  },
  async created() {
    this.apiService = new APIService()
  },
  mounted() {
    this.loading = true
    this.apiService.getStatements(this.name).then(data => {
      var array2 = [] as Statement[]
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
      this.loading = false
      this.tableData = array2
    })

  },
  methods: {
    query(queryString: string) {
      this.resource = queryString

    }
  }
})
</script>

<style scoped>
  .filter {
    padding: 30px 30px 30px 30px;
    width: 1550px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
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
  .table {
    width: 1550px;
  }
  .input-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }


</style>