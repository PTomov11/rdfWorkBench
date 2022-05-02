<template>
  <Toast/>
  <MenuLayout title="Repositories" active-section="Repositories"></MenuLayout>

  <div class="content-wrapper">
    <div class="main" :style="{ 'left': this.getSideBarWidth }">
      <div class="item">
        <DataTable :value="repositories" data-key="id.value" :scrollable="true" scrollHeight="500px" :loading="loading">
          <Column field="id.value" header="Name" style="min-width:300px" :sortable="true"></Column>
          <Column field="title.value" header="Description" style="min-width:300px" :sortable="true"></Column>
          <Column field="uri.value" header="Location" style="min-width:700px" :sortable="true"></Column>
          <Column>
            <template #body="slotProps">
              <Button icon="pi pi-check" class="p-button-rounded"
                      :disabled="this.selectedRepository.id.value === slotProps.data.id.value"
                      @click="selectRepository(slotProps.data)"/>
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" style="margin-left: 20px"
                      @click="confirmDeleteRepository(slotProps.data)"/>
            </template>
          </Column>
        </DataTable>
        <div class="button-container">
          <Button class="create-button" label="CREATE NEW REPOSITORY" @click="openModal"></Button>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="deleteRepositoryDialog" header="Confirm" :modal="true">
    <div style="display: flex;align-items: center;padding-top: 25px">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 5rem;color: red"/>
      <span v-if="repositoryToDelete" style="font-size: 20px;font-weight: lighter">Are you sure you want to delete <b>{{ repositoryToDelete.id.value }}</b>?</span>
    </div>
    <template #footer>
      <Button label="No" icon="pi pi-times" @click="deleteRepositoryDialog = false"/>
      <Button label="Yes" icon="pi pi-check" @click="deleteRepository" />
    </template>
  </Dialog>

  <Dialog v-model:visible="displayModal" :style="{width: '700px'}" :modal="true">
    <template #header>
      <h3>Create Repository</h3>
    </template>
    <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid filter">
      <div class="input-container">
        <div style="width: 120px">
          <span>Type: </span>
        </div>
        <div class="p-float-label">
          <Dropdown id="memoryDropdown" v-model="v$.selectedStore.$model"
                    :class="{'p-invalid':v$.selectedStore.$invalid && submitted}" :options="stores" optionLabel="name"
                    placeholder="Select a Store"/>
        </div>
        <small v-if="(v$.selectedStore.$invalid && submitted) || v$.selectedStore.$pending.$response" class="p-error">
          {{ v$.selectedStore.required.$message.replace('Value', 'Type') }}</small>
      </div>
      <div class="input-container">
        <div style="width: 120px">
          <span>Name: </span>
        </div>
        <div class="p-float-label">
          <InputText id="repositoryName" v-model="v$.repositoryName.$model"
                     :class="{'p-invalid':v$.repositoryName.$invalid && submitted}" class="input"/>
        </div>
        <small v-if="(v$.repositoryName.$invalid && submitted) || v$.repositoryName.$pending.$response"
               class="p-error">{{ v$.repositoryName.required.$message.replace('Value', 'Name') }}</small>
      </div>
      <div class="input-container">
        <div style="width: 120px">
          <span>Title: </span>
        </div>
        <div class="p-float-label">
          <InputText id="title" v-model="v$.title.$model" :class="{'p-invalid':v$.title.$invalid && submitted}"
                     class="input"/>
        </div>
        <small v-if="(v$.title.$invalid && submitted) || v$.title.$pending.$response"
               class="p-error">{{ v$.title.required.$message.replace('Value', 'Title') }}</small>
      </div>
      <div class="input-container">
        <div style="width: 120px">
          <span>Persist: </span>
        </div>
        <div class="p-float-label">
          <ToggleButton id="persistButton" v-model="persist" onIcon="pi pi-check" offIcon="pi pi-times"/>
        </div>
      </div>
      <div class="input-container">
        <div style="width: 120px">
          <span>Sync delay: </span>
        </div>
        <div class="p-float-label">
          <InputText id="delay" v-model.number="v$.delay.$model" :class="{'p-invalid':v$.delay.$invalid && submitted}"
                     class="input"/>
        </div>
        <small v-if="(v$.delay.$invalid && submitted) || v$.delay.$pending.$response"
               class="p-error">{{ v$.delay.required.$message.replace('Value', 'Delay') }}</small>
      </div>
      <Button class="save-button" type="submit" label="Save" icon="pi pi-check"/>
    </form>
  </Dialog>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import APIService from "@/services/APIService.ts";
import {Repository, SelectedItem} from "@/views/Repositories/types/RepositoriesTypes";
import MenuLayout from "@/components/global-components/MenuLayout.vue";
import {mapActions, mapState} from "pinia";
import useStore from "@/store/store";
import {Namespace} from "@/views/Explore/types/ExploreTypes";

export default defineComponent({
  name: "RepositoriesPage",
  components: {MenuLayout},
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      selectedStore: {} as SelectedItem,
      repositoryName: '',
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
      loading: false,
      submitted: false
    }
  },
  validations() {
    return {
      repositoryName: {
        required
      },
      selectedStore: {
        required
      },
      title: {
        required
      },
      persist: {
        required
      },
      delay: {
        required
      }
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
    ...mapState(useStore, ['selectedRepository']),
    ...mapState(useStore, ['getSideBarWidth']),
  },

  methods: {
    ...mapActions(useStore, ['setRepository']),
    ...mapActions(useStore, ['setNumberOfStatements']),
    ...mapActions(useStore, ['setNumberOfContexts']),
    ...mapActions(useStore, ['setNamespaces']),
    confirmDeleteRepository(repository: any) {
      this.repositoryToDelete = repository
      this.deleteRepositoryDialog = true
    },
    deleteRepository() {
      this.apiService.deleteRepository(this.repositoryToDelete.id.value)
      if (this.repositoryToDelete.id.value === this.selectedRepository.id.value) {
        this.setRepository({id: { type:"", value: ""}, title: { type:"", value: ""}, uri: { type:"", value: ""}})
      }
      this.repositories = this.repositories.filter(val => val.id.value !== this.repositoryToDelete.id.value)
      this.repositoryToDelete = {} as Repository
      this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Repository Deleted', life: 3000})
      this.deleteRepositoryDialog = false
    },
    async selectRepository(repository: Repository) {
      this.setRepository(repository)
      this.apiService.getRepositorySize(this.selectedRepository.id.value).then(count => {
        this.setNumberOfStatements(parseInt(count))
      })
      this.apiService.getRepositoryContexts(this.selectedRepository.id.value).then(count => {
        this.setNumberOfContexts(count.split(/\r\n/).length - 2)
      })
      await this.apiService.getNamespacesOfRepository(this.selectedRepository.id.value).then((data: Namespace[]) => {
        this.setNamespaces(data)
      })
      this.$toast.add({
        severity: 'info',
        summary: 'Repository Selected',
        detail: 'Name: ' + repository.id.value,
        life: 3000
      })
      await this.$router.push({name: 'AboutRepositoryPage', params: {name: this.selectedRepository.id.value}})
    },
    openModal() {
      this.displayModal = true
    },
    async handleSubmit(isFormValid: any) {
      this.submitted = true;
      if (!isFormValid) {
        return;
      }
      this.displayModal = false
      await this.apiService.createRepository(this.repositoryName, this.title, this.persist, this.delay, this.selectedStore.name.replace(/\s+/g, ''))
      this.apiService.getListOfRepositories().then((data: Repository[]) => {
        this.repositories = data
        this.loading = false
      })
      this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Repository Created', life: 3000})
      this.resetForm()
    },
    resetForm() {
      this.selectedStore = {name: ''}
      this.repositoryName = ''
      this.title = ''
      this.delay = 0
      this.persist = false
      this.submitted = false
    }
  }
})
</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  background-color: #DCD6D6;
  transition: 0.3s ease;
  overflow: auto;
}

.content-wrapper {
  height: calc(100vh - 100px);
}

.create-button {
  height: 50px;
  width: 1350px;
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  border-radius: 10px;
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

:deep(.p-togglebutton.p-button.p-highlight) {
  background: #0A2341;
}

.save-button {
  bottom: 20px;
  right: 20px;
  width: 100px;
  position: absolute;
}

span {
  font-weight: bolder;
  font-size: 16px;
}
:deep(.p-button-text) {
  background-color: #0A2341;
}

@media only screen and (max-width: 1200px) {
  .main {
    width: fit-content;
    height: 100vh;
  }
  .wrapper {
    height: max-content;
  }
  .item {
    padding: 0 50px 0 50px;
  }
  .info {
    font-size: 20px;
  }
  .content-wrapper {
    height: max-content;
  }
}
</style>