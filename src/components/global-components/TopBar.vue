<template>
  <div class="top-bar" style="margin-left: 200px">
    <div class="container">

      <div class="item">
        <p class="title">{{ title }}</p>
      </div>
      <div class="item">
        <div>
          <span class="info">RDF4J Server: {{ rdfServerChanged }} </span>
        </div>
        <div>
          <span class="info">Repository: {{ repositoryChanged }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapActions, mapState} from "pinia";
import {useStore} from "@/store/store";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";


export default defineComponent({
  name: "TopBar",
  props: ['title'],
  data() {
    return {
      repository: {id: {type: "", value: ""}} as Repository,
      rdfUrl: '' as string
    }
  },
  mounted() {
    this.repository = this.selectedRepository
    this.rdfUrl = this.rdfServerUrl
  },
  computed: {
    ...mapState(useStore, ['selectedRepository']),
    ...mapState(useStore, ['rdfServerUrl']),
    repositoryChanged() {
      return this.repository.id.value
    },
    rdfServerChanged() {
      return this.rdfServerUrl
    }
  }
})
</script>

<style scoped>
  .top-bar {
    height: 100px; /* Full-height: remove this if you want "auto" height */
    width: 100%;
   /* Set the width of the sidebar */
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    background-color: #0A2341; /* Black */
    /*overflow-x: hidden; !* Disable horizontal scroll *!*/

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
    font-weight: bold;
  }
  .info {
    font-size: 25px;
    color: white;
  }
</style>