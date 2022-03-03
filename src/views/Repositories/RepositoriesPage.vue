<template>
  <Toast/>
  <SideBar active-section="Repositories"></SideBar>
  <TopBar title="Repositories"></TopBar>

  <div class="main">
    <div class="item">
      <DataTable :value="repositories" :scrollable="true" scrollHeight="500px" :loading="loading">
        <Column field="id.value" header="Name" style="min-width:300px" :sortable="true"></Column>
        <Column field="title.value" header="Description" style="min-width:300px" :sortable="true"></Column>
        <Column header="Location" style="min-width:800px" :sortable="true">
          <template #body="slotProps">
            <span v-if="slotProps.data.uri.value.length > 50" v-tooltip.right="{ value: slotProps.data.uri.value, class: 'tooltip' }">{{truncate(slotProps.data.uri.value, 50, '...')}}</span>
          </template>
        </Column>
        <Column>
          <template #body="slotProps">
            <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2" :disabled="selectedRepository === slotProps.data.id.value" @click="selectRepository(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteRepository(slotProps.data)" />
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
        <span v-if="repository">Are you sure you want to delete <b>{{repository.id.value}}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRepositoryDialog = false"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteRepository" />
      </template>
    </Dialog>

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
    <router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import APIService from "@/services/APIService.ts";
import SideBar from "@/components/global-components/SideBar.vue";
import TopBar from "@/components/global-components/TopBar.vue";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";
export default defineComponent({
  name: "RepositoriesPage",
  components: {TopBar, SideBar},
  data() {
    return {
      selectedStore: '',
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
      return this.$store.state.selectedRepository
    }
  },

  methods: {
    confirmDeleteRepository(repository: any) {
      this.repository = repository
      this.deleteRepositoryDialog = true
    },
    deleteRepository() {
      this.apiService.deleteRepository(this.repository.id.value)
      this.repository = {} as Repository
      this.$toast.add({severity:'success', summary: 'Successful', detail: 'Repository Deleted', life: 3000})
    },
    selectRepository(repository: Repository) {
      this.$store.dispatch('changeSelectedRepository', repository.id.value)
      this.selectedRepository = repository.id.value
      this.$toast.add({severity: 'info', summary: 'Repository Selected', detail: 'Name: ' + repository.id.value, life: 3000})
      this.$router.push({name: 'ExplorePage', params:{name:this.$store.state.selectedRepository}})
    },
    openModal() {
      this.displayModal = true
    },
    createRepository() {
      this.displayModal = false
    },
    truncate (text: string, length: number, suffix: any) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
  }

})
</script>

<style scoped>
  .main {
    display: flex;
    position: fixed;
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

</style>