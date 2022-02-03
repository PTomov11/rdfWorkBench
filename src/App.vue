<template>
  <div class="app">
    hello
  </div>
  <div>
    <span class="p-float-label">
      <InputText id="query" type="text" v-model="value" />
      <label for="query">Query</label>
    </span>
    <Button label="Submit" v-on:click="handleClick"></Button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data() {
    return {
      value: null
    }
  },
  methods: {
    handleClick: function () {
      fetch('http://localhost:8080/rdf4j-server/repositories/skuska/statements', {
        method: 'GET',
        headers: {
          'Accept': 'application/sparql-results+xml, */*;q=0.5'
        },
      }).then((response) => {
          console.log(response)
          return response.text()
      }).then((data) => {
          console.log(data)
      })
    }
  },
  components: {}
});
</script>

<style>

</style>
