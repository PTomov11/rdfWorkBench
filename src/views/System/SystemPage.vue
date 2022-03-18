<template>
  <MenuLayout title="System Information" active-section="System"></MenuLayout>

  <div class="main">
    <div class="container">

      <div class="header">
        <span>Change RDF4J Server</span>
      </div>
      <div class="sub-container">
        <div class="sub-sub-container">
          <div class="sub-header">
            <span>RDF4J Server URL</span>
          </div>
          <div>
            <InputText class="input" type="text" v-model="serverUrl" />
          </div>
          <div>
            <Button label="CHANGE" @click="isJava"></Button>
          </div>
        </div>
        <div class="sub-sub-container">
          <div class="sub-header">
            <span>Runtime Information</span>
          </div>
          <div class="sub-sub-header">
            <span>Operating system</span>
          </div>
          <div>
            <div class="text-background">
              <span>{{this.operatingSystem}}</span>
            </div>
          </div>
          <div class="sub-sub-header">
            <span>Java Runtime</span>
          </div>
          <div>
            <div class="text-background">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<script lang="ts">
import {defineComponent} from "vue";
import MenuLayout from "@/components/global-components/MenuLayout.vue";


export default defineComponent({
  name: "SystemPage",
  components: {MenuLayout},
  data() {
    return {
      serverUrl: '' as string,
      operatingSystem: window.navigator.platform as string
    }
  },
  methods: {
    // changeServer() {
    //
    // }
  }
})
</script>

<style scoped>
  .main {
    padding: 30px 30px 30px 30px;
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
  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .sub-container {
    position: relative;
    padding: 30px 30px 30px 30px;
    height: 250px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
  .header {
    font-size: 40px;
    font-weight: bold;
  }
  .sub-header {
    font-size: 30px;
    font-weight: bold;
  }
  .sub-sub-header {
    font-size: 25px;
  }
  .sub-sub-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 10px;
  }
  .text-background {
    display: inline-block;
    background-color: #DCD6D6;
    border-radius: 2px;
    font-size: 20px;
  }
</style>