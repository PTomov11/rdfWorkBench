<template>
  <AboutRepositoryPage></AboutRepositoryPage>
  <div class="card">
    <h5>Frozen Columns</h5>
    <ToggleButton v-model="balanceFrozen" onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Unfreeze Balance" offLabel="Freeze Balance" style="flex-grow:1; flex-basis: 12rem" />

    <DataTable :value="customers2" :scrollable="true" scrollHeight="400px" :loading="loading" scrollDirection="both" class="mt-3">
      <Column field="name" header="Name" style="flex-grow:1; flex-basis:160px" frozen></Column>
      <Column field="id" header="Id" style="flex-grow:1; flex-basis:100px"></Column>
      <Column field="name" header="Name" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="country.name" header="Country" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="date" header="Date" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="company" header="Company" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="status" header="Status" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="activity" header="Activity" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="representative.name" header="Representative" style="flex-grow:1; flex-basis:200px"></Column>
      <Column field="balance" header="Balance" style="flex-grow:1; flex-basis:120px" alignFrozen="right" :frozen="balanceFrozen">
        <template #body="{data}">
          <span class="font-bold">{{formatCurrency(data.balance)}}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AboutRepositoryPage from "@/views/Explore/AboutRepositoryPage.vue";

export default defineComponent({
  name: "Types",
  components: {AboutRepositoryPage}
})
</script>

<style scoped>

</style>