<template>
  <div class="header">
    <h1>Welcome!</h1>
    <div class="button-container">
      <nav>
        <span v-if="user" class="welcome-msg">{{ user.email }}님, 환영합니다!</span>
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
      console.log("로그인 성공, 사용자 정보:", user);
      this.user = user; // 로그인한 사용자 정보 저장
    },

    logout() {
      console.log("로그아웃 실행");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      this.user = null;
    },
  },

  mounted() {
    const user = localStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user); // localStorage에서 사용자 정보 불러오기
    }
  }
}
</script>

<style scoped>
/* 헤더 스타일 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #2c3e50;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

/* 로그인 버튼 스타일 */
.login-btn {
  padding: 12px 25px;
  border: 2px solid transparent;
  border-radius: 6px;
  background-color: #3498db;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-btn:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

/* 로그인/환영 메시지 */
.welcome-msg {
  font-size: 16px;
  color: #ecf0f1;
  font-weight: 500;
  margin-right: 20px;
}

/* 버튼 컨테이너 스타일 */
.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button-container button {
  margin-left: 15px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header h1 {
    margin-bottom: 10px;
  }

  .button-container {
    width: 100%;
    justify-content: flex-start;
  }

  .button-container button {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
