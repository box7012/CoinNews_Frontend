<template>
  <div>
    <div class="header">
      <h1>뉴스</h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="검색어를 입력하세요" />
        <button @click="searchNews" class="search-button">🔍</button>
        <button @click="deleteSearchQuery" class="clear-button">❌</button>
      </div>
    </div>

    <div class="news-container">
      <div v-for="information in news" :key="information.id" class="news-item">
        <!-- 시간 부분을 컬럼처럼 처리 -->
        <div class="news-time-column">
          <div class="news-time">{{ formatDate(information.date) }}</div>
        </div>

        <!-- 제목과 내용 -->
        <div class="news-details">
          <div class="news-title">
            <a :href="information.link" target="_blank" rel="noopener noreferrer">
              <strong>{{ information.title }}</strong>
            </a>
          </div>

          <!-- 앞부분 100글자만 회색으로 표시 -->
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

export default {
  data() {
    return {
      searchQuery: "",
      news: [],
    };
  },

  methods: {
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
  }
};
</script>

<style scoped>
/* 전체 레이아웃 정리 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 2px solid #ddd;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-bar input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
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
}

.search-button:hover,
.clear-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.search-button:active,
.clear-button:active {
  transform: scale(0.9);
}

input {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
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
  color: #000000; /* 노란색 */
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

</style>
