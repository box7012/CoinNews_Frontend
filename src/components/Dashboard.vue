<template>
  <div class="dashboard-grid">
    <!-- 좌측 (1번, 3번) CoinMarketVue -->
    <div class="dashboard-frame-item large-item">
      <CoinMarketVue />
    </div>

    <!-- 우측 상단 (2번) CoinChartVue -->
    <div class="dashboard-frame-item">
      <CoinChartVue />
    </div>

    <!-- 우측 하단 (4번) CoinNewsRealTime -->
    <div class="dashboard-frame-item">
      <CoinNewsRealTime />
    </div>
  </div>
</template>

<script>
import CoinMarketVue from './CoinMarket.vue';
import CoinChartVue from './CoinChart.vue';
import CoinNewsRealTime from './CoinNewsRealTime.vue';

export default {
  components: {
    CoinMarketVue,
    CoinChartVue,
    CoinNewsRealTime,
  },
};
</script>

<!-- <style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 0.9fr 1fr; /* 좌측 2배 크기, 우측 1배 크기 */
  grid-template-rows: 1.1fr 1fr; /* 2행 레이아웃 */
  gap: 10px;
  height: 100vh; /* 높이 설정 */
}

.dashboard-frame-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: auto;
}

.large-item {
  grid-row: span 2; /* 좌측 (1, 3) 합치기 */
}
</style> -->

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 700px 800px; /* 좌측 300px, 우측 500px */
  grid-template-rows: 450px 500px; /* 각 행 높이 400px 고정 */
  gap: 10px;
  height: 100vh; /* 전체 높이 설정 */
}

.dashboard-frame-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: auto;
}

.large-item {
  grid-row: span 2; /* 좌측 (1, 3) 합치기 */
  height: 810px; /* 400px x 2 + gap 고려 */
}
</style>
