<template>
  <Toast/>
  <SideBar active-section="Update"></SideBar>
  <TopBar title="Update Repository" ></TopBar>

  <div class="main">
    <div class="buttons-content">
      <Button label="EXECUTE UPDATE" @click="executeQuery"></Button>
    </div>

    <div style="margin-bottom: 20px">
      <div style="display:flex;justify-content: center">
        <Textarea rows="5" cols="30" class="editor" v-model="content" id="editor"></Textarea>
      </div>
    </div>

    <div class="modifie-contents">

      <div class="modifie-content">
        <div>
          <h1>Add data</h1>
          <div class="ciara"></div>
        </div>
        <div>
          <div class="filter">
            <Button label="UPLOAD" class="upload-button" @click="upload"></Button>
            <div class="input-container">
              <div style="width: 120px">
                <span>Base URI: </span>
              </div>
              <div>
                <InputText class="input" type="text" v-model="baseUri"/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Context: </span>
              </div>
              <div>
                <InputText class="input" type="text" v-model="contextAdd"/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Data format: </span>
              </div>
              <div>
                <Dropdown v-model="selectedFormat" :options="formats" optionLabel="name" placeholder="Select a format" />
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>RDF Data URL: </span>
              </div>
              <div>
                <InputText class="input" type="text" v-model="url"/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>RDF Data File: </span>
              </div>
              <div>
                <FileUpload mode="basic" name="demo[]" url="./upload.php" accept="image/*" :maxFileSize="1000000" @upload="onUpload" />
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>RDF Content: </span>
              </div>
              <div>
                <Textarea v-model="areaContent" :autoResize="true" rows="3" cols="30" />
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="modifie-content">
        <div>
          <h1>Delete data</h1>
          <div class="ciara" style="width: 250px"></div>
        </div>
        <div>
          <div class="filter">
            <Button label="REMOVE" class="remove-button" @click="remove"></Button>
            <div class="input-container">
              <div style="width: 120px">
                <span>Subject: </span>
              </div>
              <div>
                <InputText v-on:input="change(1)" v-if="notEmptyInput === 'subject' || notEmptyInput === ''" class="input" type="text" v-model="subject"/>
                <InputText v-on:input="change(1)" v-else class="input" type="text" v-model="subject" disabled/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Predicate: </span>
              </div>
              <div>
                <InputText v-on:input="change(2)" v-if="notEmptyInput === 'predicate' || notEmptyInput === ''" class="input" type="text" v-model="predicate"/>
                <InputText v-on:input="change(2)" v-else class="input" type="text" v-model="predicate" disabled/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Object: </span>
              </div>
              <div>
                <InputText v-on:input="change(3)" v-if="notEmptyInput === 'object' || notEmptyInput === ''" class="input" type="text" v-model="object"/>
                <InputText v-on:input="change(3)" v-else class="input" type="text" v-model="object" disabled/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Context: </span>
              </div>
              <div>
                <InputText class="input" type="text" v-model="contextDelete"/>
              </div>
            </div>
            <Button label="REMOVE ALL" class="remove-all-button" @click="removeAllDialog"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="deleteAllStatementsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Are you sure you want to delete <b>whole</b> repository?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAllStatementsDialog = false"/>
      <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="removeAll" />
    </template>
  </Dialog>

</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "../../components/global-components/TopBar.vue";
import * as CodeMirror from "codemirror";
import APIService from "@/services/APIService";

export default defineComponent({
  name: "UpdateRepositoryPage",
  components: {SideBar, TopBar},
  data() {
    return {
      content: '',
      baseUri: '',
      selectedFormat: '',
      contextAdd: '',
      url: '',
      areaContent: '',
      formats: [
        {name: 'Turtle'},
        {name: 'RDF/JSON'},
        {name: 'TriG'},
      ],
      subject: '',
      predicate: '',
      object: '',
      contextDelete: '',
      editor: null as any,
      apiService: null as unknown as APIService,
      notEmptyInput: '' as string,
      deleteAllStatementsDialog: false
    }
  },
  created() {
    this.apiService = new APIService()
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(document.getElementById('editor') as HTMLTextAreaElement, {
      lineNumbers: true,
      mode: 'sparql',
    })
  },
  methods: {
    executeQuery() {
      this.editor.setValue(" skuska")
    },
    async removeAll() {
      await this.apiService.deleteAllStatements(this.$store.state.selectedRepository.id.value)
      this.deleteAllStatementsDialog = false
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'All Statements Deleted', life: 3000})
    },
    change(event: number) {
      if (event === 1) {
        this.notEmptyInput = "subject"
        if (this.subject === '') {
          this.notEmptyInput = ''
        }
      } else if ( event === 2) {
        this.notEmptyInput = "predicate"
        if (this.predicate === '') {
          this.notEmptyInput = ''
        }
      } else {
        this.notEmptyInput = "object"
        if (this.object === '') {
          this.notEmptyInput = ''
        }
      }
    },
    removeAllDialog() {
      this.deleteAllStatementsDialog = true
    },
    remove() {
      if (this.subject !== '') {
        this.apiService.deleteSpecifiedStatements(this.$store.state.selectedRepository.id.value, "subj", encodeURIComponent(this.subject))
        this.subject = ''
      } else if (this.predicate !== '') {
        this.apiService.deleteSpecifiedStatements(this.$store.state.selectedRepository.id.value, "pred", encodeURIComponent(this.predicate))
        this.predicate = ''
      } else {
        this.apiService.deleteSpecifiedStatements(this.$store.state.selectedRepository.id.value, "obj", encodeURIComponent(this.object))
        this.object = ''
      }
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Statements Deleted', life: 3000})

    },
    onUpload() {
      console.log("Tui")
    },
    upload() {
      console.log(this.notEmptyInput)
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
    top: 100px;
    left: 200px;
    width: 89%;
    min-height: 89%;
    background-color: #DCD6D6;
  }
  .ciara {
    width: 200px;
    border: 3px solid #DA5800;
    transform: matrix(1,0,0,1,0,0);
    margin-top: 5px;
  }
  .filter {
    position: relative;
    padding: 30px 30px 30px 30px;
    width: 750px;
    height: 320px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  :deep(.CodeMirror) {
    height: 300px;
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
  }
  .buttons-content {
    display: flex;
    align-items: center;
    padding-left: 20px;
    height: 80px;
  }
  .modifie-contents {
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 70px;
  }
  h1 {
    margin: 0;
    font-size: 40px;
  }
  .modifie-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .input-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .upload-button {
    position: absolute;
    top: 30px;
    right: 30px;
  }
  .remove-button {
    position: absolute;
    top: 30px;
    right: 30px;
  }
  .remove-all-button {
    position: absolute;
    bottom: 30px;
    left: 30px;
  }
  .input {
    width: 400px;
  }
</style>