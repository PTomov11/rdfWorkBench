<template>
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
                <InputText class="input" type="text" v-model="subject"/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Predicate: </span>
              </div>
              <div>
                <InputText class="input" type="text" v-model="predicate"/>
              </div>
            </div>
            <div class="input-container">
              <div style="width: 120px">
                <span>Object: </span>
              </div>
              <div>
                <InputText class="input" type="text" v-model="object"/>
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
            <Button label="REMOVE ALL" class="remove-all-button" @click="removeAll"></Button>
          </div>
        </div>
      </div>


    </div>

  </div>

</template>

<script lang="ts">
import {defineComponent} from "vue";
import SideBar  from "../../components/global-components/SideBar.vue";
import TopBar from "../../components/global-components/TopBar.vue";
import * as CodeMirror from "codemirror";

export default defineComponent({
  name: "UpdateRepositoryPage",
  components: {SideBar, TopBar},data() {
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

    }
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