<template>
  <v-app id="inspire">
    <app-nav-bar></app-nav-bar>
    <!-- If using vue-router -->
    <router-view></router-view>
  </v-app>
</template>

<script>
import AppNavBar from './components/AppNavBar.vue'

// AHOJ

export default {
  components: { AppNavBar },
  name: 'app'
}
</script>

<style>

</style>
