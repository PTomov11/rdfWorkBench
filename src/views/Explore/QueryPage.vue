<template>
  <Toast/>
  <MenuLayout title="Query Repository" active-section="Query"></MenuLayout>

  <div class="main">
    <div class="filter">
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
    <div>
      <Textarea class="editor" id="editor"></Textarea>
    </div>
  </div>

  <Dialog header="Saved Queries" v-model:visible="displayModal" :modal="true">
    <div class="card">
      <DataTable :value="savedQueries" :scrollable="true" scrollHeight="400px">
        <Column field="name" header="Name" style="min-width: 450px" sortable="true"></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-check" class="p-button-rounded" @click="selectQuery(slotProps.data)"/>
            <Button icon="pi pi-pencil" class="p-button-rounded" style="margin-left: 20px;"
                    @click="openEditQueryModal(slotProps.data)"/>
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="margin-left: 20px;"
                    @click="confirmDeleteQuery(slotProps.data)"/>
          </template>
        </Column>
      </DataTable>
    </div>
  </Dialog>

  <Dialog header="Edit Query" v-model:visible="editModal" :position="editQueryPosition">
    <div class="input-container" style="margin-top: 10px">
      <div style="font-weight: bolder">
        <span>Name: </span>
      </div>
      <div>
        <input-text class="input" v-model="editQueryName" style="width: 300px"/>
      </div>
    </div>
    <div class="input-container" style="margin-top: 10px">
      <div style="font-weight: bolder">
        <span>Value: </span>
      </div>
      <div>
        <Textarea v-model="editQueryValue" rows="5" cols="40"/>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="editModal = false"/>
      <Button label="Save" icon="pi pi-check" @click="saveEditedQuery" />
    </template>
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
import {mapActions, mapState} from "pinia";
import {useStore} from "@/store/store";

/*
    Author: Patrik Tomov
    Date: 7.5.2022
*/
export default defineComponent({
  name: "Query",
  components: {MenuLayout},
  data() {
    return {
      queryResults: [] as any,
      columns: [] as Column[],
      content: '' as string,
      queryName: '' as string,
      editor: null as any,
      displayModal: false as boolean,
      editModal: false as boolean,
      savedQueries: [] as SavedQuery[],
      deleteSavedQueryDialog: false,
      query: {} as SavedQuery,
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
      loading: false as boolean,
      editQueryPosition: 'right' as string,
      editQueryName: '' as string,
      editQueryValue: '' as string,
      oldQueryName: '' as string,
    }
  },
  computed: {
    ...mapState(useStore, ['selectedRepository']),
    ...mapState(useStore, ['getNamespaces'])
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    //load CodeMirror editor
    const textArea = document.getElementById('editor');
    if (textArea !== null) {
      this.editor = CodeMirror.fromTextArea(textArea as HTMLTextAreaElement, {
        lineNumbers: true,
        mode: 'sparql',
        value: textArea.innerHTML
      });
    }

    //check if there are some savedQueries in browser
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
    //function to track changes in editor
    this.editor.on("change", (cm: any, change: any) => {
      var before = cm.getRange({line: 0, ch: 0}, change.from);
      var after = cm.getRange(change.to, {line: cm.lineCount() + 1, ch: 0});
      this.content = before + after
    })
  },
  methods: {
    ...mapActions(useStore, ['setQueryResults']),
    ...mapActions(useStore, ['setColumns']),
    openSavedQueries() {
      this.displayModal = true
    },
    clearEditor() {
      toRaw(this.editor).setValue('')
    },
    saveQuery() {
      if (this.queryName === '') {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Missing query name!', life: 3000})
        return
      }
      const query = {
        name: this.queryName,
        value: this.content
      } as SavedQuery;
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
      if (this.content.toLowerCase().includes("insert") || this.content.toLowerCase().includes("delete")) {
        this.$toast.add({severity: 'warn', summary: 'Warning', detail: 'For Update query visit Update page', life: 3000})
        return
      }
      if (!this.content.length) {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Query is empty!', life: 3000})
        return
      }
      var isAskQuery = false
      this.loading = true
      if (this.content.toLowerCase().includes("ask")) {
        isAskQuery = true
      }
      if (isAskQuery) {
        this.$router.push({name: 'QueryResultPage', params: {name: this.selectedRepository.id.value, isAskQuery: isAskQuery ? 'true' : 'false'},
          query:{resource: encodeURIComponent(this.content)}})
      } else {
        this.$router.push({name: 'QueryResultPage', params: {name: this.selectedRepository.id.value, isAskQuery: isAskQuery ? 'true' : 'false'},
          query:{resource: encodeURIComponent(this.content)}})
      }
    },
    saveQueriesToBrowser() {
      const parsed = JSON.stringify(this.savedQueries)
      localStorage.setItem('savedQueries', parsed)
    },
    openEditQueryModal(query: SavedQuery) {
      this.editModal = true
      this.oldQueryName = query.name
      this.editQueryName = query.name
      this.editQueryValue = query.value
    },
    saveEditedQuery() {
      var editedQuery = {
        name: this.editQueryName,
        value: this.editQueryValue
      } as SavedQuery
      const queriesWithoutEditedOne = this.savedQueries.filter(query => query.name !== this.oldQueryName)
      if (queriesWithoutEditedOne.some(query => query.name === editedQuery.name)) {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Query with this name already exists!', life: 3000})
        return
      }
      this.savedQueries = this.savedQueries.filter(query => query.name !== this.oldQueryName)
      this.savedQueries.push(editedQuery)
      this.saveQueriesToBrowser()
      this.editModal = false
      this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Query Saved', life: 3000})
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

.filter {
  margin-top: 20px;
  height: 100px;
  display: flex;
  width: 1600px;
  justify-content: center;
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

.input-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

@media only screen and (max-width: 1000px) {
  :deep(.CodeMirror) {
    height: 400px;
    width: 500px;
  }
  .filter {
    height: 300px;
    flex-direction: column;
  }
  .sub-filter2 {
    flex-direction: column;
  }
  :deep(.p-dialog) {
    width: 500px;
  }
}

</style>