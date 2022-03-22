<template>
  <Toast/>
  <Toast position="bottom-right" group="br"/>
  <MenuLayout title="Explore" active-section="Explore"></MenuLayout>

  <div class="main">

    <div class="filter">
      <div class="input-container">
        <div>
          <span style="font-weight: bolder;font-size: 20px">Resource: </span>
        </div>
        <div>
          <InputText class="input" type="text" v-model="resource" style="width: 400px"/>
        </div>
      </div>
      <form @submit.prevent="downloadFile(!v$.$invalid)" class="p-fluid input-container">

        <div style="width: 200px">
          <span style="font-weight: bolder;font-size: 20px">Download format: </span>
        </div>
        <div>
          <Dropdown v-model="v$.selectedFormat.$model"
                    :class="{'p-invalid':v$.selectedFormat.$invalid && submitted}" :options="formats" optionLabel="name"
                    placeholder="Select a format"/>
        </div>
        <small v-if="(v$.selectedFormat.$invalid && submitted) || v$.selectedFormat.$pending.$response" class="p-error">
          {{ v$.selectedFormat.required.$message.replace('Value', 'Format') }}</small>
        <div>
          <Button class="download-button" type="submit" label="DOWNLOAD"></Button>
        </div>

      </form>

    </div>


    <DataTable :value="tableData" :paginator="true" :alwaysShowPaginator="false" :rows="9" :loading="loading"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
      <Column header="Subject">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.subject.length > 45" @click="query(slotProps.data.subject)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.subject}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.subject) }">
            {{ truncate(slotProps.data.subject, 45, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.subject)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.subject}}">
            {{ slotProps.data.subject }}
          </router-link>
          <Button icon="pi pi-copy" @click="copyToClipboard(slotProps.data.subject)"
                  style="width: 20px; height: 20px; margin-left: 2px;position: absolute"/>
        </template>
      </Column>
      <Column header="Predicate">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.predicate.length > 40" @click="query(slotProps.data.predicate)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.predicate}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.predicate) }">
            {{ truncate(slotProps.data.predicate, 40, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.predicate)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.predicate}}">
            {{ slotProps.data.predicate }}
          </router-link>
          <Button icon="pi pi-copy" @click="copyToClipboard(slotProps.data.predicate)"
                  style="width: 20px; height: 20px; margin-left: 2px;position: absolute"/>
        </template>
      </Column>
      <Column header="Object">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.object.length > 40" @click="query(slotProps.data.object)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.object}}"
                       v-tooltip.right="{ value: replaceChar(slotProps.data.object) }">
            {{ truncate(slotProps.data.object, 40, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.object)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.object}}">
            {{ slotProps.data.object }}
          </router-link>
          <Button icon="pi pi-copy" @click="copyToClipboard(slotProps.data.object)"
                  style="width: 20px; height: 20px; margin-left: 2px;position: absolute"/>
        </template>
      </Column>
      <Column header="Context">
        <template #body="slotProps">
          <router-link v-if="slotProps.data.context.length > 40" @click="query(slotProps.data.context)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.context}}"
                       v-tooltip.right="{ value: slotProps.data.context }">
            {{ truncate(slotProps.data.context, 40, '...') }}
          </router-link>
          <router-link v-else @click="query(slotProps.data.context)"
                       :to="{name: 'ExplorePage', params: {name:this.$store.state.selectedRepository.id.value}, query:{resource: slotProps.data.context}}">
            {{ slotProps.data.context }}
          </router-link>
        </template>
      </Column>
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" class="p-button-text"/>
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-cloud" class="p-button-text"/>
      </template>
    </DataTable>


  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import APIService from "@/services/APIService";
import {Statement} from "@/views/Explore/types/ExploreTypes";
import helperUtils from "@/services/helperUtils";
import MenuLayout from "@/components/global-components/MenuLayout.vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";

export default defineComponent({
  name: "ExplorePage",
  props: ['name'],
  components: {MenuLayout},
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      tableData: [] as Statement[],
      resource: '' as string,
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
      loading: false,
      selectedFormat: '' as any,
      formats: [
        {name: 'TURTLE', extension: '.ttl'},
        {name: 'RDF/JSON', extension: '.rj'},
        {name: 'RDF/XML', extension: '.rdf'},
        {name: 'N-TRIPLES', extension: '.nt'},
        {name: 'N3', extension: '.n3'},
        {name: 'N-QUADS', extension: '.nq'},
        {name: 'JSON-LD', extension: '.jsonld'},
        {name: 'Trix', extension: '.xml'},
        {name: 'TriG', extension: '.trig'},
      ],
      downloadData: null as any,
      submitted: false,
    }
  },
  validations() {
    return {
      selectedFormat: {
        required
      }
    }
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    this.loading = true
    this.apiService.getStatements(this.name).then(data => {
      const namespaces = this.$store.state.namespaces
      this.tableData = this.helperUtils.prepareStatements(data, namespaces)
      this.loading = false
    })
  },
  methods: {
    query(queryString: string) {
      this.resource = queryString
      // this.apiService.query(this.name, )
    },
    async downloadFile(isFormValid: any) {
      this.submitted = true;
      if (!isFormValid) {
        return;
      }
      const dataFormat = this.helperUtils.findDataFormat(this.selectedFormat.extension)
      const data = await this.apiService.getStatementsForDownload(this.name, dataFormat)
      const blob = new Blob([data], {type: dataFormat})
      const href = URL.createObjectURL(blob)

      const a = Object.assign(document.createElement("a"), {
        href,
        style: "display:none",
        download: `file${this.selectedFormat.extension}`
      })

      a.click()
      URL.revokeObjectURL(href)
      a.remove()
    },
    truncate(text: string, length: number, suffix: any) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
    replaceChar(value: string) {
      return value.replace("<", "&lt;")
    },
    copyToClipboard(value: string) {
      navigator.clipboard.writeText(value).then(() => {
        this.$toast.add({
          severity: 'info',
          summary: 'Info Message',
          detail: 'Copied to clipboard',
          group: 'br',
          life: 3000
        });
      })

    }
  }
})
</script>

<style scoped>
.filter {
  padding: 30px 30px 30px 30px;
  display: flex;
  justify-content: flex-start;
  width: 1600px;
  height: 100px;
  background-color: white;
  border-radius: 10px;
  flex-direction: row;
  gap: 50px;
}

.main {
  padding: 20px 0 30px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: flex-start;
  row-gap: 50px;
  position: absolute;
  top: 100px;
  left: 200px;
  width: 89%;
  min-height: 89%;
  height: fit-content;
  background-color: #DCD6D6;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

:deep(.p-datatable) {
  width: 1600px;
}

:deep([role=cell]) {
  width: 400px;
}

:deep(.p-button) {
  background-color: white;
  border-color: white;
}

.p-button:enabled:hover {
  background-color: white;
  border-color: white;
}

.p-button:focus {
  box-shadow: 0 0 0 0.2rem white;
}

:deep(.pi) {
  color: black;
}

.download-button {
  background-color: #6583A7;
}

.download-button:enabled:hover {
  background-color: #0A2341;
}

.download-button:focus {
  box-shadow: 0 0 0 0.2rem #566F8C;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link) {
  border-width: 0 0 0 0;
}
</style>