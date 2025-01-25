<template>
  <div class="container mt-5">
    <table class="table table-striped">
      <thead>
        <tr>
          <!-- Colonne Country -->
          <th>
            <button 
              @click="sortTable('country')" 
              class="btn btn-outline-primary sort-btn"
              :aria-label="`Click to sort by Country in ${sortConfig.key === 'country' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'} order`">
              Country
              <i v-if="sortConfig.key === 'country'" 
                 :class="getSortIcon('country')" 
                 class="ms-2"></i>
            </button>
          </th>
          <!-- Colonne Region -->
          <th>
            <button 
              @click="sortTable('region')" 
              class="btn btn-outline-primary sort-btn"
              :aria-label="`Click to sort by Region in ${sortConfig.key === 'region' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'} order`">
              Region
              <i v-if="sortConfig.key === 'region'" 
                 :class="getSortIcon('region')" 
                 class="ms-2"></i>
            </button>
          </th>
          <!-- Colonne Total Energy Supply -->
          <th>
            <button 
              @click="sortTable('Total energy supply')" 
              class="btn btn-outline-primary sort-btn"
              :aria-label="`Click to sort by Total Energy Supply in ${sortConfig.key === 'Total energy supply' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'} order`">
              Total Energy Supply
              <i v-if="sortConfig.key === 'Total energy supply'" 
                 :class="getSortIcon('Total energy supply')" 
                 class="ms-2"></i>
            </button>
          </th>
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
      <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <span class="mx-3">Page {{ currentPage }}</span>
      <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>
    <select v-model="currentPage" class="form-select mt-3">
      <option 
        v-for="page in totalPages" 
        :key="page"
        :value="page">
        Page {{ page }}
      </option>
    </select>
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

        // Tri par défaut
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

    const sortedData = computed(() => {
      const { key, direction } = sortConfig.value;
      return [...data.value].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      });
    });

    // Pagination
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedData.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(data.value.length / itemsPerPage);
    });

    //icones
    const getSortIcon = (key) => {
      if (sortConfig.value.key !== key) return 'fas fa-sort'; // Icône neutre
      return sortConfig.value.direction === 'ascending' ? 'fas fa-sort-up' : 'fas fa-sort-down'; // Ascendant ou Descendant
    };

    onMounted(() => {
      fetchData();
    });

    return {
      data,
      countries,
      currentPage,
      itemsPerPage,
      sortedData,
      paginatedData,
      totalPages,
      sortTable,
      fetchData,
      sortConfig,
      getSortIcon
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
  display: inline-block; 
  width: 100%;
  text-align: center;
  border-radius: 0;
}

.sort-btn i {
  font-size: 14px;
  color: #007bff;
  vertical-align: middle;
}

tbody tr {
  transition: all 0.3s ease-in-out;
}

th {
  text-align: center;
  padding: 0;
}

.sort-btn:hover {
  background-color: #0056b3; 
}

th.sorted {
  background-color: #007BFF;
  color: white;
}

tr {
  vertical-align: middle;
}

@media (max-width: 576px) {
  .sort-btn {
    font-size: 12px;
    white-space: nowrap; 
  }
}
</style>
