<template>
  <Toast/>
  <MenuLayout title="About Repository" active-section="About"></MenuLayout>

  <div class="main">
    <Toast/>
    <div>
      <div class="summary-header"><span>Summary</span></div>
      <div class="summary-container">
        <div class="summary">
          <div class="header">
            <span>Repository Location</span>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>Name: </span>
            </div>
            <div>
              <div>
                <span>{{ getSelectedRepository.id.value }}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>Title: </span>
            </div>
            <div>
              <div>
                <span>{{ getSelectedRepository.title.value }}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>Location: </span>
            </div>
            <div>
              <div>
                <span v-if="this.getSelectedRepository.uri.value.length > 54"
                      v-tooltip.right="{ value: this.getSelectedRepository.uri.value }">
                  {{ truncate(getSelectedRepository.uri.value, 54, '...') }}
                </span>
                <span v-else>{{ getSelectedRepository.uri.value }}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 140px">
              <span>RDF4J Server: </span>
            </div>
            <div>
              <div>
                <span>{{ getRdfServerUrl }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="summary" style="justify-content: space-around">
          <div class="header">
            <span>Repository Size</span>
          </div>
          <div class="input-container">
            <div style="width: 290px">
              <span>Number of statements: </span>
            </div>
            <div>
              <div>
                <span>{{ getNumberOfStatements }}</span>
              </div>
            </div>
          </div>
          <div class="input-container">
            <div style="width: 290px">
              <span>Number of labeled contexts: </span>
            </div>
            <div>
              <div>
                <span>{{ getNumberOfContexts }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="separator"></div>
    </div>

    <div class=content-container>
      <div>
        <TabMenu :model="items" @tab-change="changeTab"/>
      </div>
      <div v-if="activeTab === 0">
        <DataTable :value="types" stripedRows responsiveLayout="scroll" :scrollable="true" scrollHeight="370px">
          <Column field="type.value" header="Type" :sortable="true"></Column>
        </DataTable>
      </div>
      <div v-if="activeTab === 1">
        <DataTable :rows="10" :value="contexts" stripedRows responsiveLayout="scroll" :scrollable="true"
                   scrollHeight="370px">
          <Column field="contextID.value" header="Context" :sortable="true"></Column>
        </DataTable>
      </div>
      <div v-if="activeTab === 2" class="namespaces-tab">

        <DataTable :value="namespaces" data-key="prefix.value" stripedRows responsiveLayout="scroll" :scrollable="true"
                   scrollHeight="370px" style="flex-grow: 1;">
          <Column field="prefix.value" header="Prefix" :sortable="true" style="max-width:200px"></Column>
          <Column field="namespace.value" header="Namespace"></Column>
        </DataTable>

        <div>
          <form @submit.prevent="updateNamespace(!v$.$invalid)" class="p-fluid filter">
            <span style="font-size: 30px;font-weight: bolder">Prefix</span>
            <InputText v-model="v$.prefix.$model"
                       v-on:input="resetForm"
                       :class="{'p-invalid':v$.prefix.$invalid && submitted || isPrefixMissing}"
                       class="input"
                       style="width: 200px"/>
            <small v-if="(v$.prefix.$invalid && submitted) || v$.prefix.$pending.$response || isPrefixMissing"
                   class="p-error">{{ v$.prefix.required.$message.replace('Value', 'Prefix') }}</small>

            <Dropdown v-model="selectedPrefix" style="width: 200px" :options="prefixes" optionLabel="name"
                      placeholder="Select a prefix" @change="changePrefix"/>
            <span style="font-size: 30px;font-weight: bolder">Namespace </span>
            <InputText v-model="v$.namespace.$model"
                       v-on:input="resetForm"
                       :class="{'p-invalid':v$.namespace.$invalid && submitted}"
                       class="input"/>
            <small v-if="(v$.namespace.$invalid && submitted) || v$.namespace.$pending.$response"
                   class="p-error">{{ v$.namespace.required.$message.replace('Value', 'Namespace') }}</small>

            <div style="display:flex;justify-content: space-between">
              <Button label="UPDATE" type="submit" style="width: 100px"/>
              <Button label="DELETE" @click="deleteNamespace(!v$.prefix.$invalid)" style="width: 100px"/>
              <Button label="CLEAR" @click="clearSection" style="width: 100px"/>
            </div>
          </form>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Context, Namespace, Type} from "@/views/Explore/types/ExploreTypes";
import APIService from "@/services/APIService";
import {SelectedItem} from "@/views/Repositories/types/RepositoriesTypes";
import MenuLayout from "@/components/global-components/MenuLayout.vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {mapActions, mapState} from "pinia";
import useStore from "@/store/store";

export default defineComponent({
  name: "AboutRepositoryPage",
  props: ['name'],
  components: {MenuLayout},
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      activeTab: -1,
      items: [
        {label: 'Types'},
        {label: 'Context'},
        {label: 'Namespaces'}
      ],
      types: [] as Type[],
      contexts: [] as Context[],
      namespaces: [] as Namespace[],
      selectedPrefix: {} as SelectedItem,
      prefix: '' as string,
      namespace: '' as string,
      selectedNamespace: {} as Namespace,
      prefixes: [] as SelectedItem[],
      apiService: null as unknown as APIService,
      submitted: false,
      isPrefixMissing: false,
    }
  },
  validations() {
    return {
      prefix: {
        required
      },
      namespace: {
        required
      }
    }
  },
  computed: {
    ...mapState(useStore, ['getSelectedRepository']),
    ...mapState(useStore, ['getRdfServerUrl']),
    ...mapState(useStore, ['getNumberOfStatements']),
    ...mapState(useStore, ['getNumberOfContexts']),
  },
  created() {
    this.apiService = new APIService()
  },
  methods: {
    ...mapActions(useStore, ['setNamespaces']),
    async changeTab(event: any) {
      this.activeTab = event.index;
      if (event.index === 0) {
        this.apiService.getTypesOfRepository(this.getSelectedRepository.id.value).then((data: Type[]) => this.types = data)
      } else if (event.index === 1) {
        this.apiService.getContextsOfRepository(this.getSelectedRepository.id.value).then((data: Context[]) => this.contexts = data)
      } else {
        await this.apiService.getNamespacesOfRepository(this.getSelectedRepository.id.value).then((data: Namespace[]) => {
          this.setNamespaces(data)
          this.namespaces = data
          this.prefixes = []
          for (let namespace in this.namespaces) {
            const prefix = {
              name: this.namespaces[namespace].prefix.value
            } as SelectedItem;
            this.prefixes.push(prefix)
          }
        })
      }
    },
    changePrefix() {
      this.prefix = this.selectedPrefix.name
      const namespace: Namespace | undefined = this.namespaces.find((namespace: Namespace) => namespace.prefix.value === this.selectedPrefix.name)
      if (namespace !== undefined) {
        this.selectedNamespace = namespace
        this.namespace = namespace.namespace.value
      }
    },
    async updateNamespace(isFormValid: any) {
      this.submitted = true;
      if (!isFormValid) {
        return
      }
      await this.apiService.updateNamespaceOfRepository(this.getSelectedRepository.id.value, this.prefix, this.namespace)
      this.apiService.getNamespacesOfRepository(this.getSelectedRepository.id.value).then((data: Namespace[]) => {
        this.namespaces = data
        this.prefixes = []
        for (let namespace in this.namespaces) {
          const prefix = {
            name: this.namespaces[namespace].prefix.value
          } as SelectedItem;
          this.prefixes.push(prefix)
        }
      })
      this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Namespace Updated', life: 3000})
      this.prefix = ''
      this.namespace = ''
      this.selectedPrefix = {} as SelectedItem
      this.submitted = false
    },
    deleteNamespace(isPrefix: boolean) {
      if (!isPrefix) {
        this.isPrefixMissing = true
        return
      }
      this.apiService.deleteNamespaceOfRepository(this.getSelectedRepository.id.value, this.prefix)
      this.namespaces = this.namespaces.filter(val => val.prefix.value !== this.selectedNamespace.prefix.value)
      this.prefixes = this.prefixes.filter(val => val.name !== this.selectedNamespace.prefix.value)
      this.$toast.add({severity: 'success', summary: 'Successful', detail: 'Namespace Deleted', life: 3000})
      this.prefix = ''
      this.namespace = ''
      this.selectedPrefix = {} as SelectedItem
      this.isPrefixMissing = false
    },
    resetForm() {
      if (this.prefix !== "") {
        this.isPrefixMissing = false
      } else {
        this.submitted = false
      }
      if (this.namespace === "") {
        this.submitted = false
      }
    },
    clearSection() {
      this.prefix = ''
      this.selectedPrefix = {name: ''}
      this.namespace = ''
    },
    truncate(text: string, length: number, suffix: string) {
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
.summary-header {
  font-size: 60px;
  font-weight: bolder;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  font-size: 30px;
  font-weight: bolder;
}

.summary {
  padding: 0 10px 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  min-width: 500px;
  min-height: 170px;
  background-color: white;
  border-radius: 10px;
}

.separator {
  height: 30px;
  background-color: #01112C;
  margin-top: 30px;
}

.main {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  background-color: #DCD6D6;
  transition: 0.3s ease;
  height: calc(100vh - 100px);
  overflow: auto;
}

.summary-container {
  display: flex;
  justify-content: space-around;
  gap: 5px;
  align-items: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0 20px;
  row-gap: 10px;
}

.filter {
  padding: 15px 15px 15px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 10px;
  min-width: 400px;
  height: 370px;
  background-color: white;
  border-radius: 10px;
}

:deep(.p-dropdown:not(.p-disabled)) {
  border-color: black;
}

:deep(.p-tabmenu-nav) {
  justify-content: space-between;
  background: #DCD6D6;
  border-bottom-width: 4px;
}

:deep(.p-tabmenuitem) {
  font-size: 35px;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-highlight .p-menuitem-link) {
  background: #DCD6D6;
  border-width: 0 0 4px 0;
  border-color: #DA5800;
  color: #6c757d;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-menuitem-link) {
  background-color: #DCD6D6;
  margin: 0 0 -4px 0;
  border-width: 0 0 4px 0;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):focus) {
  box-shadow: none;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):hover) {
  background-color: #DCD6D6;
  border-width: 0 0 4px 0;
}

.namespaces-tab {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.input-container {
  display: flex;
  font-size: 20px;
  align-items: center;
  gap: 20px;
}
/*.clear-button {*/
/*  position: relative;*/
/*  top: 10px;*/
/*  right: 10px;*/
/*}*/
@media only screen and (max-width: 1000px) {
  .namespaces-tab {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .summary-container {
    flex-direction: column;
  }
}
</style>