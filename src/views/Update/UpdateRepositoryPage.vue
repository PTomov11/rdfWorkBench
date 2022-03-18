<template>
  <Toast/>
  <MenuLayout title="Update Repository" active-section="Update"></MenuLayout>

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
                <Dropdown v-model="selectedFormat" :options="formats" optionLabel="name" placeholder="Select a format" optionValue="name" />
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>RDF Data URL: </span>
              </div>
              <div>
                <InputText v-on:input="changeUploadTab(1)" v-on:blur="prepareForm(null)" v-if="selectedUploadType === 'URL' || selectedUploadType === ''" class="input" type="text" v-model="url"/>
                <InputText v-on:input="changeUploadTab(1)" v-else class="input" type="text" v-model="url" disabled/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>RDF Data File: </span>
              </div>
              <div>
                <FileUpload v-if="selectedUploadType === 'file' || selectedUploadType === ''" mode="basic" name="demo[]" :maxFileSize="1000000" :customUpload="true" @uploader="onUpload" @select="prepareForm"/>
                <FileUpload v-else mode="basic" name="demo[]" :maxFileSize="1000000" :customUpload="true" @uploader="onUpload" @select="prepareForm" :disabled="true"/>
              </div>
              <div class="field-checkbox">
                <Checkbox v-model="useBaseURIAsContext" :binary="true"/>
                <label> use base URI as context identifier</label>
              </div>

            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>RDF Content: </span>
              </div>
              <div>
                <Textarea v-on:input="changeUploadTab(3)" v-if="selectedUploadType === 'Content' || selectedUploadType === ''" v-model="areaContent" :autoResize="true" rows="3" cols="30" />
                <Textarea v-on:input="changeUploadTab(3)" v-else v-model="areaContent" :autoResize="true" rows="3" cols="30" disabled />
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
                <InputText v-on:input="changeDeleteTab(1)" v-if="notEmptyDeleteInput === 'subject' || notEmptyDeleteInput === ''" class="input" type="text" v-model="subject"/>
                <InputText v-on:input="changeDeleteTab(1)" v-else class="input" type="text" v-model="subject" disabled/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Predicate: </span>
              </div>
              <div>
                <InputText v-on:input="changeDeleteTab(2)" v-if="notEmptyDeleteInput === 'predicate' || notEmptyDeleteInput === ''" class="input" type="text" v-model="predicate"/>
                <InputText v-on:input="changeDeleteTab(2)" v-else class="input" type="text" v-model="predicate" disabled/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Object: </span>
              </div>
              <div>
                <InputText v-on:input="changeDeleteTab(3)" v-if="notEmptyDeleteInput === 'object' || notEmptyDeleteInput === ''" class="input" type="text" v-model="object"/>
                <InputText v-on:input="changeDeleteTab(3)" v-else class="input" type="text" v-model="object" disabled/>
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
import * as CodeMirror from "codemirror";
import APIService from "@/services/APIService";
import helperUtils from "@/services/helperUtils";
import MenuLayout from "@/components/global-components/MenuLayout.vue";

export default defineComponent({
  name: "UpdateRepositoryPage",
  components: {MenuLayout},
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
      helperUtils: null as unknown as helperUtils,
      notEmptyDeleteInput: '' as string,
      selectedUploadType: '' as string,
      deleteAllStatementsDialog: false,
      useBaseURIAsContext: false,
      fileToUpload: null as unknown as File,
      fileType: '' as string
    }
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
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
    changeDeleteTab(event: number) {
      if (event === 1) {
        this.notEmptyDeleteInput = "subject"
        if (this.subject === '') {
          this.notEmptyDeleteInput = ''
        }
      } else if ( event === 2) {
        this.notEmptyDeleteInput = "predicate"
        if (this.predicate === '') {
          this.notEmptyDeleteInput = ''
        }
      } else {
        this.notEmptyDeleteInput = "object"
        if (this.object === '') {
          this.notEmptyDeleteInput = ''
        }
      }
    },
    changeUploadTab(event: number) {
      if (event === 1) {
        this.selectedUploadType = 'URL'
        if (this.url === '') {
          this.selectedUploadType = ''
        }
      } else if ( event === 3) {
        this.selectedUploadType = 'Content'
        if (this.areaContent === '') {
          this.selectedUploadType = ''
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
    prepareForm(event: any) {
      if (event === null) {
        this.baseUri = this.url
        if (this.url === '') {
          this.contextAdd = ''
          this.selectedFormat = ''
        } else {
          if (this.useBaseURIAsContext) {
            this.contextAdd = '<' + this.baseUri + '>'
          }
          this.selectedFormat = 'Turtle'
        }

      } else {
        const fakePath = 'file://C:/fakepath/' + event.files[0].name
        this.baseUri = fakePath
        if (this.useBaseURIAsContext) {
          this.contextAdd = '<' + this.baseUri + '>'
        }
        this.selectedUploadType = 'file'
        this.fileType = event.files[0].name.substr(event.files[0].name.indexOf('.'))
        this.fileToUpload = event.files[0]
      }

    },

    async onUpload(event: any) {
      console.log(event.files[0])
      if (this.contextAdd === '') {
        await this.apiService.updateRepositoryStatements(this.$store.state.selectedRepository.id.value, this.helperUtils.findDataFormat(this.fileType), this.fileToUpload, '', 'null')
      } else {
        await this.apiService.updateRepositoryStatements(this.$store.state.selectedRepository.id.value, this.helperUtils.findDataFormat(this.fileType), this.fileToUpload, '', encodeURIComponent(this.contextAdd))
      }
    },
    async upload() {
      // TODO: pridat checkbox ci pridat alebo nahradit data
      if (this.url !== '') {
        const content = await fetch(this.url).then((response) => response.text())
        if (this.contextAdd === '') {
          await this.apiService.updateRepositoryStatements(this.$store.state.selectedRepository.id.value, this.helperUtils.findDataFormat('.ttl') , null, content,  'null')
        } else {
          await this.apiService.updateRepositoryStatements(this.$store.state.selectedRepository.id.value, this.helperUtils.findDataFormat('.ttl') , null, content,  encodeURIComponent(this.contextAdd))
        }
      }
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
</style>