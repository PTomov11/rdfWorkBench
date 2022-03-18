<template>
  <Toast/>
  <MenuLayout title="Repositories" active-section="Repositories"></MenuLayout>

  <div class="main">
    <div class="item">
      <DataTable :value="repositories" data-key="id.value" :scrollable="true" scrollHeight="500px" :loading="loading">
        <Column field="id.value" header="Name" style="min-width:300px" :sortable="true"></Column>
        <Column field="title.value" header="Description" style="min-width:300px" :sortable="true"></Column>
        <Column field="uri.value" header="Location" style="min-width:700px" :sortable="true"></Column>
<!--          <template #body="slotProps">-->
<!--            <span v-if="slotProps.data.uri.value.length > 50" v-tooltip.right="{ value: slotProps.data.uri.value, class: 'tooltip' }">{{truncate(slotProps.data.uri.value, 50, '...')}}</span>-->
<!--          </template>-->
        <Column>
          <template #body="slotProps">
            <Button icon="pi pi-check" class="p-button-rounded" :disabled="selectedRepository === slotProps.data.id.value" @click="selectRepository(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="margin-left: 20px" @click="confirmDeleteRepository(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
      <div class="button-container">
        <Button class="create-button" label="CREATE NEW REPOSITORY" @click="openModal"></Button>
      </div>
    </div>

    <Dialog v-model:visible="deleteRepositoryDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="repositoryToDelete">Are you sure you want to delete <b>{{repositoryToDelete.id.value}}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRepositoryDialog = false"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRepository" />
      </template>
    </Dialog>

    <Dialog header="Create Repository" v-model:visible="displayModal" :style="{width: '700px'}" :modal="true">
      <div class="filter">
        <div class="input-container">
          <div style="width: 120px">
            <span>Type: </span>
          </div>
          <div>
            <Dropdown v-model="selectedStore" :options="stores" optionLabel="name" placeholder="Select a Store" />
          </div>
        </div>
        <div class="input-container">
          <div style="width: 120px">
            <span>ID: </span>
          </div>
          <div>
            <InputText class="input" type="text" v-model="id" />
          </div>
        </div>
        <div class="input-container">
          <div style="width: 120px">
            <span>Title: </span>
          </div>
          <div>
            <InputText class="input" type="text" v-model="title" />
          </div>
        </div>
        <div class="input-container">
          <div style="width: 120px">
            <span>Persist: </span>
          </div>
          <div>
            <ToggleButton v-model="persist" onIcon="pi pi-check" offIcon="pi pi-times" />
          </div>
        </div>
        <div class="input-container">
          <div style="width: 120px">
            <span>Sync Delay: </span>
          </div>
          <div>
            <InputText class="input" type="text" v-model.number="delay" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Save" icon="pi pi-check" @click="createRepository" autofocus />
      </template>
    </Dialog>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import APIService from "@/services/APIService.ts";
import {Repository, SelectedItem} from "@/views/Repositories/types/RepositoriesTypes";
import MenuLayout from "@/components/global-components/MenuLayout.vue";

export default defineComponent({
  name: "RepositoriesPage",
  components: {MenuLayout},
  data() {
    return {
      selectedStore: {} as SelectedItem,
      id: '',
      title: '',
      persist: false,
      delay: 0,
      stores: [
        {name: 'Memory Store'},
        {name: 'Native Store'}
      ],
      repositories: [] as Repository[],
      repositoryToDelete: {} as Repository,
      deleteRepositoryDialog: false,
      apiService: null as unknown as APIService,
      displayModal: false,
      loading: false
    }
  },
  created() {
    this.apiService = new APIService();
  },
  mounted() {
    this.loading = true;
    this.apiService.getListOfRepositories().then((data: Repository[]) => {
      this.repositories = data
      this.loading = false
    })
  },
  computed: {
    selectedRepository() {
      return this.$store.state.selectedRepository.id.value
    }
  },

  methods: {
    confirmDeleteRepository(repository: any) {
      this.repositoryToDelete = repository
      this.deleteRepositoryDialog = true
    },
    deleteRepository() {
      this.apiService.deleteRepository(this.repositoryToDelete.id.value)
      this.repositories = this.repositories.filter(val => val.id.value !== this.repositoryToDelete.id.value)
      this.repositoryToDelete = {} as Repository
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Repository Deleted', life: 3000})
      this.deleteRepositoryDialog = false
    },
    selectRepository(repository: Repository) {
      this.$store.dispatch('changeSelectedRepository', repository)
      this.$toast.add({severity: 'info', summary: 'Repository Selected', detail: 'Name: ' + repository.id.value, life: 3000})
      this.$router.push({name: 'AboutRepositoryPage', params:{name:this.$store.state.selectedRepository.id.value}})
    },
    openModal() {
      this.displayModal = true
    },
    async createRepository() {
      this.displayModal = false
      await this.apiService.createRepository(this.id, this.title, this.persist, this.delay, this.selectedStore.name.replace(/\s+/g, ''))
      this.apiService.getListOfRepositories().then((data: Repository[]) => {
        this.repositories = data
        this.loading = false
      })
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Repository Created', life: 3000})
    }
  }

})
</script>

<style scoped>
  .main {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    top: 100px;
    left: 200px;
    width: 89%;
    height: 89%;
    background-color: #DCD6D6;
  }
  .create-button {
    height: 50px;
    width: 1450px;
    background: #6583A7;
  }

  .create-button:hover {
    background-color: #01112C;
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    background-color: #C4C4C4;
  }
  .filter {
    padding: 30px 30px 30px 30px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .input-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }
</style>