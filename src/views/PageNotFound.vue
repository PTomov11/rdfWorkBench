<template>
  <img class="background" :src="image" alt="background"/>
  <div class="error">
    <h1>Sorry, this page does not exist!</h1>
    <Button class="p-button-lg" style="margin-top: 10px" label="Back to home" @click="returnToHomePage" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

/*
    Author: Patrik Tomov
    Date: 7.5.2022
*/
export default defineComponent({
  name: "PageNotFound",
  data() {
    return {
      // picture is bought from https://www.shutterstock.com/ and I have license for using it
      image: require('@/assets/background.png')
    }
  },
  methods: {
    returnToHomePage() {
      this.$router.push({name: 'HomePage'})
    }
  }
})
</script>

<style scoped>
.error {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 98vh;
}
.background {
  min-height: 100%;
  min-width: 1024px;
  width: 100%;
  height: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>