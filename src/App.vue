<template>
  <div id="app">
    <h1 class="text-center">Energy Table</h1>
    <!-- Appel du composant TableComponent -->
    <TableComponent />
  </div>
</template>

<script>
import TableComponent from './components/TableComponent.vue';

export default {
  name: 'App',
  components: {
    TableComponent,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
