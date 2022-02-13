<template>
  <div class="top-bar">
    <div class="container">

      <div class="item">
        <p class="title">{{ title }}</p>
      </div>
      <div class="item">
        <p class="info">RDF4J Server: Server</p>
        <p class="info">Repository: Current selected repository</p>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "TopBar",
  props: ['title']
})
</script>

<style scoped>
  .top-bar {
    height: 100px; /* Full-height: remove this if you want "auto" height */
    width: 90%; /* Set the width of the sidebar */
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 200px;
    background-color: #0A2341; /* Black */
    /*overflow-x: hidden; !* Disable horizontal scroll *!*/
  }
  .container {
    height: 100px;
  }
  .item{
    height: 100px;
    width: 640px;
    display: table-cell;
    vertical-align: middle;
  }
  .title {
    margin: 0 0 0 20px;
    font-size: 40px;
    color: white;
    font-weight: bold;
  }
  .info {
    color: white;
    margin: 16px 0 16px 200px;
  }
</style>