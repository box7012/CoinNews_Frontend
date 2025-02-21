<template>
    <div>
      <div class="header">
        <h1>뉴스 스크랩</h1>
        <div class="search-bar">
          <input v-model="searchQuery" placeholder="검색어를 입력하세요" />
          <button @click="searchNews">검색</button>
          <button @click="deleteSearchQuery">x</button>
        </div>
      </div>
      <ul class="news-list">
        <li v-for="information in news" :key="information.id">
          <a :href="information.link" target="_blank" rel="noopener noreferrer">
            {{ information.id }} - {{ information.title }}
          </a>
        </li>
      </ul>
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

    watch: {
      isDarkMode(newValue) {
        const appElement = document.querySelector('#app');
        const bodyElement = document.body;
        if (newValue) {
          appElement.classList.add('dark');
          bodyElement.classList.add('dark');
        } else {
          appElement.classList.remove('dark');
          bodyElement.classList.remove('dark');
        }
      },
    },

    computed: {
      ...mapState(['isDarkMode']), // Vuex 상태 매핑
    },

    methods: {

      ...mapActions(['toggleDarkMode']), // Vuex 액션 매핑

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
            this.news = response.data.slice(-5);
          }
        } catch (error) {
          console.error("Failed to load Messages: ", error);
        }
      },
  
      startmessagePolling() {
        this.loadMessages();
        setInterval(this.loadMessages, 10000); // 10초
      }
    },
  
    mounted() {
      this.startmessagePolling();
      const darkMode = localStorage.getItem('darkMode') === 'true';
      this.$store.dispatch('updateDarkMode', darkMode); // 초기 다크 모드 상태 설정
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

    /* 다크 모드 스타일 */
.dark .news-list {
  color: #ffffff; /* 글자 색을 흰색으로 변경 */
}

.dark .news-list li {
  background-color: #2c2c2c; /* 항목 배경을 어두운 색으로 변경 */
  color: #ffffff; /* 글자 색을 흰색으로 변경 */
}

.dark .header {
  background-color: #1b1b1b; /* 헤더 배경을 어두운 색으로 변경 */
  color: #ffffff; /* 글자 색을 흰색으로 변경 */
}

.dark h1 {
  color: #4C91F1; /* 제목 색상 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* 어두운 배경에서 글씨를 더 돋보이게 */
}

.dark .search-bar input {
  background-color: #333333; /* 입력 필드 배경을 어두운 색으로 변경 */
  color: #ffffff; /* 입력 필드 글자 색을 흰색으로 변경 */
  border: 1px solid #444444; /* 입력 필드 테두리 색 변경 */
}

.dark .search-bar button {
  background-color: #4C91F1; /* 버튼 색상을 유지 */
  color: white;
}

.dark .search-bar button:hover {
  background-color: #3b7cd7;
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3); /* 그림자 효과 강화 */
}

.dark .search-bar button:active {
  transform: translateY(2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* 클릭 시 그림자 효과 강화 */
}

  </style>
  