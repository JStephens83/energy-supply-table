<template>
  <div class="container mt-5">
    <h1 class="mb-4">Energy Supply Data</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortTable('country')" class="sort-btn">Country</th>
          <th @click="sortTable('region')" class="sort-btn">Region</th>
          <th @click="sortTable('Total energy supply')" class="sort-btn">Total Energy Supply</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="index">
          <td>{{ item.country }}</td>
          <td>{{ item.region }}</td>
          <td>{{ item['Total energy supply'] }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button class="btn btn-primary" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <span class="mx-3">Page {{ currentPage }}</span>
      <button class="btn btn-primary" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const data = ref([]);
    const countries = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 20;
    const sortConfig = ref({ key: 'Total energy supply', direction: 'descending' });

    // Récupération des données
    const fetchData = async () => {
      try {
        const dataResponse = await axios.get('http://localhost:5000/data');
        data.value = dataResponse.data;

        const countriesResponse = await axios.get('http://localhost:5000/countries');
        countries.value = countriesResponse.data;

        // Tri initial par Total Energy Supply, du plus grand au plus petit
        sortConfig.value = { key: 'Total energy supply', direction: 'descending' };
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    // Tri des données
    const sortTable = (key) => {
      let direction = 'ascending';
      if (sortConfig.value.key === key && sortConfig.value.direction === 'ascending') {
        direction = 'descending';
      }
      sortConfig.value = { key, direction };
    };

    // Données triées
    const sortedData = computed(() => {
      const { key, direction } = sortConfig.value;
      return [...data.value].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
    });

    // Pagination des données
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedData.value.slice(start, end);
    });

    // Nombre total de pages
    const totalPages = computed(() => {
      return Math.ceil(data.value.length / itemsPerPage);
    });

    // Appeler fetchData() une fois le composant monté
    onMounted(() => {
      fetchData();
    });

    // Retourner les propriétés et méthodes dans le template
    return {
      data,
      countries,
      currentPage,
      itemsPerPage,
      sortedData,
      paginatedData,
      totalPages,
      sortTable,
      fetchData
    };
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.sort-btn {
  cursor: pointer; /* Change le curseur en main lors du survol */
  padding: 10px;
  margin: 5px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.sort-btn:hover {
  background-color: #0056b3; /* Change la couleur de fond au survol */
}
</style>
