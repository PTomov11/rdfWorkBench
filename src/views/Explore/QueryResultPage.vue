<template>
  <Toast/>
  <MenuLayout title="Query Result" active-section="Query"></MenuLayout>

  <div class="main">

  </div>
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/sparql/sparql'
import {defineComponent} from "vue";
import APIService from "@/services/APIService";
import helperUtils from "@/services/helperUtils";
import MenuLayout from "@/components/global-components/MenuLayout.vue";

export default defineComponent({
  name: "QueryResultPage",
  components: {MenuLayout},
  data() {
    return {
      queryResults: [] as any,
      apiService: null as unknown as APIService,
      helperUtils: null as unknown as helperUtils,
    }
  },
  created() {
    this.apiService = new APIService()
    this.helperUtils = new helperUtils()
  },
  mounted() {
    this.queryResults = this.$route.params.data
  },
  methods: {

  }
})
</script>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  position: absolute;
  gap: 10px;
  top: 100px;
  left: 200px;
  width: 89%;
  height: 89%;
  background-color: #DCD6D6;
  padding: 20px 20px 20px 20px;
}

.filter {
  height: 100px;
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 10px;
}

.sub-filter1 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.sub-filter2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-grow: 3;
}

:deep(.CodeMirror) {
  height: 650px;
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
}

.query-header {
  font-size: 60px;
  font-weight: bolder;
  height: 100px;
  display: flex;
  align-items: center;
}

:deep(.p-datatable) {
  max-width: 100%;
}

:deep([role=cell]) {
  width: 250px;
}
</style>