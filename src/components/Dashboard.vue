<template>
    <div class="dashboard-grid">
      <div class="dashboard-frame-item">
        <CoinMarketVue />
      </div>
      <div class="dashboard-frame-item">
        <CoinChartVue />
      </div>
      <div class="dashboard-frame-item">
        <CoinNewsRealTime />
      </div>
      <div class="dashboard-frame-item">
        <EconomyIndex />
      </div>
    </div>
  </template>
  
  <script>
  import CoinMarketVue from './CoinMarket.vue';
  import CoinChartVue from './CoinChart.vue';
  import CoinNewsRealTime from './CoinNewsRealTime.vue';
  import EconomyIndex from './EconomyIndex.vue';
  
  export default {
    components: {
      CoinMarketVue,
      CoinChartVue,
      CoinNewsRealTime,
      EconomyIndex,
    },
  };
  </script>
  
  <style scoped>
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2열 레이아웃 */
    gap: 10px;
  }
  
  .dashboard-frame-item {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    height: 50vh;
    min-height: 250px;
    max-height: 400px;
    overflow: hidden;
  }
  </style>
  




  <!-- <style scoped>

  
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2열 레이아웃 */
    grid-gap: 5px; /* 항목 간격 */
    width: 100%; /* 그리드의 너비를 부모와 맞추기 */
    height: 100%;
    padding-top: 70px;
    
    
  }
  
  .dashboard-frame-item {
    position: relative;
    display: flex; /* 자식 요소의 정렬 조정 */
    justify-content: flex-start; /* 수평 방향: 왼쪽 정렬 */
    align-items: flex-start; /* 수직 방향: 위쪽 정렬 */
    padding: 10px;
    border: 1px solid #ccc; /* 확인용 테두리 */
    border-radius: 10px;
    height: 50vh; /* 화면 너비의 26%로 높이 설정 */
    min-height: 250px;
    max-height: 400px;
    width: 50vw; /* 화면 너비의 32%로 너비 설정 */
    max-width: 50px; /* 최대 너비 제한 */
    min-width: 50px; /* 최소 너비 제한 */
    overflow: hidden;
    
  }
  
  
  .login-btn {
    position: absolute; /* 부모 요소를 기준으로 위치 */
    top: 20px; /* 상단에서 20px 위치 */
    right: 20px; /* 오른쪽에서 20px 위치 */
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .login-btn:hover {
    background-color: #0056b3; /* hover 시 색상 변경 */
  }
  
  
  </style> -->