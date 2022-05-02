<template>
  <Toast/>
  <MenuLayout title="System Information" active-section="System"></MenuLayout>

  <div class="main">
    <div class="container">
      <div class="header">
        <span>Change RDF4J Server</span>
      </div>
      <div class="sub-container">
        <div class="sub-header">
          <span>RDF4J Server URL</span>
        </div>
        <div>
          <InputText class="input" type="text" v-model="serverUrl" />
        </div>
        <div>
          <Button label="CHANGE" @click="changeServer"></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import MenuLayout from "@/components/global-components/MenuLayout.vue";
import {mapActions} from "pinia";
import useStore from "@/store/store";


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
    ...mapActions(useStore, ['setRdfServerUrl']),
    changeServer() {
      if (this.serverUrl === '') {
        this.$toast.add({severity: 'error', summary: 'Error', detail: 'Empty server value!', life: 3000})
        return
      }
      this.setRdfServerUrl(this.serverUrl)
      this.serverUrl = ''
      //todo: presemrovanie na repositories, nastavit prazdny repozitar
    }
  }
})
</script>

<style scoped>
  .main {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 100px);
    overflow: auto;
    background-color: #DCD6D6;
    transition: 0.3s ease;
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .sub-container {
    border-radius: 10px;
    display: flex;
    width: 600px;
    height: 250px;
    flex-direction: column;
    gap: 5px;
    padding: 30px 30px 30px 30px;
    background-color: white;
  }
  .header {
    text-align: center;
    font-size: 40px;
    font-weight: bold;
  }
  .sub-header {
    font-size: 30px;
    font-weight: bold;
  }

  .text-background {
    display: inline-block;
    background-color: #DCD6D6;
    border-radius: 2px;
    font-size: 20px;
  }
</style>