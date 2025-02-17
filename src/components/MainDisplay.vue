<template>
  <div id="app" :class="{ dark: isDarkMode }">
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
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CoinMarketVue from './CoinMarket.vue';
import CoinNews from './CoinNews.vue';
import CoinChartVue from './CoinChart.vue';
import EconomyIndex from './EconomyIndex.vue';
import LoginModal from './LoginModal.vue';
import Dashboard from './Dashboard.vue';
import Backtesting from './Backtesting.vue';

export default {
  components: {
    CoinNews,
    Dashboard,
    CoinMarketVue,
    CoinChartVue,
    EconomyIndex,
    LoginModal,
    Backtesting,
  },
  data() {
    return {
      showLoginModal: false,
      tabs: ['Dashboard', 'Back Testing', 'News'],
      activeTab: 'Dashboard',
    };
  },
  computed: {
    ...mapState(['isDarkMode']),
  },
  methods: {
    ...mapActions(['toggleDarkMode']),
  },
};
</script>

<style scoped>
/* 다크 모드 전환 버튼 */
.toggle-dark-mode {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-dark-mode:hover {
  background-color: #0056b3;
}

/* 메뉴 바 스타일 */
.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 다크 모드 스타일 */
.dark .menu-bar {
  background-color: #2c3e50;
  border-bottom: 2px solid #34495e;
}

.dark .grid {
  background-color: #1e272e;
}

.dark .frame-item {
  background-color: #2c3e50;
  color: white;
  border: 1px solid #34495e;
}

/* 탭 메뉴 스타일 */
.tab-menu {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.tab-menu button {
  padding: 12px 30px;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tab-menu button.active {
  background-color: #0056b3;
  color: #fff;
  border-color: #007bff;
}

.tab-menu button:hover {
  background-color: #0056b3;
  opacity: 0.9;
}

/* 다크 모드 탭 스타일 */
.dark .tab-menu button {
  background-color: #4a69bd;
}

.dark .tab-menu button.active {
  background-color: #1e3799;
}

.dark .tab-menu button:hover {
  background-color: #1e3799;
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
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #dee2e6;
}

.frame-item:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.dark .frame-item {
  background-color: #2c3e50;
  color: white;
  border: 1px solid #34495e;
}
</style>
