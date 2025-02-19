<template>
    <div class="container">
      <div class="post-card">
        <h1 class="title">{{ post.title }}</h1>
        <div class="post-info">
          <span class="author">작성자: {{ post.email }}</span>
          <span class="date">작성일: {{ post.createdDate }}</span>
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
            <p>{{ comment.createdAt }}</p>
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
          console.log(this.comments);
        } catch (error) {
          console.error("댓글을 불러오는 중 오류 발생:", error);
        }
      },

      async submitComment() {
        // 로그인 여부 확인
        const authToken = localStorage.getItem('authToken'); // 로그인 토큰
        const user = localStorage.getItem('user'); // 로그인된 사용자 ID
        const email = JSON.parse(user).email;

        if (!authToken || !email) {
            alert("로그인 해주세요.");
            return;
        }

        // 댓글 내용 확인
        if (!this.newComment.text) {
            console.log(this.newComment)
            alert("내용을 입력하세요.");
            return;
        }

        console.log(this.newComment);

        try {
            const response = await axios.post(`http://localhost:8080/api/posts/${this.$route.params.id}/comments`, {
                email: email, // 사용자 ID 추가
                text: this.newComment.text
            }, {
            headers: {
                'Authorization': `Bearer ${authToken}` // 로그인 토큰을 헤더에 포함
            }
            });

            this.comments.push(response.data);
            this.newComment.content = ''; // 댓글 내용 초기화
            // 화면 새로고침하기.. 굳이 싶긴하다..
        } catch (error) {
            console.error("댓글을 저장하는 중 오류 발생:", error);
        }
      },

    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .post-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .title {
    font-size: 24px;
    margin-bottom: 10px;
  }
  .post-info {
    display: flex;
    justify-content: space-between;
    color: #666;
    font-size: 14px;
  }
  .content {
    margin-top: 10px;
    font-size: 16px;
  }
  .comments-section {
    margin-top: 20px;
  }
  .comment {
    background: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .comment-form {
    margin-top: 20px;
  }
  .input, .textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .button {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .button:hover {
    background: #0056b3;
  }
  </style>
  