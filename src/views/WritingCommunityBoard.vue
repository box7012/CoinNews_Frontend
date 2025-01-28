<template>
  <div>
    <h2>게시글 작성</h2>
    <form @submit.prevent="saveOpinion">
      <div>
        <label for="title">제목:</label>
        <input v-model="newPost.title" id="title" required />
      </div>
      <div>
        <label for="text">내용:</label>
        <textarea v-model="newPost.text" id="text" rows="5" required></textarea>
      </div>
      <button type="submit">저장</button>
      <button type="button" @click="backToCommunityBoard">취소</button>
    </form>
  </div>
</template>

<script>

import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      newPost: {
        email: '',
        title: '',
        text: '',
        create_date: '',
      },
      posts: []
    };
  },
  methods: {

    backToCommunityBoard() {
        // this.$router.push("/");
        this.$router.go(-1); 
    },

    async saveOpinion() {
      try {
        // 로컬 스토리지에서 인증 토큰 가져오기
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          alert("로그인이 필요합니다!");
          return;
        }

        // Post 요청 전송
        const response = await axios.post(
          "/api/posts",
          {
            email: this.newPost.email, // 작성자 이메일
            title: this.newPost.title, // 제목
            text: this.newPost.text,   // 내용
            create_date: new Date().toISOString(), // 생성 날짜
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 토큰 헤더 추가
              "Content-Type": "application/json",
            },
          }
        );

        // 성공 시 처리
        console.log("저장 완료:", response.data);
        alert("저장이 완료되었습니다!");
        this.newPost = {
          email: '',
          title: '',
          text: '',
          create_date: '',
        };
        this.backToCommunityBoard(); // 게시판으로 돌아가기
      } catch (error) {
        console.error("Failed to save Opinion: ", error);
        alert("저장 실패.. 다시 시도해 주세요!");
      }
    },

  },
};
</script>

<style scoped>
.board {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.input, .textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.button:hover {
  background-color: #0056b3;
}
.post-list {
  list-style: none;
  padding: 0;
}
.post-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}
.post-title {
  font-size: 18px;
  margin-bottom: 5px;
}
.post-content {
  font-size: 14px;
  margin-bottom: 10px;
}
.delete-button {
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #a71d2a;
}
</style>
