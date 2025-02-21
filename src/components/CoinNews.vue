
<template>
  <div>
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

        this.news = response.data.slice(-5);
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
          // const response = await axios.get('http://192.168.0.3:8080/api/news');
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


.news-header {

  margin-top: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 2px solid #ddd;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* .search-bar 내부의 input에 대해서는 width를 auto로 오버라이드 */
.search-bar input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
  width: auto !important; /* 전역 규칙의 width를 덮어씀 */
}

.search-button,
.clear-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 2px solid black;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.search-button:hover,
.clear-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.search-button:active,
.clear-button:active {
  transform: scale(0.9);
}

button {
  background-color: #4C91F1;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background-color: #3b7cd7;
}

button:active {
  transform: scale(0.95);
}

.news-container {
  display: flex;
  flex-direction: column;
}

.news-time-column {
  width: 150px; /* 고정된 시간 컬럼 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start; /* 시간 텍스트 왼쪽 정렬 */
  padding-right: 20px;
  border-right: 2px solid #ddd;
}

.news-item {
  display: flex;
  align-items: center; /* 세로로 중앙 정렬 */
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

.news-time {
  width: 120px; /* 시간 부분 너비 지정 */
  font-size: 14px;
  color: #777;
  text-align: center;
}

.news-details {
  flex: 1; /* 남은 공간을 차지 */
  padding-left: 15px;
  text-align: left;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
  text-align: left;
}

.news-title a {
  color: #000000; /* 기본 색상 */
  text-decoration: none; /* 링크 밑줄 제거 */
}

.news-title a:hover {
  color: #aa4e4e; /* 클릭 시 보라색 */
}

.news-preview {
  font-size: 14px;
  color: #6f6f6f;
}

.preview-text {
  font-size: 14px;
  color: #6f6f6f;
}

/* 다크 모드 스타일 */
.dark .header {
  background-color: #2c2c2c; /* 헤더 배경 어두운 색 */
  color: #ffffff; /* 글자 색 흰색 */
  border-bottom: 2px solid #444444; /* 헤더 밑의 선 색 변경 */
}

.dark .search-bar input {
  background-color: #333333; /* 입력 필드 배경 어두운 색 */
  color: #ffffff; /* 글자 색 흰색 */
  border: 1px solid #444444; /* 입력 필드 테두리 색 변경 */
}

.dark .search-button,
.dark .clear-button {
  background-color: #444444; /* 버튼 배경 색 어두운 색 */
  color: white;
  border: 2px solid #666666; /* 버튼 테두리 색 변경 */
}

.dark .search-button:hover,
.dark .clear-button:hover {
  background-color: #555555; /* 버튼 hover 시 배경 색 */
}

.dark .news-container {
  background-color: #1b1b1b; /* 뉴스 컨테이너 배경 어두운 색 */
}

.dark .news-item {
  background-color: #2c2c2c; /* 뉴스 항목 배경 어두운 색 */
  border-bottom: 1px solid #444444; /* 항목 밑 선 색 */
}

.dark .news-time {
  color: #aaa; /* 시간 색상 연한 회색 */
}

.dark .news-title a {
  color: #ffffff; /* 링크 색상 흰색 */
}

.dark .news-title a:hover {
  color: #aa4e4e; /* 클릭 시 보라색 */
}

.dark .news-preview,
.dark .preview-text {
  color: #999; /* 텍스트 색상 연한 회색 */
}
</style>