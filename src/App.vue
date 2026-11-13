<template>
  <AppNavbar />
  <main class="container-fluid px-4 py-4">
    <router-view />
  </main>
</template>

<script setup>
import { provide, ref } from 'vue'
import AppNavbar from './components/layout/AppNavbar.vue'
import sourceData from './data/dataBahanAjar.json'

// Create a global reactive state for dataJSON that can be injected anywhere
const dataJSON = ref(sourceData)
provide('dataJSON', dataJSON)
</script>
