<template>
  <Toast/>
  <MenuLayout title="Query Repository" active-section="Query"></MenuLayout>

  <div class="main">

    <div v-if="!executed" class="filter">
      <div class="sub-filter1">
        <Button label="SAVED QUERIES" @click="openSavedQueries"></Button>
      </div>
      <div class="sub-filter2">
        <Button label="EXECUTE" @click="execute"></Button>
        <Button label="CLEAR" @click="clearEditor"></Button>
        <Button label="SAVE QUERY" @click="saveQuery"></Button>
        <InputText class="input" type="text" v-model="queryName"/>
      </div>
    </div>

    <div v-if="!executed">
      <Textarea class="editor" id="editor"></Textarea>
    </div>


    <div v-if="executed" style="display:flex;justify-content: space-between">
      <div class="query-header"><span>Query Result</span></div>

      <Button label="BACK TO QUERY" @click="rerender"></Button>

    </div>

    <DataTable v-if="executed" :value="queryResults" :paginator="true" :alwaysShowPaginator="false" :rows="9"
               :loading="loading"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
      <Column v-for="(col,index) of columns" :header="col.header" :key="col.field">
        <template #body="slotProps">
          <span v-if="slotProps.data[index].length > 30"
                v-tooltip.right="{ value: slotProps.data[index] }">{{ truncate(slotProps.data[index], 30, '...') }}</span>
          <span v-else>{{ slotProps.data[index] }}</span>
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

  <Dialog header="Saved Queries" v-model:visible="displayModal" :modal="true">
    <div class="card">
      <DataTable :value="savedQueries" :scrollable="true" scrollHeight="400px">
        <Column field="name" header="Name" style="min-width: 450px" sortable="true"></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-check" class="p-button-rounded" @click="selectQuery(slotProps.data)"/>
            <Button icon="pi pi-user-edit" class="p-button-rounded" style="margin-left: 20px;"
                    @click="editQuery(slotProps.data)"/>
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="margin-left: 20px;"
                    @click="confirmDeleteQuery(slotProps.data)"/>
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>


  <Dialog v-model:visible="deleteSavedQueryDialog" header="Confirm" :modal="true">
    <div style="display: flex;align-items: center;padding-top: 25px">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 5rem;color: red"/>
      <span v-if="query"
            style="font-size: 20px;font-weight: lighter">Are you sure you want to delete <b>{{ query.name }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="deleteSavedQueryDialog = false"/>
      <Button label="Yes" icon="pi pi-check" @click="deleteQuery"/>
    </template>
  </Dialog>


</template>

<script lang="ts">
import {toRaw} from 'vue'
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import {Column, SavedQuery} from "@/views/Explore/types/ExploreTypes";
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/sparql/sparql'
import {defineComponent} from "vue";
import APIService from "@/services/APIService";
import helperUtils from "@/services/helperUtils";
import MenuLayout from "@/components/global-components/MenuLayout.vue";

export default defineComponent({
  name: "Query",
  components: {MenuLayout},
  data() {
    return {
      queryResults: [] as any,
      columns: [] as Column[],
      content: '',
      queryName: '' as string,
      editor: null as any,
      displayModal: false,
      savedQueries: [] as SavedQuery[],
      deleteSavedQueryDialog: false,
      query: {} as SavedQuery,
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
      loading: false,
      executed: false
    }
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    var textArea = document.getElementById('editor')
    if (textArea !== null) {
      this.editor = CodeMirror.fromTextArea(textArea as HTMLTextAreaElement, {
        lineNumbers: true,
        mode: 'sparql',
        value: textArea.innerHTML
      });
    }

    if (localStorage.getItem('savedQueries')) {
      const savedQueries = localStorage.getItem('savedQueries')
      try {
        if (savedQueries !== null) {
          this.savedQueries = JSON.parse(savedQueries)
        }
      } catch (e) {
        localStorage.removeItem('savedQueries');
      }
    }

    this.editor.on("change", (cm: any, change: any) => {
      var before = cm.getRange({line: 0, ch: 0}, change.from);
      var after = cm.getRange(change.to, {line: cm.lineCount() + 1, ch: 0});
      this.content = before + after
    })
  },
  methods: {
    openSavedQueries() {
      this.displayModal = true
    },
    clearEditor() {
      toRaw(this.editor).setValue('')
    },
    saveQuery() {
      var query = {
        name: this.queryName,
        value: this.content
      } as SavedQuery
      this.savedQueries.push(query)
      this.queryName = ''
      toRaw(this.editor).setValue('')
      this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Query Saved', life: 3000})
      this.saveQueriesToBrowser()
    },
    confirmDeleteQuery(query: SavedQuery) {
      this.query = query
      this.deleteSavedQueryDialog = true
    },
    deleteQuery() {
      this.savedQueries = this.savedQueries.filter(val => val.name !== this.query.name)
      this.deleteSavedQueryDialog = false
      this.saveQueriesToBrowser()
    },
    selectQuery(query: SavedQuery) {
      this.displayModal = false;
      toRaw(this.editor).setValue(query.value)
    },
    execute() {
      this.loading = true
      this.executed = true
      this.editor = null
      this.apiService.query(this.$store.state.selectedRepository.id.value, encodeURIComponent(this.content)).then(data => {
        console.log(data)
        const namespaces = this.$store.state.namespaces
        //Prepare colums
        this.columns = this.helperUtils.prepareColumnsOfQuery(data)
        //Prepare data
        this.queryResults = this.helperUtils.prepareResultsOfQuery(data, this.columns, namespaces)
        this.loading = false
      })
    },
    rerender() {
      this.$forceUpdate()
    },
    truncate(text: string, length: number, suffix: any) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
    saveQueriesToBrowser() {
      const parsed = JSON.stringify(this.savedQueries)
      localStorage.setItem('savedQueries', parsed)
    }
  }
})
</script>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  position: absolute;
  gap: 10px;
  top: 100px;
  left: 200px;
  width: 89%;
  height: 89%;
  background-color: #DCD6D6;
  padding: 20px 20px 20px 20px;
}

.filter {
  height: 100px;
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 10px;
}

.sub-filter1 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.sub-filter2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-grow: 3;
}

:deep(.CodeMirror) {
  height: 650px;
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
}

.query-header {
  font-size: 60px;
  font-weight: bolder;
  height: 100px;
  display: flex;
  align-items: center;
}

:deep(.p-datatable) {
  max-width: 100%;
}

:deep([role=cell]) {
  width: 250px;
}
</style>