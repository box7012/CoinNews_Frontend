<template>
  <div class="board">
    <h1 class="title">게시판</h1>

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

    <!-- 게시글 상세 보기 -->
    <div v-if="selectedPost" class="modal">
      <div class="modal-content">
        <h2>{{ selectedPost.title }}</h2>
        <p>{{ selectedPost.content }}</p>
        <button @click="selectedPost = null" class="close-button">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      posts: [],
      selectedPost: null
    };
  },
  methods: {

    goToWritePage() {
      console.log("뭐지");
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
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    }
  },
  mounted() {
    this.loadPosts();
  }
};
</script>

<style scoped>
.board {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

/* 테이블 스타일 */
.post-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.post-table th, .post-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.post-table th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.col-id { width: 10%; }
.col-title { width: 40%; }
.col-author { width: 20%; }
.col-date { width: 20%; }
.col-action { width: 10%; }

.post-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.post-link:hover {
  text-decoration: underline;
}

.delete-button {
  padding: 6px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #a71d2a;
}

/* 글쓰기 버튼 */
.write-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
  margin-top: 20px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #0056b3;
}
</style>
