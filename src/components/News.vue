<template>
  <div class="news-container">
    <h1>뉴스 목록</h1>
    <ul v-if="news.length > 0">
      <li v-for="(item, index) in news" :key="index">
        <h2>{{ item.title }}</h2>
        <p>{{ item.content }}</p>
      </li>
    </ul>
    <p v-else>로딩 중...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'News',
  data() {
    return {
      news: [], // 뉴스 데이터를 저장
    };
  },
  async created() {
    try {
      const response = await axios.post('http://180.83.251.5:8080/api/messages');
      this.news = response.data; // 서버에서 받아온 데이터를 news에 저장
    } catch (error) {
      console.error('뉴스 데이터를 불러오는 중 오류 발생:', error);
    }
  },
};
</script>

<style scoped>
.news-container {
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

p {
  font-size: 1rem;
  color: #555;
}
</style>
