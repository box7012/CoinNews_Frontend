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
      <!-- <div v-if="activeTab === 'Community Board'" class="frame-item">
        <CommunityBoard />
      </div> -->
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
      // tabs: ['Dashboard', 'Back Testing', 'News', 'Community Board'], // 탭 이름
      tabs: ['Dashboard', 'Back Testing', 'News'], // 탭 이름
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
  align-items: center;
  padding: 15px 25px;
  background-color: #2c3e50;
  border-bottom: 2px solid #34495e;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab-menu {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.tab-menu button {
  padding: 12px 30px;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: #3498db;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-menu button.active {
  background-color: #2980b9;
  color: #fff;
  border-color: #fff;
  border-width: 2px;
}

.tab-menu button:hover {
  background-color: #2980b9;
  opacity: 0.9;
}

/* 그리드 스타일 */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 30px;
}

.frame-item {
  padding: 25px;
  border-radius: 12px;
  background-color: #ecf0f1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.frame-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

/* 로그인 모달 스타일 */
.login-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 20px;
  color: #888;
  cursor: pointer;
}

.modal-close:hover {
  color: #333;
}
</style>
