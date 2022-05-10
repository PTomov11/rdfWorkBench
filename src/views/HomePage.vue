<template>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from "vue"

/*
    Author: Patrik Tomov
    Date: 7.5.2022
*/
export default defineComponent({
  name: "HomePage",
  mounted() {
    this.$router.push({name: 'RepositoriesPage'})
  },
})
</script>