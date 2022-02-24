<template>
  <RepositoriesList></RepositoriesList>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import RepositoriesList from "@/views/Repositories/RepositoriesList.vue";
export default defineComponent({
  name: "RepositoriesPage",
  components: {RepositoriesList}
})
</script>

<style scoped>
  .main {
    position: absolute;
    top: 100px;
    left: 200px;
    width: 90%;
    height: 90%;
    background-color: #DCD6D6;
  }
</style>