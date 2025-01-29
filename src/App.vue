<template>
  <div class="header">
    <h1>Welcome!</h1>
    <div class="button-container">
      <nav>
        <span v-if="user">{{ user.email }}님, 환영합니다!</span>
        <button v-if="!user" class="login-btn" @click="showLoginModal = true">로그인</button>
        <button v-if="user" class="login-btn" @click="logout">로그아웃</button>
      </nav>
    </div>
  </div>
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

.header {
  display: flex;
  justify-content: space-between; /* 왼쪽 끝과 오른쪽 끝 배치 */
  align-items: center; /* 수직 중앙 정렬 */
  padding: 10px 20px; /* 상하좌우 여백 */
}

.header h1 {
  color: #132633;
  margin: 0px 10px;
}


/* 로그인 버튼 스타일 */
.login-btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgb(59, 175, 211);
  cursor: pointer;
}

.login-btn:hover {
  background-color: #007bff;
  color: white;
}

/* 버튼을 오른쪽으로 정렬 */
.button-container {
  padding: 10px 0px;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin-top: 10px; /* 상단 여백 */
}



</style>