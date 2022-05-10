<template>
  <router-link :to="to" class="link">
    <i class="icon" :class="icon"/>
      <transition name="fade">
        <span v-if="!this.getCollapsed">
          <slot />
        </span>
      </transition>
  </router-link>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import useStore from "../../store/store";
import {mapState} from "pinia";

/*
 Author: Patrik Tomov
 Date: 7.5.2022
*/
export default defineComponent({
  name: "SideBarLink",
  props: {
    to: {},
    icon: { type: String, required: true},
  },
  computed: {
    ...mapState(useStore, ['getCollapsed']),
  }
})
</script>

<style scoped>
.link {
  display: flex;
  align-items: center;

  cursor: pointer;
  position: relative;
  font-weight: bolder;
  user-select: none;
  margin-left: 8px;

  padding: 0.4em;
  border-radius: 0.25em;
  height: 1.5em;

  color: white;
  text-decoration: none;
}
.link:hover {
  background-color: #566F8C;
}
.link .icon {
  flex-shrink: 0;
  margin-right: 10px;
}
</style>