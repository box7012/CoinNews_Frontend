<template>
  <div class="app-container">
    <Header />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from './components/header.vue';

export default {
  components: {
    Header
  }
}
</script>

<style>
/* 전체 화면을 중앙 정렬 */
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100%; */
  /* min-height: 100vh; */
}

/* 내용 부분 정렬 */
.content {
  margin-top: 20px; /* 헤더와 간격 */
}
</style>