<template>
  <div class="top-bar" :style="{ 'left': this.getSideBarWidth }">
    <div class="container">

      <div class="item">
        <p class="title">{{ title }}</p>
      </div>
      <div class="item">
        <div>
          <span class="info rdf-server">RDF4J Server: {{ rdfServerUrl }} </span>
        </div>
        <div>
          <span class="info repository-title">Repository: {{ selectedRepository.id.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapState} from "pinia";
import {useStore} from "@/store/store";


export default defineComponent({
  name: "TopBar",
  props: ['title'],
  computed: {
    ...mapState(useStore, ['selectedRepository']),
    ...mapState(useStore, ['rdfServerUrl']),
    ...mapState(useStore, ['getSideBarWidth']),
  }
})
</script>

<style scoped>
  .top-bar {
    height: 100px;
    width: 100%;
    position: sticky;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #0A2341;
    transition: 0.3s ease;
  }
  .container {
    height: 100px;
    display: flex;
    align-items: center;
  }
  .item{
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 15px;
  }
  .title {
    margin: 0 0 0 20px;
    font-size: 50px;
    color: white;
    font-weight: bolder;
  }
  .info {
    font-weight: bolder;
    font-size: 25px;
    color: white;
  }
</style>