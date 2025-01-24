<template>
  <div>
    <div class="header">
      <h1>뉴스</h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="검색어를 입력하세요" />
        <button @click="searchNews">검색</button>
        <button @click="deleteSearchQuery">x</button>
      </div>
    </div>

    <table class="news-table">
      <thead>
        <tr>
          <th>선택</th>
          <th>제목</th>
          <th>날짜</th>
          <th>링크</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="information in news" :key="information.id">
          <td><input type="checkbox" :value="information.id" v-model="selectedIds" /></td>
          <td class="title-column">{{ information.title }}</td>
          <td class="date-column">{{ formatDate(information.date) }}</td>
          <td class="link-column"><a :href="information.link" target="_blank" rel="noopener noreferrer">링크</a>
          </td>
        </tr>
      </tbody>
    </table>
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

        // const response = await axios.post("https://coin-dashboard.xyz/api/news/search", {
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
          this.news = response.data.slice(-5);
        }
      } catch (error) {
        console.error("Failed to load Messages: ", error);
      }
    },

    startmessagePolling() {
      this.loadMessages();
      setInterval(this.loadMessages, 10000); // 10초
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

  .news-list {
    list-style-type: none; /* 기본 점 기호 제거 */
    padding-left: 0; /* 기본 여백 제거 */
    text-align: left; /* 왼쪽 정렬 */
  }

  .news-list li {
    margin-bottom: 10px; /* 항목 간격 */
  }

  /* 전체 컨테이너 */
  .header {
    display: flex; /* 수평 정렬 */
    justify-content: space-between; /* 양 끝 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    width: 100%; /* 부모의 너비에 맞게 */
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #4C91F1;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
  }

  /* 검색 바 스타일 */
  .search-bar {
    position: absolute;
    right: 10px;
    display: flex; /* 수평 정렬 */
    justify-content: flex-end; /* 오른쪽 정렬 */
    align-items: center; /* 버튼과 입력 필드 높이 정렬 */
    gap: 8px; /* 입력 필드와 버튼 사이 간격 */
  }

  input {
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1; /* 입력 필드가 늘어나도록 */
  }

  button {
    background-color: #4C91F1;
    color: white;
    border: none;
    padding: 2px 8px;
    font-size: 1.1rem;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    line-height: normal;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
  }

  button:hover {
    background-color: #3b7cd7;
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
  }

  button:active {
    transform: translateY(2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .news-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.news-table th,
.news-table td {
  padding: 5px;
  text-align: center;
  border: 1px solid #ddd;
}

.news-table th {
  background-color: #f4f4f4;
}

.news-table td a {
  color: #007bff;
  text-decoration: none;
}

.news-table td a:hover {
  text-decoration: underline;
}

.news-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.news-table tbody tr:hover {
  background-color: #f1f1f1;
}


.select-column {
  width: 10%; /* 선택 열 폭 조정 */
}

.title-column {
  width: 60%; /* 제목 열 폭 조정 */
}

.date-column {
  width: 20%; /* 날짜 열 폭 조정 */
}

.link-column {
  width: 10%; /* 링크 열 폭 조정 */
}


</style>
