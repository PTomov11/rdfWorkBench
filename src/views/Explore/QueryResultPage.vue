<template>
  <Toast/>
  <MenuLayout :title="'Query Result: ' + this.getResults" active-section="Query"></MenuLayout>

  <div class="main">
    <div>
      <Button class="back-button" label="BACK TO QUERY" @click="redirectBack"></Button>
    </div>
    <DataTable v-if="!isAskQueryExecuted" :value="queryResults" :paginator="true" :alwaysShowPaginator="false" :rows="10"
               :loading="loading" responsiveLayout="stack" breakpoint="1000px"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
      <Column v-for="(col,index) of columns" :header="col.header" :key="col.field">
        <template #body="slotProps">
          <router-link v-if="needTruncate(slotProps.data[index])" @click="queryResource(slotProps.data[index])"
                       :to="{name: 'ExplorePage',
                     params: {name:this.name},
                     query:{resource: encodeURIComponent(slotProps.data[index])}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data[index]) }">
            {{ truncate(slotProps.data[index], this.returnWidth(), '...') }}
          </router-link>
          <router-link v-else @click="queryResource(slotProps.data[index])" :to="{name: 'ExplorePage',
                     params: {name:this.name},
                     query:{resource: encodeURIComponent(slotProps.data[index])}}">
            {{ slotProps.data[index] }}
          </router-link>
        </template>
      </Column>
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" class="p-button-text"/>
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-cloud" class="p-button-text"/>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/sparql/sparql'
import {defineComponent} from "vue";
import APIService from "@/services/APIService";
import helperUtils from "@/services/helperUtils";
import MenuLayout from "@/components/global-components/MenuLayout.vue";
import {mapActions, mapState} from "pinia";
import useStore from "@/store/store";
import {Column} from "@/views/Explore/types/ExploreTypes";

/*
    Author: Patrik Tomov
    Date: 7.5.2022
*/
export default defineComponent({
  name: "QueryResultPage",
  props:['name'],
  components: {MenuLayout},
  data() {
    return {
      queryResults: [] as any,
      columns: [] as Column[],
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
      isAskQueryExecuted: false as boolean,
      askQueryResult: '' as string,
      loading: false,
    }
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    this.loading = true
    if (typeof this.$route.params.isAskQuery === "string") {
      this.isAskQueryExecuted = this.$route.params.isAskQuery === 'true';
    }
    if (typeof this.$route.query.resource === "string") {
      this.query(this.$route.query.resource, this.isAskQueryExecuted)
    }
  },
  computed: {
    ...mapState(useStore, ['getQueryResults']),
    ...mapState(useStore, ['getQueryResultsCount']),
    ...mapState(useStore, ['getColumns']),
    ...mapState(useStore, ['getNamespaces']),
    getResults() {
      if (!this.queryResults.length && !this.isAskQueryExecuted) {
        return 'empty result'
      } else if (this.queryResults.length && !this.isAskQueryExecuted) {
        return this.queryResults.length
      } else if (this.isAskQueryExecuted) {
        return this.askQueryResult
      }
      return ''
    }
  },
  methods: {
    ...mapActions(useStore, ['setQueryResults']),
    truncate(text: string, length: number, suffix: any) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
    replaceChar(value: string) {
      return value.replace("<", "&lt;")
    },
    async query(queryString: string, isAskQuery: boolean) {
      await this.apiService.query(this.name, queryString, isAskQuery, null).then(data => {
        this.columns = this.helperUtils.prepareColumnsOfQuery(data)
        if (this.isAskQueryExecuted && isAskQuery) {
          this.askQueryResult = data.boolean
        } else {
          const namespaces = this.getNamespaces
          this.helperUtils.prepareResultsOfQuery(data, this.columns, namespaces).then(data => {
            this.setQueryResults(data)
            this.queryResults = data
          })
        }
        this.loading = false
      })
    },
    redirectBack() {
      this.$router.push({name: 'QueryPage', params: {name: this.name}})
    },
    returnWidth(): number {
      if (this.columns.length <= 3) {
        return 57
      } else if (this.columns.length > 3 && this.columns.length <= 6) {
        return 20
      }
      return 100
    },
    needTruncate(value: string) {
      if (this.columns.length <= 3) {
        return value.length > 57
      } else if (this.columns.length > 3 && this.columns.length <= 6) {
         return  value.length > 20
      }
      return false
    },
    isQueryResult() {
      return this.queryResults.length <= 0;
    },
    queryResource(queryString: string) {
      this.$router.push({name: 'ExplorePage', params: {name: this.name}, query:{resource: encodeURIComponent(queryString)}})
    }
  }
})
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: calc(100vh - 100px);
  overflow: auto;
  background-color: #DCD6D6;
  transition: 0.3s ease;
  align-content: flex-start;
  row-gap: 30px;
}
:deep(.p-datatable) {
  margin-top: 150px;
  width: 1600px;
}
:deep([role=cell]) {
  width: 250px;
}
.back-button {
  height: 80px;
  position: absolute;
  top: 120px;
  right: 50px;
}
:deep(.pi) {
  color: black;
}
</style>