<template>
  <SideBar active-section="Update"></SideBar>
  <TopBar title="Update Repository" ></TopBar>

  <div class="main">
    <div>
      <Button label="EXECUTE UPDATE" @click="executeQuery"></Button>

      <Textarea rows="5" cols="30" class="editor" v-model="content" id="editor"></Textarea>
    </div>
    <div>

      <div>
        <h1>App data</h1>
        <div class="ciara"></div>
        <div class="filter">
          <span>Resource: </span>
          <InputText class="input" type="text" v-model="resource" />
        </div>
      </div>

      <div>
        <h1>Delete data</h1>
        <div class="ciara"></div>
        <div class="filter">
          <span>Resource: </span>
          <InputText class="input" type="text" v-model="resource" />
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
      editor: null as any,
    }
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(document.getElementById('editor') as HTMLTextAreaElement, {
      lineNumbers: true,
      mode: 'sparql',
    })
  },

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
  .ciara {
    width: 180px;
    margin: 0 10px 0 10px;
    border: 3px solid #DA5800;
    transform: matrix(1,0,0,1,0,0);
  }
  .filter {
    padding: 30px 30px 30px 30px;
    width: 750px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    margin: 30px 15px 0 15px;
  }
</style>