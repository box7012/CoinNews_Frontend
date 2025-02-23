<template>
  <div :class="{'dark': isDarkMode}" id="app">
    <Header @toggle-dark-mode="toggleDarkMode" />
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapState(['isDarkMode']) // Vuex에서 다크모드 상태를 가져옴
  },
  methods: {
    ...mapActions(['toggleDarkMode']) // 다크모드 토글 메소드
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center; /* 가로 중앙 정렬 */
  min-height: 100vh;
}


.content {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  /* align-items: center; 세로 중앙 정렬 */
  width: 100%;
  max-width: 1400px;
  padding: 20px;
  box-sizing: border-box;
  flex-grow: 1; /* 남은 공간을 채우도록 설정 */
  margin-top: 360px;
}

.footer {
  position: relative;
  width: 100%;
  margin-top: 40px;
  background-color: #444444; /* 푸터 배경색 */
  padding: 20px;
  text-align: center;
  border-top: 1px solid #797979; /* 상단 테두리 */
}


/* 다크모드 스타일 */
.dark {
  background-color: #121212;
  color: #ffffff;
}
</style>