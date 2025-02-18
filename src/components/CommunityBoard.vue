<template>
  <div class="board-container">
    <div class="board">
      <h1 class="title">게시판 1</h1>

      <table class="post-table">
        <thead>
          <tr>
            <th class="col-id">순번</th>
            <th class="col-title">제목</th>
            <th class="col-author">등록자명</th>
            <th class="col-date">등록일자</th>
            <th class="col-action">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.id }}</td>
            <td>
              <a href="#" @click.prevent="viewPost(post)" class="post-link">{{ post.title }}</a>
            </td>
            <td>{{ post.email }}</td>
            <td>{{ formatDate(post.createdDate) }}</td>
            <td>
              <button @click="deletePost(post.id)" class="delete-button">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button @click="goToWritePage" class="write-button">글쓰기</button>
    </div>

    <div class="board">
      <div class="chat-container">
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
  </div>

  <!-- 게시글 상세 보기 모달 -->
  <div v-if="selectedPost" class="modal">
    <div class="modal-content">
      <h2>{{ selectedPost.title }}</h2>
      <p>{{ selectedPost.content }}</p>
      <button @click="selectedPost = null" class="close-button">닫기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {

      // 일반 게시판
      posts: [],
      selectedPost: null,

      // 웹 소켓 + 카프카 이용한 실시간 채팅용
      socket: null,
      message: "",
      messages: []

    };
  },
  methods: {
    goToWritePage() {
      this.$router.push("/writepage");
    },

    async loadPosts() {
      try {
        const response = await axios.get("/api/posts");
        this.posts = response.data;
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    },

    async deletePost(postId) {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      try {
        await axios.delete(`/api/posts/${postId}`);
        this.posts = this.posts.filter(post => post.id !== postId);
      } catch (error) {
        console.error("Failed to delete post:", error);
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

  }
};
</script>

<style scoped>
.board-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 800px;
}

.board:first-child {
  width: 70%;
}

.board:last-child {
  width: 30%;
}

.board {
  width: 48%;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

/* 테이블 스타일 */
.post-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.post-table th, .post-table td {
  padding: 16px;
  border: 1px solid #f2f2f2;
  text-align: center;
  font-size: 16px;
}

.post-table th {
  background-color: #f8f8f8;
  color: #555;
}

.col-id { width: 10%; }
.col-title { width: 40%; }
.col-author { width: 20%; }
.col-date { width: 20%; }
.col-action { width: 10%; }

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
  display: block;
  width: 100%;
  padding: 14px;
  margin-top: 30px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.write-button:hover {
  background-color: #218838;
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  height: 300px;
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

</style>
