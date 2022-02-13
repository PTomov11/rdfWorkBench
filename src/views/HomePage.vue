<template>
  <img class="background" :src="image" alt="background"/>
  <MegaMenu class="menu" :model="items">
    <router-link :to="item.to"/>
  </MegaMenu>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent, reactive , toRefs} from "vue"

export default defineComponent({
  name: "HomePage",
  setup() {
    const state = reactive({
      image: require('../assets/background.png'),
      items: [
        {
          label: 'Repositories',
          to: '/repositories'
        },
        {
          label: 'Explore',
          to: '/explore',
          items: [
            [
              {
                label: 'About Repository'
              },
              {
                label: 'Query'
              }
            ]
          ]
        },
        {
          label: 'Update',
          to: '/update'
        },
        {
          label: 'System',
          to: '/system'
        }
      ]
    })

    return {

      ...toRefs(state)
    }

  }
})
</script>

<style scoped>
  .background {
    /* Set rules to fill background */
    min-height: 100%;
    min-width: 1024px;

    /* Set up proportionate scaling */
    width: 100%;
    height: auto;

    /* Set up positioning */
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .menu {
    width: 500px;
    position: fixed;
    top: 10px;
    right: 200px;
  }
  .skuska {
    color:white;
  }
</style>