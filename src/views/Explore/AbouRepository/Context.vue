<template>
  <AboutRepositoryPage></AboutRepositoryPage>

  <DataTable :rows="10" class="table" :value="contexts" stripedRows responsiveLayout="scroll">
    <Column field="contextID.value" header="Name"></Column>
  </DataTable>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";
import APIService from "@/services/APIService";
import {Context} from "@/views/Explore/types/ExploreTypes";

export default defineComponent({
  name: "Context",
  components: {AboutRepositoryPage},
  data() {
    return {
      contexts: [] as Context[],
      apiService: null as unknown as APIService,
    }
  },
  mounted() {
    this.apiService = new APIService()
    this.apiService.getContextsOfRepository(this.$store.state.selectedRepository).then((data: Context[]) => this.contexts = data)
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