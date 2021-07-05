<template>
  <div id="app">
    <!-- 根路由 -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from './components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld
  }
})
export default class App extends Vue {}
</script>

<style lang="less" scoped>
</style>
