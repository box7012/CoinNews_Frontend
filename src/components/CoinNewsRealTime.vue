<template>
    <div>
      <div class="header"></div>
  
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
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        news: [],
      };
    },

    computed: {
      ...mapGetters(['getSelectedCoin']), // Vuex에서 선택된 코인 가져오기
    },

    watch: {
      getSelectedCoin: {
        immediate: true,  // 컴포넌트가 처음 마운트될 때도 실행
        handler(newCoin) {
          console.log("new coin selected:", newCoin);
          if (newCoin) {
            this.loadMessages(newCoin);  // 선택된 코인에 맞는 뉴스 가져오기
          } else {
            this.loadMessages();  // 코인이 없으면 기본 뉴스 가져오기
          }
        },
      },
    },
    
    methods: {

        
      async loadMessages(newCoin) {
        try {
          let response;
          
          console.log("📌 loadMessages 실행 | newCoin:", newCoin, "| 타입:", typeof newCoin);

          if (!newCoin) {
            console.log("✅ newCoin이 falsy 값(null, undefined, '')이라 기본 뉴스 호출");
            response = await axios.get('/api/news');
          } else {
            console.log("🔍 newCoin으로 검색 실행:", newCoin);
            response = await axios.post('/api/news/search', {
              query: newCoin,
            });
          }
          
          this.news = response.data.slice(-5);
        } catch (error) {
          console.error("❌ Failed to load Messages: ", error);
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
          hour12: false, // 24시간 포맷 사용
        }).replace(',', '').replace('/', '-').replace('/', '-');
      },
    },
  
    mounted() {
      this.startmessagePolling();
    }
  };
  </script>
  
  <style scoped>
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
  