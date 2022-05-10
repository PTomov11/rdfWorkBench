<template>
  <Toast/>
  <Toast position="bottom-right" group="br"/>
  <MenuLayout title="Explore" active-section="Explore"></MenuLayout>

  <div class="main">

    <div class="container">
      <div class="input-container">
        <div>
          <span style="font-weight: bolder;font-size: 20px">Resource: </span>
        </div>
        <div>
          <InputText v-on:keyup.enter="enterPressed(resource)" class="input" type="text" v-model="resource" style="width: 400px"/>
        </div>
        <div>
          <Button class="press-button" label="SEARCH" @click="search(resource)"></Button>
        </div>
      </div>
      <form @submit.prevent="downloadFile(!v$.$invalid)" class="p-fluid input-container">
        <div style="width: 200px">
          <span style="font-weight: bolder;font-size: 20px">Download format: </span>
        </div>
        <div>
          <Dropdown v-model="v$.selectedFormat.$model" class="drop-down"
                    :class="{'p-invalid':v$.selectedFormat.$invalid && submitted}" :options="formats" optionLabel="name"
                    placeholder="Select a format"/>
        </div>
        <small v-if="(v$.selectedFormat.$invalid && submitted) || v$.selectedFormat.$pending.$response" class="p-error">
          {{ v$.selectedFormat.required.$message.replace('Value', 'Format') }}</small>
        <div>
          <Button :loading="loadingDownload" class="press-button" type="submit" label="DOWNLOAD"></Button>
        </div>
      </form>
    </div>

    <DataTable v-if="!isQueryExecuted" :value="tableData" :lazy="true" :paginator="true" :rows="10" :loading="loading"
               @page="onPage($event)" ref="dt" :totalRecords="totalRecords"  responsiveLayout="stack" breakpoint="1000px"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
      <Column header="Subject">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.subject.length > 38" @click="query(slotProps.data.subject)"
                       :to="{name: 'ExplorePage',
                     params: {name:this.getSelectedRepository.id.value},
                     query:{resource: encodeURIComponent(slotProps.data.subject)}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.subject) }">
            {{ truncate(slotProps.data.subject, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.subject)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                      query:{resource: encodeURIComponent(slotProps.data.subject)}}">
            {{ slotProps.data.subject }}
          </router-link>
          <Button v-if="slotProps.data.subject" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.subject)"
                  class="copy-button"/>
        </template>
      </Column>
      <Column header="Predicate">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.predicate.length > 38" @click="query(slotProps.data.predicate)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                       query:{resource: encodeURIComponent(slotProps.data.predicate)}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.predicate) }">
            {{ truncate(slotProps.data.predicate, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.predicate)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                       query:{resource: encodeURIComponent(slotProps.data.predicate)}}">
            {{ slotProps.data.predicate }}
          </router-link>
          <Button v-if="slotProps.data.predicate" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.predicate)"
                  class="copy-button"/>
        </template>
      </Column>
      <Column header="Object">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.object.length > 38" @click="query(slotProps.data.object)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                       query:{resource: encodeURIComponent(slotProps.data.object)}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.object) }">
            {{ truncate(slotProps.data.object, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.object)"
                       :to="{name: 'ExplorePage',
                     params: {name:this.getSelectedRepository.id.value},
                     query:{resource: encodeURIComponent(slotProps.data.object)}}">
            {{ slotProps.data.object }}
          </router-link>
          <Button v-if="slotProps.data.object" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.object)"
                  class="copy-button"/>
        </template>
      </Column>
      <Column header="Context">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.context.length > 38" @click="query(slotProps.data.context)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                      query:{resource: encodeURIComponent(slotProps.data.context)}}"
                       v-tooltip.left="{ value: slotProps.data.context }">
            {{ truncate(slotProps.data.context, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.context)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                      query:{resource: encodeURIComponent(slotProps.data.context)}}">
            {{ slotProps.data.context }}
          </router-link>
          <Button v-if="slotProps.data.context" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.context)"
                  class="copy-button"/>
        </template>
      </Column>
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" class="p-button-text"/>
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-cloud" class="p-button-text"/>
      </template>
    </DataTable>



    <DataTable v-if="isQueryExecuted" :value="tableData" :paginator="true" :rows="10" :loading="loading"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
      <Column header="Subject">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.subject.length > 38" @click="query(slotProps.data.subject)"
                       :to="{name: 'ExplorePage',
                     params: {name:this.getSelectedRepository.id.value},
                     query:{resource: encodeURIComponent(slotProps.data.subject)}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.subject) }">
            {{ truncate(slotProps.data.subject, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.subject)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                      query:{resource: encodeURIComponent(slotProps.data.subject)}}">
            {{ slotProps.data.subject }}
          </router-link>
          <Button v-if="slotProps.data.subject" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.subject)"
                  style="width: 20px; height: 20px; margin-left: 2px;position: absolute"/>
        </template>
      </Column>
      <Column header="Predicate">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.predicate.length > 38" @click="query(slotProps.data.predicate)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                       query:{resource: encodeURIComponent(slotProps.data.predicate)}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.predicate) }">
            {{ truncate(slotProps.data.predicate, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.predicate)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                       query:{resource: encodeURIComponent(slotProps.data.predicate)}}">
            {{ slotProps.data.predicate }}
          </router-link>
          <Button v-if="slotProps.data.predicate" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.predicate)"
                  style="width: 20px; height: 20px; margin-left: 2px;position: absolute"/>
        </template>
      </Column>
      <Column header="Object">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.object.length > 38" @click="query(slotProps.data.object)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                       query:{resource: encodeURIComponent(slotProps.data.object)}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.object) }">
            {{ truncate(slotProps.data.object, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.object)"
                       :to="{name: 'ExplorePage',
                     params: {name:this.getSelectedRepository.id.value},
                     query:{resource: encodeURIComponent(slotProps.data.object)}}">
            {{ slotProps.data.object }}
          </router-link>
          <Button v-if="slotProps.data.object" icon="pi pi-copy" @click="copyToClipboard(slotProps.data.object)"
                  style="width: 20px; height: 20px; margin-left: 2px;position: absolute"/>
        </template>
      </Column>
      <Column header="Context">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.context.length > 38" @click="query(slotProps.data.context)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                      query:{resource: encodeURIComponent(slotProps.data.context)}}"
                       v-tooltip.left="{ value: slotProps.data.context }">
            {{ truncate(slotProps.data.context, 38, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.context)"
                       :to="{name: 'ExplorePage',
                      params: {name:this.getSelectedRepository.id.value},
                      query:{resource: encodeURIComponent(slotProps.data.context)}}">
            {{ slotProps.data.context }}
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
import { defineComponent } from "vue";
import APIService from "@/services/APIService";
import {LazyParam, Statement} from "@/views/Explore/types/ExploreTypes";
import helperUtils from "@/services/helperUtils";
import MenuLayout from "@/components/global-components/MenuLayout.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {mapActions, mapState} from "pinia";
import { useStore } from "@/store/store";

/*
    Author: Patrik Tomov
    Date: 7.5.2022
*/
export default defineComponent({
  name: "ExplorePage",
  props: ['name'],
  components: {MenuLayout},
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      tableData: [] as Statement[],
      totalRecords: 0 as number,
      resource: '' as string,
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
      loading: false,
      selectedFormat: '' as any,
      formats: [
        {name: 'TURTLE', extension: '.ttl'},
        {name: 'RDF/JSON', extension: '.rj'},
        {name: 'RDF/XML', extension: '.rdf'},
        {name: 'N-TRIPLES', extension: '.nt'},
        {name: 'N3', extension: '.n3'},
        {name: 'N-QUADS', extension: '.nq'},
        {name: 'JSON-LD', extension: '.jsonld'},
        {name: 'Trix', extension: '.xml'},
        {name: 'TriG', extension: '.trig'},
      ],
      loadingDownload: false as boolean,
      submitted: false,
      lazyParams: {} as LazyParam,
      isQueryExecuted: false as boolean,
    }
  },
  validations() {
    return {
      selectedFormat: {
        required
      }
    }
  },
  watch: {
    $route() {
      this.isQueryExecuted = false
      this.$forceUpdate
      const encodedQueryString = this.$route.query.resource
      if (typeof encodedQueryString === 'undefined') {
        this.resource = ''
        this.lazyParams = {
          first: 0,
          rows: 10,
          page: 0,
          pageCount: 0
        }
        this.loadLazyData()
      }
      if (typeof encodedQueryString === "string") {
        this.query(encodedQueryString)
      }
    }
  },
  computed: {
    ...mapState(useStore, ['getSelectedRepository']),
    ...mapState(useStore, ['getNamespaces']),
    ...mapState(useStore, ['getNumberOfStatements'])
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    this.lazyParams = {
      first: 0,
      rows: (this.$refs['dt'] as any).rows,
      page: 0,
      pageCount: 0
    }
    if (this.$route.query.resource) {
      if (typeof this.$route.query.resource === 'string') {
          this.query(this.$route.query.resource)
      }
    } else {
      this.loadLazyData()
    }
  },
  methods: {
    ...mapActions(useStore, ['setNumberOfStatements']),
    async query(queryString: string) {
      this.isQueryExecuted = true
      const decodedQueryString = decodeURIComponent(queryString)
      this.resource = decodedQueryString
      let querySelect = '' as string
      let prefixString = '';
      if (decodedQueryString.includes("\"")) {
        querySelect = `SELECT distinct ?subj ?pred ?obj ?context
                        WHERE {
                            { ?subj ?pred ?obj .
                             FILTER NOT EXISTS { GRAPH ?context { ?subj ?pred ?obj } }
                            { VALUES ?obj { ${decodedQueryString} } ?subj ?pred ?obj }
                        }
                        UNION
                        {
                            GRAPH ?context {
                            values ?obj { ${decodedQueryString} }
                            ?subj ?pred ?obj
                        }}}`
      } else {
        const namespaces = this.getNamespaces
        for(let i = 0; i < namespaces.length; i++) {
          if (decodedQueryString.includes(namespaces[i].prefix.value + ':')) {
            prefixString = prefixString + `PREFIX ${namespaces[i].prefix.value}: <${namespaces[i].namespace.value}> `
          }
        }
        querySelect = `${prefixString}select distinct *
                                      where {
                                       { ?subj ?pred ?obj .
                                          FILTER NOT EXISTS { GRAPH ?context { ?subj ?pred ?obj } }
                                          {
                                            { VALUES ?subj { ${decodedQueryString} } ?subj ?pred ?obj }
                                            UNION
                                            { VALUES ?pred { ${decodedQueryString} } ?subj ?pred ?obj }
                                            UNION
                                            { VALUES ?obj { ${decodedQueryString} } ?subj ?pred ?obj }
                                          }
                                       }
                                       UNION
                                        {
                                           GRAPH ?context {
                                            { VALUES ?subj { ${decodedQueryString} } ?subj ?pred ?obj }
                                            UNION
                                            { VALUES ?pred { ${decodedQueryString} } ?subj ?pred ?obj }
                                            UNION
                                            { VALUES ?obj { ${decodedQueryString} } ?subj ?pred ?obj }
                                           }
                                        }
                                      }`
      }
      this.loading = true
      this.apiService.query(this.name, encodeURIComponent(querySelect), false, null).then(data => {
        const namespaces = this.getNamespaces
        this.helperUtils.prepareUnionQueryResults(data, namespaces).then(data => {
          this.tableData = data
        })
        this.loading = false
      })
      this.$forceUpdate()
    },
    async loadLazyData() {
      this.loading = true;
      await this.apiService.getRepositorySize(this.name).then(count => {
        this.setNumberOfStatements(parseInt(count))
        this.apiService.query(this.name, encodeURIComponent('select *\n' +
                'where {\n' +
                '  { ?subj ?pred ?obj .\n' +
                '    FILTER NOT EXISTS { GRAPH ?context { ?subj ?pred ?obj } }\n' +
                '  }\n' +
                '  UNION\n' +
                '  { GRAPH ?context { ?subj ?pred ?obj } }\n' +
                '}'),
            false,
            this.lazyParams).then(data => {
          const namespaces = this.getNamespaces
          this.helperUtils.prepareUnionQueryResults(data, namespaces).then(data => {
            this.totalRecords = this.getNumberOfStatements
            this.tableData = data
          })
          this.loading = false
          this.$forceUpdate()
        })
      })
    },
    onPage(event: any) {
      this.lazyParams = event;
      if (this.isQueryExecuted) {
        this.query(this.resource)
      } else {
        this.loadLazyData();
      }

    },
    enterPressed(queryString: string) {
      this.search(queryString)
    },
    search(queryString: string) {
      if (queryString === '') {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Resource is empty!', life: 3000})
        return
      }
      if (!this.helperUtils.isGoodResourceValue(queryString, this.getNamespaces)) {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Wrong value!', life: 3000})
        return
      }
      this.isQueryExecuted = true
      this.$router.push({name: 'ExplorePage', params: {name: this.name}, query:{resource: encodeURIComponent(queryString)}})
      this.resource = queryString
      this.query(queryString)
    },
    async downloadFile(isFormValid: any) {
      this.submitted = true
      if (!isFormValid) {
        return;
      }
      this.loadingDownload = true
      const dataFormat = this.helperUtils.findDataFormatFromExtension(this.selectedFormat.extension)
      await this.apiService.getStatementsForDownload(this.name, dataFormat).then(data => {
        const blob = new Blob([data], {type: dataFormat})
        const href = URL.createObjectURL(blob)
        const a = Object.assign(document.createElement("a"), {
          href,
          style: "display:none",
          download: `file${this.selectedFormat.extension}`
        })
        a.click()
        URL.revokeObjectURL(href)
        a.remove()
        this.loadingDownload = false
        this.submitted = false
        this.selectedFormat = ''
      })

    },
    truncate(text: string, length: number, suffix: string) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
    replaceChar(value: string) {
      return value.replace("<", "&lt;")
    },
    copyToClipboard(value: string) {
      navigator.clipboard.writeText(value).then(() => {
        this.$toast.add({
          severity: 'info',
          summary: 'Info Message',
          detail: 'Copied to clipboard',
          group: 'br',
          life: 3000
        });
      })
    }
  }
})
</script>

<style scoped>
.container {
  margin-top: 20px;
  padding: 30px 30px 30px 30px;
  display: flex;
  justify-content: space-around;
  width: 1600px;
  height: 100px;
  background-color: white;
  border-radius: 10px;
  flex-direction: row;
  gap: 50px;
}

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

:deep(.p-button) {
  background-color: white;
  border-color: white;
}

.p-button:enabled:hover {
  background-color: white;
  border-color: white;
}

.p-button:focus {
  box-shadow: 0 0 0 0.2rem white;
}

:deep(.p-dropdown:not(.p-disabled)) {
  border-color: black;
}

:deep(.pi) {
  color: black;
}

.press-button {
  background-color: #0A2341;
}

.press-button:enabled:hover {
  background-color: #6583A7;
}

.press-button:focus {
  box-shadow: 0 0 0 0.2rem #566F8C;
}

.copy-button {
  width: 20px;
  height: 20px;
  margin-left: 2px;
  position: absolute;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  border-width: 0 0 0 0;
}
:deep(.drop-down) {
  width: 170px;
}

@media only screen and (min-width: 700px) and (max-width: 1550px) {
  :deep(.p-datatable) {
    width: 1200px;
  }

  :deep([role=cell]) {
    width: 200px;
  }
}

@media only screen and (max-width: 1000px) {
  .copy-button {
    width: 20px;
    height: 20px;
    position: relative;
  }
  .container {
    margin-top: 20px;
    padding: 30px 30px 30px 30px;
    display: flex;
    justify-content: space-around;
    min-width: 300px;
    min-height: 400px;
    background-color: white;
    border-radius: 10px;
    flex-direction: column;
    gap: 20px;
  }
  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .main {
    padding: 5px 5px 5px 5px;
  }
}
</style>