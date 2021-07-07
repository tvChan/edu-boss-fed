<template>
  <div class="role">
    <RoleList />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoleList from './components/List.vue'

export default Vue.extend({
  name: 'ResourceIndex',
  data () {
    return {
      resources: []
    }
  },
  components: {
    RoleList
  }
})
</script>

<style lang="scss" scoped>

</style>
