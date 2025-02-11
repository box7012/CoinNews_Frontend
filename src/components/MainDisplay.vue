<!-- App.vue -->
<template>
  <div id="app">

    <div class="menu-bar">
      <div class="tab-menu">
        <button v-for="(tab, index) in tabs" :key="index" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
    </div>

    <LoginModal v-if="showLoginModal" :show="showLoginModal" @close="showLoginModal = false" />

    <div class="grid">
      <div v-if="activeTab === 'Dashboard'" class="frame-item">
        <Dashboard />
      </div>
      <div v-if="activeTab === 'Back Testing'" class="frame-item">
        <Backtesting />
      </div>
      <div v-if="activeTab === 'News'" class="frame-item">
        <CoinNews />
      </div>
      <div v-if="activeTab === 'Community Board'" class="frame-item">
        <CommunityBoard />
      </div>
    </div>
  </div>
</template>

<script>
import CoinMarketVue from './CoinMarket.vue';
import CoinNews from './CoinNews.vue';
import CoinChartVue from './CoinChart.vue';
import EconomyIndex from './EconomyIndex.vue';
import LoginModal from './LoginModal.vue';
import Dashboard from './Dashboard.vue';
import CommunityBoard from './CommunityBoard.vue';
import Backtesting from './Backtesting.vue';

export default {
  components: {
    CoinNews,
    Dashboard,
    CoinMarketVue,
    CoinChartVue,
    EconomyIndex,
    LoginModal,
    CommunityBoard,
    Backtesting,
  },
  data() {
    return {
      showLoginModal: false,
      tabs: ['Dashboard', 'Back Testing', 'News', 'Community Board'], // 탭 이름
      activeTab: 'Dashboard', // 현재 선택된 탭
      user: null,
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("authToken");
      this.user = null;
    }
  }

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
  background-color: rgb(59, 175, 211);
  cursor: pointer;
}

.tab-menu button.active {
  background-color: #007bff;
  color: white;
  border-color: #010203;
  border-width: 3px;
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
