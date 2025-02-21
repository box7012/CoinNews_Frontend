<template>
  <div class="container">
    <div class="post-card">
      <h1 class="title">{{ post.title }}</h1>
      <div class="post-info">
        <span class="author">✍️ {{ post.email }}</span>
        <span class="date">📅 {{ post.createdDate }}</span>
        <span class="views">👀 {{ post.views }}</span>
      </div>
      <p class="content">{{ post.text }}</p>
    </div>

    <!-- 댓글 목록 -->
    <div class="comments-section">
      <h3>💬 댓글</h3>
      <ul v-if="comments.length">
        <li v-for="comment in comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <strong>{{ comment.email }}</strong>
            <span class="comment-date">{{ comment.createdAt }}</span>
          </div>
          <p class="comment-text">{{ comment.text }}</p>
        </li>
      </ul>
      <p v-else class="no-comments">아직 댓글이 없습니다. 첫 댓글을 남겨보세요! ✨</p>
    </div>

    <!-- 댓글 입력 폼 -->
    <div class="comment-form">
      <h3>✏️ 댓글 작성</h3>
      <textarea v-model="newComment.text" placeholder="댓글을 입력하세요..." class="textarea"></textarea>
      <button @click="submitComment" class="button">작성하기</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapState } from 'vuex';

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

  created() {
    const postId = this.$route.params.id;
    this.fetchPost(postId);
    this.fetchComments(postId);
  },

  computed: {
    ...mapState(['isDarkMode']), // Vuex 상태 매핑
  }, 

  methods: {

    ...mapActions(['toggleDarkMode']),

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
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  border-radius: 15px;
}

/* 게시글 카드 */
.post-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 30px;
  width: 800px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: left;
}

.post-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
  color: #777;
}

.content {
  padding-top: 30px;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  text-align: left;
}

/* 댓글 섹션 */
.comments-section {
  margin-top: 30px;
}

/* 댓글 섹션 */
.comments-section ul {
  list-style-type: none;
  text-align: left;
  padding: 0;
  margin: 0;
}

.comments-section li {
  text-align: left;
}


.comments-section h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
  text-align: left;
}

.comment {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  border-left: 5px solid #007bff;
  transition: all 0.2s ease;
  text-align: left;
}

.comment:hover {
  background: #eef4ff;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  color: #0056b3;
}

.comment-date {
  font-size: 12px;
  color: #999;
}

.comment-text {
  margin-top: 2px;
  font-size: 14px;
  color: #333;
  text-align: left;
  margin: 3px;
}

.no-comments {
  font-size: 14px;
  color: #777;
  text-align: center;
  padding: 15px;
}

/* 댓글 작성 폼 */
.comment-form {
  margin-top: 30px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 800px;
}

.comment-form .textarea {
  height: 100px;
  resize: none;
}

.comment-form h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
  text-align: left;
}

.textarea {
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  resize: vertical;
  transition: border 0.3s ease;
}

.textarea:focus {
  border-color: #007bff;
  outline: none;
}

.button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  font-weight: bold;
}

.button:hover {
  background: linear-gradient(45deg, #0056b3, #003d82);
}


/* 다크 모드 */
.dark {
  background: #121212;
  color: #e0e0e0;
}

.dark .container {
  background: #1e1e1e;
}

.dark .post-card {
  background: #242424;
  color: #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dark .title {
  color: #ffffff;
}

.dark .post-info {
  color: #b0b0b0;
}

.dark .content {
  color: #d0d0d0;
}

.dark .comments-section h3 {
  color: #ffffff;
}

.dark .comment {
  background: #2a2a2a;
  border-left: 5px solid #409eff;
}

.dark .comment:hover {
  background: #333;
}

.dark .comment-header {
  color: #409eff;
}

.dark .comment-date {
  color: #888;
}

.dark .comment-text {
  color: #e0e0e0;
}

.dark .no-comments {
  color: #aaa;
}

.dark .comment-form {
  background: #1e1e1e;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
  color: #0056b3;
}

.dark .comment-form h3 {
  color: #f1f1f1;
}

.dark .textarea {
  background: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #444;
}

.dark .textarea:focus {
  border-color: #409eff;
}

.dark .button {
  background: linear-gradient(45deg, #409eff, #3072c4);
}

.dark .button:hover {
  background: linear-gradient(45deg, #3072c4, #205a9e);
}

</style>
