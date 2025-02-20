<template>
  <div class="container">
    <div class="post-card">
      <h1 class="title">{{ post.title }}</h1>
      <div class="post-info">
        <span class="author">작성자: {{ post.email }}</span>
        <span class="date">작성일: {{ post.createdDate }}</span>
        <span class="views">조회수: {{ post.views }}</span>
      </div>
      <p class="content">{{ post.text }}</p>
    </div>

    <!-- 댓글 목록 -->
    <div class="comments-section">
      <h3>댓글</h3>
      <ul v-if="comments.length">
        <li v-for="comment in comments" :key="comment.id" class="comment">
          <strong>{{ comment.email }}</strong>
          <p>{{ comment.text }}</p>
          <p class="comment-date">{{ comment.createdAt }}</p>
        </li>
      </ul>
      <p v-else>댓글이 없습니다.</p>
    </div>

    <!-- 댓글 입력 폼 -->
    <div class="comment-form">
      <h3>댓글 달기</h3>
      <textarea v-model="newComment.text" placeholder="댓글 입력..." class="textarea"></textarea>
      <button @click="submitComment" class="button">댓글 작성</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      post: {},
      comments: [],
      newComment: {
        text: ''
      }
    };
  },
  created() {
    const postId = this.$route.params.id;
    this.fetchPost(postId);
    this.fetchComments(postId);
  },
  methods: {
    async fetchPost(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        this.post = response.data;
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
      }
    },

    async fetchComments(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
        this.comments = response.data;
      } catch (error) {
        console.error("댓글을 불러오는 중 오류 발생:", error);
      }
    },

    async submitComment() {
      const authToken = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      const email = JSON.parse(user).email;

      if (!authToken || !email) {
        alert("로그인 해주세요.");
        return;
      }

      if (!this.newComment.text) {
        alert("내용을 입력하세요.");
        return;
      }

      try {
        const response = await axios.post(`http://localhost:8080/api/posts/${this.$route.params.id}/comments`, {
          email: email,
          text: this.newComment.text
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        this.comments.push(response.data);
        this.newComment.text = ''; // 댓글 내용 초기화
      } catch (error) {
        console.error("댓글을 저장하는 중 오류 발생:", error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.post-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
}

.post-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}

.post-info span {
  margin-right: 15px;
}

.content {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
}

.comments-section {
  margin-top: 30px;
}

.comments-section h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.comment {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 10px;
  border-left: 4px solid #007bff;
}

.comment strong {
  font-size: 0.95rem;
  color: #007bff;
}

.comment p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #555;
}

.comment-date {
  font-size: 0.8rem;
  color: #999;
}

.comment-form {
  margin-top: 30px;
}

.comment-form h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  resize: vertical;
}

.button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .post-info {
    flex-direction: column;
  }

  .post-info span {
    margin-bottom: 5px;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>