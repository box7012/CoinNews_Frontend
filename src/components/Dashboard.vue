<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="app">
    <div class="dashboard-grid">
      <div class="dashboard-frame-item large-item">
        <CoinMarketVue />
      </div>
      <div class="dashboard-frame-item">
        <CoinChartVue />
      </div>
      <div class="dashboard-frame-item">
        <CoinNewsRealTime />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CoinMarketVue from './CoinMarket.vue';
import CoinChartVue from './CoinChart.vue';
import CoinNewsRealTime from './CoinNewsRealTime.vue';

export default {
  components: {
    CoinMarketVue,
    CoinChartVue,
    CoinNewsRealTime,
  },
  computed: {
    ...mapGetters(['isDarkMode']),
  },
};
</script>

<style scoped>
.app {
  transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
  background-color: #1b1b1b;
  color: white;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 700px 800px;
  grid-template-rows: 450px 500px;
  gap: 10px;
  height: 100vh;
}

.dashboard-frame-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: auto;
}

.large-item {
  padding: 0px;
  grid-row: span 2;
  height: 960px;
  margin: 0px;
}
</style>
