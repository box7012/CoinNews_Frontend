<!-- App.vue -->
<template>
  <div id="app">
    <div class="menu-bar">
      <div class="tab-menu">
        <button v-for="(tab, index) in tabs" :key="index" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
      <button @click="showLoginModal = true" class="login-btn">로그인</button>
    </div>

    <LoginModal v-if="showLoginModal" :show="showLoginModal" @close="showLoginModal = false" />

    <div class="grid">
      <div v-if="activeTab === 'Dashboard'" class="frame-item">
        <Dashboard />
      </div>
      <div v-if="activeTab === '코인 차트'" class="frame-item">
        <CoinChartVue />
      </div>
      <div v-if="activeTab === '코인 뉴스'" class="frame-item">
        <CoinNewsVue />
      </div>
      <div v-if="activeTab === '경제 지수'" class="frame-item">
        <CommunityBoard />
      </div>
    </div>
  </div>
</template>

<script>
import CoinMarketVue from './CoinMarket.vue';
import CoinChartVue from './CoinChart.vue';
import CoinNewsVue from './CoinNews.vue';
import EconomyIndex from './EconomyIndex.vue';
import LoginModal from './LoginModal.vue';
import Dashboard from './Dashboard.vue';
import CommunityBoard from './CommunityBoard.vue';



export default {
  components: {
    
    Dashboard,
    CoinMarketVue,
    CoinChartVue,
    CoinNewsVue,
    EconomyIndex,
    LoginModal,
    CommunityBoard,
  },
  data() {
    return {
      showLoginModal: false,
      tabs: ['Dashboard', '코인 차트', '코인 뉴스', '경제 지수'], // 탭 이름
      activeTab: 'Dashboard', // 현재 선택된 탭
    };
  },
};
</script>

<style scoped>
/* 메뉴 바 스타일 */
.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 상단 정렬 */
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

/* 탭 메뉴 스타일 */
.tab-menu {
  display: flex;
  flex-direction: row; /* 가로 정렬 */
  gap: 10px; /* 버튼 간격 */
}

.tab-menu button {
  margin: 0;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

.tab-menu button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* 로그인 버튼 스타일 */
.login-btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #007bff;
  color: white;
}

/* 그리드 스타일 */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 20px;
}

.frame-item {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}
</style>
