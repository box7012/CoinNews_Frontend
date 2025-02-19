<template>
  <div class="container">
    <h2 class="title">게시글 작성</h2>
    <form @submit.prevent="saveOpinion" class="form">
      <div class="form-group">
        <label for="title">제목</label>
        <input v-model="newPost.title" id="title" required class="input" placeholder="제목을 입력하세요" />
      </div>
      <div class="form-group">
        <label for="text">내용</label>
        <textarea v-model="newPost.text" id="text" rows="5" required class="textarea" placeholder="내용을 입력하세요"></textarea>
      </div>
      <div class="button-group">
        <button type="submit" class="button save-button">저장</button>
        <button type="button" @click="backToCommunityBoard" class="button cancel-button">취소</button>
      </div>
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
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      this.newPost.email = user.email; // 이메일 자동 추가
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

        const response = await axios.post(
          "/api/posts",
          {
            email: this.newPost.email,
            title: this.newPost.title,
            text: this.newPost.text,
            create_date: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("저장 완료:", response.data);
        alert("저장이 완료되었습니다!");
        this.newPost = {
          email: this.newPost.email, // 이메일 유지
          title: "",
          text: "",
          create_date: "",
        };
        this.backToCommunityBoard();
      } catch (error) {
        console.error("Failed to save Opinion: ", error);
        alert("저장 실패.. 다시 시도해 주세요!");
      }
    },
  },
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 제목 스타일 */
.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

/* 폼 그룹 스타일 */
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 입력 필드 스타일 */
.input, .textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input:focus, .textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* 버튼 스타일 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button {
  width: 48%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #a71d2a;
}

.textarea {
  width: 100%;
  height: 150px; /* 원하는 높이로 고정 */
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: none; /* 크기 조정 비활성화 */
  transition: all 0.3s ease;
}

.textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

/* 반응형 스타일 */
@media (max-width: 600px) {
  .container {
    width: 90%;
  }
  
  .button {
    width: 100%;
  }
  
  .button-group {
    flex-direction: column;
    gap: 10px;
  }
}

</style>
