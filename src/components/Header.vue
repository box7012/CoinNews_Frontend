<template>
    <div :class="['header', { dark: isDarkMode }]">
        <h1>Welcome!</h1>
        <div class="menu-bar">
            <div class="tab-menu">
                <button 
                v-for="(tab, index) in tabs" 
                :key="index" 
                :class="{ active: activeTab === tab.route }" 
                @click="changeTab(tab.route)">
                {{ tab.name }}
                </button>
            </div>
        </div>

        <div class="button-container">
            <nav>
                <span v-if="user" class="welcome-msg">{{ user.email }}님, 환영합니다!</span>
                <button v-if="!user" class="login-btn" @click="showLoginModal = true">로그인</button>
                <button v-if="user" class="login-btn" @click="logout">로그아웃</button>
                <button class="toggle-dark-mode" @click="toggleDarkMode">
                {{ isDarkMode ? '☀️' : '🌙' }}
                </button>
            </nav>
        </div>

        <LoginModal v-if="showLoginModal" :show="showLoginModal" @close="showLoginModal = false" @user-logged-in="handleUserLogin" />
    </div>
</template>
  
<script>
import { mapState, mapActions } from "vuex";
import LoginModal from "../components/LoginModal.vue";

export default {
components: { LoginModal },

data() {
    return {
    showLoginModal: false,
    user: null,
    tabs: [
        { name: "Dashboard", route: "/dashboard" },
        { name: "Back Testing", route: "/backtesting" },
        { name: "News", route: "/news" },
        { name: "Community", route: "/community" },
    ],
    };
},

computed: {
    ...mapState(["isDarkMode"]),
    activeTab() {
    return this.$route.path;
    }
},

methods: {
    ...mapActions(["toggleDarkMode"]),

    changeTab(route) {
    this.$router.push(route); // 버튼 클릭 시 페이지 이동
    },

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

    const darkMode = localStorage.getItem("darkMode") === "true";
    this.$store.dispatch("updateDarkMode", darkMode);
},
};
</script>

<style>

.header {
    display: flex;
    justify-content: center; /* 내부 콘텐츠 수평 중앙 정렬 */
    gap: 20px;
    width: 100%;
    /* max-width: 1560px; */
    min-width: 1560px;
    margin: 0 auto;    /* 좌우 여백을 자동으로 줘서 중앙 정렬 */
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: #ffffff; /* light 모드에서 불투명한 배경 설정 */
    padding-top: 25px;
    padding-bottom: 25px;
    height: 100px;
}

.header.dark {
    background-color: #1b1b1b;
    color: #fff;
}

.welcome-msg {
    font-size: 16px;
    color: inherit;
    font-weight: 500;
    margin-right: 20px;
}


.login-btn:hover, .toggle-dark-mode:hover {
    background-color: #ffffff;
    transform: scale(1.05);
}

/* 다크 모드에서 버튼 색상 변경 */
body.dark .login-btn, body.dark .toggle-dark-mode {
    background-color: #444;  /* 다크 모드에서 버튼 배경색 */
    color: #fff;  /* 다크 모드에서 텍스트 색상 */
}

body.dark .login-btn:hover, body.dark .toggle-dark-mode:hover {
    background-color: #666;  /* 다크 모드에서 버튼 hover 시 배경색 */
}

/* 버튼 컨테이너 중앙 정렬 */
.button-container {
    display: flex;
    justify-content: flex-end; /* 수평 중앙 정렬 */
    width: 100%;
    max-width: 1565px;
    margin-right: 30px;
}

.button-container button {
    margin-left: 15px;
    margin-bottom: 0px;
}

.header h1 {
    margin-bottom: 10px;
}


/* #app에 대한 배경색 설정 */
#app {
    background-color: #ffffff; /* 라이트 모드 기본 배경 */
    justify-content: center; 
}

#app.dark {
    background-color: #1b1b1b; /* 다크 모드 배경 */
}

/* body.dark에 대한 배경색과 색상 설정 */
body.dark {
    background-color: #1b1b1b;
    color: #fff;
}


body {
    background-color: #ffffff; /* 라이트 모드 배경색 */
}

.dark {
    color: #ffffff; /* 다크 모드 텍스트 색상 */
}

/* 다크 모드 전환 버튼 */
.login-btn, .toggle-dark-mode {
    padding: 10px 20px;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

/* 메뉴 바 스타일 */
.menu-bar {
    display: flex;
    justify-content: center; /* 메뉴 바의 항목들 중앙 정렬 */
    gap: 20px;
    padding: 0px 25px;
    background-color: #f8f9fa;
}

/* 다크 모드 스타일 */
.dark .menu-bar {
    background-color: #1b1b1b;
    border-bottom: 2px solid #1b1b1b;
}

.dark .grid {
    background-color: #1b1b1b;
}

.dark .frame-item {
    background-color: #1b1b1b;
    color: white;
    border: 1px solid #1b1b1b;
}

/* 탭 메뉴 스타일 */
.tab-menu {
    display: flex;
    flex-direction: row;
    margin-top: 0px;
    gap: 20px;
    flex-wrap: nowrap
}

.tab-menu button {
    padding: 12px 30px;
    border: 2px solid transparent;
    border-radius: 8px;
    background-color: #ffffff;
    color: #999999;
    font-weight: bold;
    font-size: 16px;
    transition: all 0.3s ease;
    cursor: pointer;
    white-space: nowrap;
}

.tab-menu button.active {
    background-color: #ffffff;
    color: #000000;
    border-color: #d1d1d1;
}

/* 다크 모드 탭 스타일 */
.dark .tab-menu button {
    background-color: #2d2d2e;
}

.dark .tab-menu button.active {
    background-color: #747474;
}

.dark .tab-menu button:hover {
    background-color: #555555;
}

/* 그리드 스타일 */
.grid {
    display: grid;
    justify-content: center; /* 수평 중앙 정렬 */
    grid-template-columns: 1fr;
    gap: 20px;
    margin: 30px;
}

.frame-item {
    padding: 25px;
    border-radius: 12px;
    background-color: #ffffff;
    /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #dee2e6;
    max-width: 1565px;
    margin: 0 auto; /* 수평 중앙 정렬 */
    /* min-height: 10px; */
}

.dark .frame-item {
    background-color: #1b1b1b;
    color: white;
    border: 1px solid #363636;
}

</style>
