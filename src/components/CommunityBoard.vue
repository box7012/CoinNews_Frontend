<template>
  <div class="board-container">
    <div class="top-section">
      <div class="left-section">
        <div class="board small-board">
          <h1 class="title">인기 게시글</h1>
          <div class="top-posts-container">
            <ul class="top-posts-list">
              <li v-for="post in topLeftPosts" :key="post.id">
                <router-link :to="'/post/' + post.id">
                  {{ post.title }}
                </router-link>
              </li>
            </ul>
            <ul class="top-posts-list">
              <li v-for="post in topRightPosts" :key="post.id">
                <router-link :to="'/post/' + post.id">
                  {{ post.title }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="board chat-container">
        <div class="chat-box">
          <div v-for="(msg, index) in messages" :key="index" class="message">
            <div class="message-header">
              <span class="username">{{ msg.user }}</span> <span class="message-time">{{ formatChattingDate(msg.time) }}</span>
            </div>
            <div class="message-content">{{ msg.message }}</div>
          </div>
        </div>
        <input v-model="message" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
      </div>
    </div>

    <div class="board large-board">
      <div class="board-header">
        <h1 class="title">게시글 목록</h1>
        <div class="pagination-controls">
          <label for="postsPerPage">페이지당 게시글 수 : </label>
          <select id="postsPerPage" v-model="postsPerPage" @change="changePostsPerPage">
            <option :value="10">10개</option>
            <option :value="20">20개</option>
            <option :value="50">50개</option>
          </select>
        </div>
      </div>
      <table class="post-table">
        <thead>
          <tr>
            <th class="col-id">순번</th>
            <th class="col-title">제목</th>
            <th class="col-author">등록자명</th>
            <th class="col-date">등록일자</th>
            <th class="col-views">조회수</th>
            <!-- <th class="col-action">삭제</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in paginatedPosts" :key="post.id">
            <td>{{ post.id }}</td>
            <td>
              <router-link :to="'/post/' + post.id" class="post-link">{{ post.title }}</router-link>
            </td>
            <td>{{ post.email }}</td>
            <td>{{ formatDate(post.createdDate) }}</td>
            <td>{{ post.views }}</td>
            <!-- <td>
              <button @click="deletePost(post.id)" class="delete-button">삭제</button>
            </td> -->
          </tr>
        </tbody>
      </table>

      <!-- <div class="pagination">
          <button @click="changePage(page)"
                  v-for="page in totalPages"
                  :key="page"
                  :class="{ active: page === currentPage }">
            {{ page }}
          </button>
      </div> -->

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          &lt; <!-- 이전 페이지 버튼 -->
        </button>

        <button v-for="page in pageRange" :key="page" @click="changePage(page)" :class="{ active: page === currentPage }">
          {{ page }}
        </button>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          &gt; <!-- 다음 페이지 버튼 -->
        </button>
      </div>

      <button @click="goToWritePage" class="write-button">글쓰기</button>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {

      // 일반 게시판
      posts: [],
      selectedPost: null,

      // 웹 소켓 + 카프카 이용한 실시간 채팅용
      socket: null,
      message: "",
      messages: [],

      currentPage: 1,
      postsPerPage: 10,

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

    totalPages() {
      return Math.ceil(this.posts.length / this.postsPerPage);
    },

    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      return this.posts.slice(start, start + this.postsPerPage);
    },

    topLeftPosts() {
      return [...this.posts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    },

    topRightPosts() {
      return [...this.posts]
        .sort((a, b) => b.views - a.views)
        .slice(5, 10);
    },

        // 페이지 범위를 계산하여 10개씩 그룹화
    pageRange() {
      const startPage = Math.floor((this.currentPage - 1) / 10) * 10 + 1;
      const endPage = Math.min(startPage + 9, this.totalPages);

      const range = [];
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      return range;
    },


  },

  methods: {

    ...mapActions(['toggleDarkMode']), // Vuex 액션 매핑

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },

    goToWritePage() {
      this.$router.push("/writepage");
    },

    async loadPosts() {
      try {
        const response = await axios.get("/api/posts");
        this.posts = response.data.reverse();
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    },

    changePage(page) {
      this.currentPage = page;
    },

    changePostsPerPage() {
      this.currentPage = 1;
    },

    async deletePost(postId) {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        const token = localStorage.getItem("authToken"); // 인증 토큰 가져오기
        const user = JSON.parse(localStorage.getItem("user")); // 유저 정보 가져오기

        if (!user || !user.email) {
          alert("로그인이 필요합니다.");
          return;
        }

        await axios.delete(`/api/posts/${postId}?email=${encodeURIComponent(user.email)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.posts = this.posts.filter(post => post.id !== postId);
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert(error.response?.data?.message || "삭제 실패");
      }
    },

    viewPost(post) {
      this.selectedPost = post;
    },

    formatChattingDate(date) {
      const d = new Date(date);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${hours}:${minutes}:${seconds}`;
    },

    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    },

    sendMessage() {
      if (this.message.trim() !== "") {
        const user = localStorage.getItem("user");
        const currentTime = new Date().toISOString();

        const messageData = {
          user: user ? JSON.parse(user).email : "Unknown",
          message: this.message,
          time: currentTime
        }

        console.log(messageData);
        // this.messages.push(messageData);
        this.socket.send(JSON.stringify(messageData));
        this.message = "";
      }
    }

  },
  mounted() {
    this.loadPosts();

    this.socket = new WebSocket("ws://localhost:8080/chat");

    this.socket.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      this.messages.push(parsedMessage);
    };

    const darkMode = localStorage.getItem('darkMode') === 'true';
    this.$store.dispatch('updateDarkMode', darkMode); // 초기 다크 모드 상태 설정
  }
};
</script>

<style scoped>

/* 조회수 top 게시판 */
.top-posts-container {
  display: flex;
  gap: 16px; /* 간격 추가 */
}

.top-posts-list {
  list-style-type: none;
  flex: 1;
  padding: 0;
}

.top-posts-list li:hover {
  transform: translateY(-3px);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.15);
}

.top-posts-list li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  display: block;
}
/* 조회수 top 게시판 */

.board-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 800px;
  margin-top: -150px;
}

.top-section {
  display: flex;
  gap: 20px;
  margin: 0 auto;
  width: 80%;
  min-width: 1020px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%; /* 7 */
  flex-grow: 7;
  min-width: 660px;
}

.chat-container {
  width: 30%; /* 3 */
  min-width: 340px;
  height: 600px;
}

.large-board {
  width: 80%;
  margin: 0 auto; /* 중앙 정렬 */
  max-width: 1520px;
  min-width: 1020px;
}

.small-board {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 600ㅔㅌ;
}

.board {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.post-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.post-table th, .post-table td {
  padding: 4px;
  border: 1px solid #f2f2f2;
  text-align: center;
  font-size: 16px;
}

.post-table th {
  background-color: #f8f8f8;
  color: #555;
}

.post-table tbody td:nth-child(2),
.post-table tbody td:nth-child(3) {
  text-align: left;
}

.col-id { width: 10%; }
.col-title { width: 40%; }
.col-author { width: 20%; }
.col-date { width: 20%; }
.col-views { width: 10%; }

.post-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.post-link:hover {
  text-decoration: underline;
}

.delete-button {
  padding: 8px 12px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #e04e3b;
}

/* 글쓰기 버튼 */
.write-button {
  padding: 10px 20px; /* 패딩을 줄여서 크기 줄이기 */
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; /* 글씨 크기 줄이기 */
  transition: background-color 0.3s;
  float: right; /* 오른쪽 정렬 */
  width: auto; /* 너비 자동 설정 */
}

.write-button:hover {
  background-color: #218838;
}

.close-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: #0056b3;
}
/* 웹소켓 실시간 통신 */
.chat-container {
  width: 300px;
  margin: auto;
  text-align: center;
}

.chat-box {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}
.message {
  text-align: left;
  background: #f1f1f1;
  padding: 5px;
  margin: 5px 0;
}
input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

.message-header {
  font-weight: bold;
  margin-bottom: 5px;
}

.username {
  color: #4CAF50;
  margin-right: 10px;
}

.message-time {
  font-size: 0.8em;
  color: #888;
}

.message-content {
  margin-top: 5px;
  padding-left: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.pagination button {
  margin: 0 4px;
  padding: 3px 7px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 5px;
  color: #000;
}
.pagination button.active {
  background: #f8f8f8;
  color: rgb(0, 0, 0);
  border: 2px solid #000;
}


/* 기존 스타일 유지 */
.top-posts-container {
  display: flex;
  gap: 16px;
}

.top-posts-list {
  list-style-type: none;
  flex: 1;
  padding: 0;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-posts-list li {
  background: #f8f9fa;
  padding: 5px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
}

.top-posts-list li:hover {
  transform: translateY(-3px);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.15);
}

.top-posts-list li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  display: block;
}

/* 나머지 기존 스타일들 */
.board-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 800px;
}

.top-section {
  display: flex;
  gap: 20px;
  margin: 0 auto;
  width: 80%;
  min-width: 1020px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
  min-width: 660px;
}

.chat-container {
  width: 30%;
  min-width: 340px;
  height: 450px;
}

.large-board {
  width: 80%;
  margin: 0 auto;
  max-width: 1520px;
  min-width: 1020px;
}

.board {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.post-table th, .post-table td {
  padding: 4px;
  border: 1px solid #f2f2f2;
  text-align: center;
  font-size: 16px;
}

.post-table th {
  background-color: #f8f8f8;
  color: #555;
}

.post-table tbody td:nth-child(2),
.post-table tbody td:nth-child(3) {
  text-align: left;
}

.col-id { width: 10%; }
.col-title { width: 40%; }
.col-author { width: 20%; }
.col-date { width: 20%; }
.col-views { width: 10%; }

.post-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.post-link:hover {
  text-decoration: underline;
}

.delete-button {
  padding: 8px 12px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #e04e3b;
}

.close-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: #0056b3;
}

.chat-container {
  width: 300px;
  margin: auto;
  text-align: center;
}

.chat-box {
  height: 350px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.message {
  text-align: left;
  background: #f1f1f1;
  padding: 5px;
  margin: 5px 0;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

.message-header {
  font-weight: bold;
  margin-bottom: 5px;
}

.username {
  color: #4CAF50;
  margin-right: 10px;
}

.message-time {
  font-size: 0.8em;
  color: #888;
}

.message-content {
  margin-top: 5px;
  padding-left: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 4px;
  padding: 3px 7px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 5px;
  color: #000;
}

.pagination button.active {
  background: #f8f8f8;
  color: rgb(0, 0, 0);
  border: 2px solid #000;
}

.dark {
  background-color: #121212;
  color: #ffffff;
}

.dark .top-posts-list li{
  background: #3b3b3b; /* 다크 모드에서 연한 회색 배경 */
  color: #ffffff;
  
}

.dark .top-posts-list li a{
  background: #3b3b3b; /* 다크 모드에서 연한 회색 배경 */ 
  color: #d3d3d3;
}

.dark .top-posts-list {
  background: #2a2a2a; /* 다크 모드에서 연한 회색 배경 */ 
}


.dark .top-posts-list li:hover {
  background: #3b3b3b; /* 다크 모드에서 hover 효과 */
  transform: translateY(-3px);
  box-shadow: 4px 4px 10px rgba(255, 255, 255, 0.15);
}

.dark .post-table th {
  background-color: #2e2e2e;
  color: #ddd;
}

.dark .post-table tbody td {
  background-color: #2e2e2e;
  color: #ddd;
}

.dark .post-link {
  color: #56a0ff;
}

.dark .write-button {
  background-color: #4caf50;
  color: white;
}

.dark .write-button:hover {
  background-color: #45a049;
}

.dark .close-button {
  background-color: #007bff;
  color: white;
}

.dark .close-button:hover {
  background-color: #0056b3;
}

.dark .pagination button {
  background: #333;
  color: #fff;
  border: 1px solid #555;
}

.dark .pagination button.active {
  background: #444;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.dark .delete-button {
  background-color: #ff6f61;
  color: white;
}

.dark .delete-button:hover {
  background-color: #e04e3b;
}

.dark .message {
  background: #3e3e3e;
  color: #ffffff;
}

.dark .message-time {
  color: #bbb;
}

/* 게시판 및 실시간 채팅 패널 다크 모드 배경 추가 */
.dark .board-container {
  background-color: #1b1b1b;
}

.dark .top-section {
  background-color: #1b1b1b;
}

.dark .left-section {
  background-color: #1b1b1b;
}

.dark .chat-container {
  background-color: #2a2a2a;
}

.dark .large-board {
  background-color: #2a2a2a;
}

.dark .small-board {
  background-color: #2a2a2a;
  color: #ffffff;
}

.dark .title {
  color: #ffffff;
}

.dark .li {
  color: #ffffff;
}


/* 글쓰기 버튼 */
.write-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px; 
  transition: background-color 0.3s;
  float: right; 
  width: auto; 
}

.write-button:hover {
  background-color: #218838;
}

.small-board {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 450px;
}

.top-posts-list li {
  background: #f8f9fa; /* 연한 회색 배경 */
  padding: 20px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;
  margin: 5px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  color: #333;
}

</style>
