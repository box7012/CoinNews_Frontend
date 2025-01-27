<template>
  <nav>
    <span v-if="user">{{ user.email }}님, 환영합니다!</span>
    <button v-if="!user" @click="showLoginModal = true">로그인</button>
    <button v-if="user" @click="logout">로그아웃</button>
  </nav>
  <router-view></router-view>
  <LoginModal v-if="showLoginModal" :show="showLoginModal" @close="showLoginModal = false" @user-logged-in="handleUserLogin" />
</template>




<script>

import LoginModal from './components/LoginModal.vue';

export default {
  components: {
    LoginModal,
  },

  data() {
    return {
      showLoginModal: false,
      user: null,
    }
  },

  methods: {
    handleUserLogin(user) {
      console.log("로그인 성공, 사용자 정보:", user); // 사용자 정보 확인
      this.user = user; // 로그인한 사용자 정보 저장
    },

    logout() {
      console.log("로그아웃 실행");
      localStorage.removeItem("authToken");
      this.user = null;
    },
  },
}




</script>








<style scoped>
/* 로그인 버튼 스타일 */
.login-btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #007bff;
  color: white;
}
</style>