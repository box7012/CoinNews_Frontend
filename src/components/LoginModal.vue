<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal">
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">아이디</label>
          <input v-model="email" type="text" id="username" required />
        </div>
        <div>
          <label for="password">비밀번호</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit">로그인</button> <!-- submit으로 수정 -->
        <button @click="goToSignUp" type="button" class="signup-btn">회원가입</button>
        <button @click="closeModal" type="button">닫기</button>
      </form>
    </div>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  props: {
    show: Boolean,
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
    };
  },

  setup() {
    const route = useRoute();
    return {
      route,
    };
  },

  methods: {
    async login() {
      const { email, password } = this;

      try {
        const response = await axios.post("/auth/login", {
          email: email,
          password: password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const token = response.data;  // 응답에서 직접 토큰을 받음
        if (!token) {
          throw new Error("토큰이 응답에 포함되지 않았습니다.");
        }

        // 'Bearer '를 제거한 후 토큰을 디코딩
        const cleanedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decodedToken = VueJwtDecode.decode(cleanedToken); // JWT 토큰을 디코딩
        console.log("Decoded Token:", decodedToken); // 디코딩된 내용 확인

        const user = { email: decodedToken.sub }; // 사용자 정보 생성
        localStorage.setItem("authToken", token); // JWT 토큰만 저장
        this.$emit('user-logged-in', user); // 부모 컴포넌트로 사용자 정보 전달

        alert('로그인 성공!');
        this.$emit('close'); // 로그인 성공 후 모달 닫기

      } catch (error) {
        console.error("Failed to send Login Information: ", error);
        alert('로그인 실패.. 다시 시도해주세요.');
      }
    },

    closeModal() {
      this.$emit('close');
    },

    goToSignUp() {
      this.$router.push("/signup"); // 회원가입 페이지로 이동
      this.$emit("close"); // 로그인 모달 닫기
    },
  },
};
</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center;    /* 수직 중앙 정렬 */
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}
</style>
