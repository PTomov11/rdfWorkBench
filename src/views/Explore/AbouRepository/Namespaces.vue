<template>
  <AboutRepositoryPage></AboutRepositoryPage>

  <DataTable class="table" :value="namespaces" stripedRows responsiveLayout="scroll">
    <Column field="prefix.value" header="Prefix"></Column>
    <Column field="namespace.value" header="Namespace"></Column>
  </DataTable>

</template>

<script lang="ts">
import {defineComponent} from "vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";
import APIService from "@/services/APIService";
import {Context, Namespace} from "@/views/Explore/types/ExploreTypes";

export default defineComponent({
  name: "Namespaces",
  components: {AboutRepositoryPage},
  data() {
    return {
      namespaces: [] as Namespace[],
      apiService: null as unknown as APIService,
    }
  },
  mounted() {
    this.apiService = new APIService()
    this.apiService.getNamespacesOfRepository(this.$store.state.selectedRepository).then((data: Namespace[]) => this.namespaces = data)
  }
})
</script>

<style scoped>
  .table {
    margin-top: 100px;
    width: 100%;
    margin-left: 200px;
  }
</style>