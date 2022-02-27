<template>
  <AboutRepositoryPage></AboutRepositoryPage>

  <DataTable class="table" :value="types" stripedRows responsiveLayout="scroll">
    <Column field="type.value" header="Name"></Column>
  </DataTable>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";
import APIService from "@/services/APIService";
import {Type} from "@/views/Explore/types/ExploreTypes";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";

export default defineComponent({
  name: "Types",
  components: {AboutRepositoryPage},
  data() {
    return {
      types: [] as Type[],
      apiService: null as unknown as APIService,
    }
  },
  mounted() {
    this.apiService = new APIService()
    this.apiService.getTypesOfRepository(this.$store.state.selectedRepository).then((data: Type[]) => this.types = data)
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