<template>
    <div v-if="show" class="modal-backdrop">
      <div class="modal">
        <h2>로그인</h2>
        <form @submit.prevent="login">
          <div>
            <label for="username">아이디</label>
            <input v-model="username" type="text" id="username" required />
          </div>
          <div>
            <label for="password">비밀번호</label>
            <input v-model="password" type="password" id="password" required />
          </div>
          <button type="submit">로그인</button>
          <button @click="goToSignUp" type="button"  class="signup-btn">회원가입</button>
          <button @click="closeModal" type="button">닫기</button>
        </form>
      </div>
    </div>
    
  </template>
  
<script>

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
            route
        };
    },

    methods: {
      async login() {
        const email = this.email;
        const password = this.password;

        try {
          const response = await axios.post("http://localhost:8080/auth/login",
            email,
            password
          )

          localStorage.setItem("authToken", response.data.token);
          alert('로그인 성공!');
          this.$emit('close');
          this.$route.push('/')

        } catch (error) {
          console.error("Failed to send Login Information: ", error);
          alert('로그인 실패.. 다시 시도해주세요.');
        }
      },

      closeModal() {
        this.$emit('close');
      },
      goToSignUp() {
        // window.location.href = "/signup"; //페이지 리로드
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
  