<template>
  <div :class="['news-container', { dark: isDarkMode }]">
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
    ...mapGetters(['getSelectedCoin', 'isDarkMode']), // Vuex에서 선택된 코인 및 다크모드 상태 가져오기
  },

  watch: {
    getSelectedCoin: {
      immediate: true,
      handler(newCoin) {
        if (newCoin) {
          this.loadMessages(newCoin);
        } else {
          this.loadMessages();
        }
      },
    },
    isDarkMode(newMode) {
      // 다크 모드 상태가 변경될 때마다 적용
      const appElement = document.querySelector('#app');
      if (newMode) {
        appElement.classList.add('dark');
      } else {
        appElement.classList.remove('dark');
      }
    },
  },

  methods: {
    async loadMessages(newCoin) {
      try {
        let response;

        if (!newCoin) {
          response = await axios.get('/api/news');
        } else {
          response = await axios.post('/api/news/search', {
            query: newCoin,
          });
        }

        this.news = response.data.slice(-5);
      } catch (error) {
        console.error("❌ Failed to load Messages: ", error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '').replace('/', '-').replace('/', '-');
    },
  },

  mounted() {
    this.loadMessages();
  },
};
</script>

<style scoped>
.news-container {
  display: flex;
  flex-direction: column;
}

.news-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #ffffff; /* 라이트 모드 배경 */
}

.news-time-column {
  width: 150px;
  padding-right: 20px;
  border-right: 2px solid #ddd;
}

.news-time {
  font-size: 14px;
  color: #777;
  text-align: center;
}

.news-details {
  flex: 1;
  padding-left: 15px;
  text-align: left;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  text-align: left;
}

.news-title a {
  color: #000;
  text-decoration: none;
}

.news-title a:hover {
  color: #aa4e4e;
}

.news-preview {
  font-size: 14px;
  color: #6f6f6f;
}

.preview-text {
  font-size: 14px;
  color: #6f6f6f;
  text-align: left;
}

/* 다크 모드 스타일 */
.news-container.dark .news-item {
  background-color: #333; /* 다크 모드 배경 */
}

.news-container.dark .news-time {
  color: #bbb;
}

.news-container.dark .news-title {
  color: #fff;
  text-align: left;
}

.news-container.dark .news-title a {
  color: #fff;
}

.news-container.dark .news-preview {
  color: #aaa;
  text-align: left;
}
</style>
