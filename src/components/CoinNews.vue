
<template>
  <div class="news">
    <div class="news-header">
      <h1>뉴스</h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="검색어를 입력하세요" />
        <button @click="searchNews" class="search-button">🔍</button>
        <button @click="deleteSearchQuery" class="clear-button">❌</button>
      </div>
    </div>

    <div class="news-container">
      <div v-for="information in news" :key="information.id" class="news-item">
        <div class="news-time-column">
          <div class="news-time">{{ formatDate(information.date) }}</div>
        </div>

        <div class="news-details">
          <div class="news-title">
            <a :href="information.link" target="_blank" rel="noopener noreferrer">
              <strong>{{ information.title }}</strong>
            </a>
          </div>

          <div class="news-preview">
            <span class="preview-text">{{ information.title.substring(0, 100) }}...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      searchQuery: "",
      news: [],
    };
  },

  computed: {
    ...mapState(['isDarkMode']), // Vuex 상태에서 다크모드 값 가져옴
  },


  methods: {

    ...mapActions(['toggleDarkMode']),

    async searchNews() {
      try {
        if (!this.searchQuery.trim()) {
          alert("검색어를 입력하세요.");
          return;
        }

        const response = await axios.post("/api/news/search", {
          query: this.searchQuery,
        });

        // this.news = response.data.slice(-5);
        this.news = response.data;
      } catch (error) {
        console.error("검색 실패 : ", error);
      }
    },

    deleteSearchQuery() {
      this.searchQuery = "";
      this.loadMessages();
    },

    async loadMessages() {
      try {
        if (!this.searchQuery) { 
          const response = await axios.get('/api/news');
          this.news = response.data.slice(-40);
        }
      } catch (error) {
        console.error("Failed to load Messages: ", error);
      }
    },

    startmessagePolling() {
      this.loadMessages();
      setInterval(this.loadMessages, 600000); // 10초
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24시간 포맷 사용
      }).replace(',', '').replace('/', '-').replace('/', '-');
    },

  },

  mounted() {
    this.startmessagePolling();
    const darkMode = localStorage.getItem('darkMode') === 'true';
    this.$store.dispatch('updateDarkMode', darkMode); // 초기 다크 모드 상태 설정
  }
};
</script>

<style scoped>

.news {
  width: 90%;
  min-width: 1200px;
  padding: 0px;
  border-radius: 15px;
  background: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  flex-grow: 1;
  max-height: 1000px;
  overflow: auto;
  top: 20px;
  min-height: 1000px;
}

.news-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #808080;
  position: sticky;
  top: 0; /* 최상단에 고정 */
  z-index: 400; /* 다른 요소 위에 배치 */
  background-color: #ffffff;
  padding: 15px;
}

.news-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 10px;
}

.search-bar {
  display: flex;
  align-items: center; /* 버튼들을 세로로 가운데 정렬 */
  gap: 10px;
}

.search-bar input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  width: 200px;
}

.search-button,
.clear-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center; /* 세로로 가운데 정렬 */
  justify-content: center;
  background-color: #4c91f1;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s ease;
  position: static;
}

.search-button:hover,
.clear-button:hover {
  background-color: #3b7cd7;
}

.news-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: fit-content;
  padding: 5px;
}

.news-item {
  display: flex;
  padding: 15px;
  border-radius: 10px;
  background: white;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: left;
  
}

.news-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.news-time-column {
  min-width: 120px;
  text-align: center;
  align-items: center;    
  justify-content: center;
  font-size: 14px;
  color: #777;
}

.news-title a {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  transition: color 0.2s ease;
  text-align: left;
}

.news-title a:hover {
  color: #aa4e4e;
}

.news-preview {
  font-size: 14px;
  color: #666;
}

/* 다크 모드 스타일 */
.dark .news {
  background: #2c2c2c;
  color: white;
}

.dark .news-header {
  border-bottom: 2px solid #444;
  background-color: #2c2c2c;
}

.dark .news-header h1 {
  color: rgb(255, 255, 255);
}

.dark .search-bar input {
  background: #444;
  color: white;
  border: 1px solid #666;
}

.dark .search-button,
.dark .clear-button {
  background: #555;
  color: white;
}

.dark .news-item {
  background: #3b3b3b;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
}

.dark .news-item:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
}

.dark .news-title a {
  color: #fff;
}

.dark .news-title a:hover {
  color: #ff6b6b;
}

.dark .news-preview {
  color: #ccc;
}

</style>