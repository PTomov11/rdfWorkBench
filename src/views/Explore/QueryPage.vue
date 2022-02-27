<template>
  <SideBar active-section="Query"></SideBar>
  <TopBar title="Query Repository" ></TopBar>

  <div class="main">

    <div>
      <Button label="SAVED QUERIES" @click="openSavedQueries"></Button>
      <div>
        <Button label="EXECUTE" ></Button>
        <Button label="CLEAR" @click="clearEditor"></Button>
        <Button label="SAVE QUERY" @click="saveQuery"></Button>
        <InputText class="input" type="text" v-model="queryName" />
      </div>
    </div>

    <Textarea rows="5" cols="30" class="editor" id="editor"></Textarea>

    <Dialog header="Create Repository" v-model:visible="displayModal" :style="{width: '700px'}" :modal="true">
      <div class="card">
        <DataTable :value="savedQueries" responsiveLayout="scroll">
          <Column field="name" header="Name" :sortable="true"></Column>
          <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2" @click="selectQuery(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteQuery(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </Dialog>

  </div>

  <Dialog v-model:visible="deleteSavedQueryDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="query">Are you sure you want to delete <b>{{query.name}}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteSavedQueryDialog = false"/>
      <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteQuery" />
    </template>
  </Dialog>


</template>

<script lang="ts">
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import {SavedQuery} from "@/views/Explore/types/ExploreTypes";
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/sparql/sparql'
import {defineComponent} from "vue";
import TopBar from "@/components/global-components/TopBar.vue";
import SideBar from "@/components/global-components/SideBar.vue";

export default defineComponent({
  name: "Query",
  components: {SideBar, TopBar},
  data() {
    return {
      content: '',
      queryName: '' as string,
      editor: null as any,
      displayModal: false,
      savedQueries: [] as SavedQuery[],
      deleteSavedQueryDialog: false,
      query: {} as SavedQuery
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(document.getElementById('editor') as HTMLTextAreaElement, {
      lineNumbers: true,
      mode: 'sparql',
      value: ''
    });
    this.editor.on("change", (cm: any, change: any) => {
      var before = cm.getRange({ line: 0, ch: 0 }, change.from);
      var after = cm.getRange(change.to, { line: cm.lineCount() + 1, ch: 0 });
      this.content = before + after
    } )
  },
  methods: {
    openSavedQueries() {
      this.displayModal = true
    },
    clearEditor() {
      this.editor.setOption('value', ' ')
    },
    saveQuery() {
      var query = {
        name: this.queryName,
        value: this.content
      } as SavedQuery
      console.log(query)
      this.savedQueries.push(query)
    },
    confirmDeleteQuery(query: SavedQuery) {
      this.query = query
      this.deleteSavedQueryDialog = true
    },
    deleteQuery() {
      this.savedQueries = this.savedQueries.filter(val => val.name !== this.query.name)
      this.deleteSavedQueryDialog = false
    },
    // selectQuery(query: SavedQuery) {
    //
    // }
  }
})
</script>

<style scoped>
  .main {
    /*display: flex;*/
    /*justify-content: center;*/
    position: absolute;
    top: 100px;
    left: 201px;
    width: 89.5%;
    height: 89%;
    background-color: #DCD6D6;
  }
</style>