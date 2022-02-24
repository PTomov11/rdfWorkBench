<template>
  <Toast/>
  <SideBar active-section="Repositories"></SideBar>
  <TopBar title="Repositories" :repositoryName="selectedRepository"></TopBar>

  <div class="main">
    <div class="item">
      <div class="card">
        <DataTable :value="repositories" responsiveLayout="scroll">
          <Column field="id.value" header="Name" :sortable="true"></Column>
          <Column field="title.value" header="Description" :sortable="true"></Column>
          <Column field="uri.value" header="Location" :sortable="true"></Column>
          <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2" @click="selectRepository(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteRepository(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog v-model:visible="deleteRepositoryDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="repository">Are you sure you want to delete <b>{{repository.id.value}}</b>?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRepositoryDialog = false"/>
          <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRepository" />
        </template>
      </Dialog>

      <Button class="button" label="CREATE NEW REPOSITORY" @click="openModal"></Button>


      <Dialog header="Create Repository" v-model:visible="displayModal" :style="{width: '700px'}" :modal="true">
        <span>Type: </span>
        <Dropdown v-model="selectedStore" :options="stores" optionLabel="name" placeholder="Select a Store" />
        <span>ID: </span>
        <InputText class="input" type="text" v-model="id" />
        <span>Title: </span>
        <InputText class="input" type="text" v-model="title" />
        <span>Persist: </span>
        <ToggleButton v-model="persist" onIcon="pi pi-check" offIcon="pi pi-times" />
        <span>Sync Delay: </span>
        <InputText class="input" type="text" v-model.number="delay" />
        <template #footer>
          <Button label="Save" icon="pi pi-check" @click="createRepository" autofocus />
        </template>
      </Dialog>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import APIService from "@/services/APIService.ts";
import SideBar from "@/components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";

export default defineComponent({
  name: "RepositoriesList",
  components: {TopBar, SideBar},
  data() {
    return {
      selectedStore: '',
      selectedRepository: '',
      id: '',
      title: '',
      persist: false,
      delay: 0,
      stores: [
        {name: 'Memory Store'},
        {name: 'Native Store'}
      ],
      repositories: [] as Repository[],
      repository: {} as Repository,
      deleteRepositoryDialog: false,
      apiService: null as unknown as APIService,
      displayModal: false,
    }
  },
  created() {
    this.apiService = new APIService();
    this.apiService.getListOfRepositories().then((data: Repository[]) => this.repositories = data);
  },
  methods: {
    confirmDeleteRepository(repository: any) {
      this.repository = repository;
      this.deleteRepositoryDialog = true;
    },
    deleteRepository() {
      this.repositories = this.repositories.filter(val => val.id.value !== this.repository.id.value);
      this.deleteRepositoryDialog = false;
      this.apiService.deleteRepository(this.repository.id.value)
      this.repository = {} as Repository;
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Repository Deleted', life: 3000});
    },
    selectRepository(repository: Repository) {
      this.selectedRepository = repository.id.value;
      this.$toast.add({severity: 'info', summary: 'Repository Selected', detail: 'Name: ' + this.selectedRepository, life: 3000});
    },
    openModal() {
      this.displayModal = true;
    },
    createRepository() {
      this.displayModal = false;
    }
  }
})
</script>

<style scoped>
  .main {
    display: flex;
    position: absolute;
    top: 100px;
    left: 201px;
    width: 89.5%;
    height: 89%;
    background-color: #DCD6D6;
  }
  .card {
    border-radius: 500px;
    width: 1000px;
    margin-top: 200px;
    margin-left: 300px;
    max-height: 600px;
  }
  .button {
    width: 1000px;
    margin-left: 300px;
    font-weight: bold;
    background-color: #01112C;
  }


</style>