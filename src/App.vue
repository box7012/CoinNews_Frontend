<template>
  <div :class="['header', { dark: isDarkMode }]">
    <h1>Welcome!</h1>
    <div class="button-container">
      <nav>
        <span v-if="user" class="welcome-msg">{{ user.email }}님, 환영합니다!</span>
        <button v-if="!user" class="login-btn" @click="showLoginModal = true">로그인</button>
        <button v-if="user" class="login-btn" @click="logout">로그아웃</button>
        <button class="toggle-dark-mode" @click="toggleDarkMode">
          {{ isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode' }}
        </button>
      </nav>
    </div>
  </div>
  <router-view></router-view>
  <LoginModal v-if="showLoginModal" :show="showLoginModal" @close="showLoginModal = false" @user-logged-in="handleUserLogin" />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LoginModal from './components/LoginModal.vue';

export default {
  components: { LoginModal },

  data() {
    return {
      showLoginModal: false,
      user: null,
    };
  },

  computed: {
    ...mapState(['isDarkMode'])
  },

  methods: {
    ...mapActions(['toggleDarkMode']),
    
    handleUserLogin(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },

    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      this.user = null;
    },
  },

  mounted() {
    const user = localStorage.getItem("user");
    if (user) this.user = JSON.parse(user);
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background-color: #f8f9fa;
  color: #2c3e50;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header.dark {
  background-color: #2c3e50;
  color: #fff;
}

.login-btn, .toggle-dark-mode {
  padding: 12px 25px;
  border: 2px solid transparent;
  border-radius: 6px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-btn:hover, .toggle-dark-mode:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.welcome-msg {
  font-size: 16px;
  color: inherit;
  font-weight: 500;
  margin-right: 20px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.button-container button {
  margin-left: 15px;
}

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
