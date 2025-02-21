<template>
  <div :class="{'dark': isDarkMode}" id="app">
    <Header @toggle-dark-mode="toggleDarkMode" />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Header from './components/Header.vue';

export default {
  components: {
    Header
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
  flex-direction: column; /* 자식 요소를 세로로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  height: 100vh;
}

.content {
  max-width: fit-content;
  margin-top: 200px;
  width: 100%; /* 너비를 100%로 설정하여 자식 요소들이 화면에 맞춰지도록 */
  padding: 20px;
  box-sizing: border-box;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */

}
/* 다크모드 스타일 */
.dark {
  background-color: #121212;
  color: #ffffff;
}
</style>