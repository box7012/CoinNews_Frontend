<template>
  <div>
    <h2>게시글 작성</h2>
    <form @submit.prevent="saveOpinion">
      <div>
        <label for="title" aria-placeholder="제목을 입력 해주세요">제목:</label>
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
import axios from "axios";

export default {
  data() {
    return {
      newPost: {
        email: "", // 로그인 사용자 이메일
        title: "",
        text: "",
        create_date: "",
      },
      posts: [],
    };
  },
  mounted() {
    // 컴포넌트가 마운트될 때 로그인 사용자 이메일 설정
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      this.newPost.email = user.email; // 이메일 필드에 자동 추가
    }
  },
  methods: {
    backToCommunityBoard() {
      this.$router.go(-1); // 이전 페이지로 이동
    },

    async saveOpinion() {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          alert("로그인이 필요합니다!");
          return;
        }

        if (!this.newPost.text.trim()) {
          alert("내용을 입력해주세요.");
          return;
        }

        // Post 요청 전송
        const response = await axios.post(
          "/api/posts",
          {
            email: this.newPost.email, // 로그인 사용자 이메일
            title: this.newPost.title, // 제목
            text: this.newPost.text, // 내용
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
          email: this.newPost.email, // 이메일은 유지
          title: "",
          text: "",
          create_date: "",
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
