<template>
  <img class="background" :src="image" alt="background"/>

  <div class="introduction">
    <h1>RDF</h1>
    <span> This OPEN-SOURCE application is developed for RDF storage traversal and working with RDF data.</span>
    <Button class="p-button-lg" style="margin-top: 10px" label="Get Started" icon="pi pi-arrow-right" iconPos="right" @click="start" />
  </div>


  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "HomePage",
  data() {
    return {
      image: require('../assets/background.png')
    }
  },
  methods: {
    start() {
      this.$router.push({name: 'RepositoriesPage', params: {name: ""}})
    }
  }
})
</script>

<style scoped>
  .background {
    /* Set rules to fill background */
    min-height: 100%;
    min-width: 1024px;

    /* Set up proportionate scaling */
    width: 100%;
    height: auto;

    /* Set up positioning */
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .introduction {
    position: absolute;
    font-weight: bolder;
    font-size: 30px;
    top: 200px;
    right: 250px;
    color: white;
    width: 450px;
  }
</style>