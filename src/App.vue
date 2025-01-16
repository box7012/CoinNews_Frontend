<template>
  <div id="app">
    <div class="sign-in-up">5</div>
    <div class="grid">
      <div class="frame-item">
        <CoinNewsVue />
      </div>
      <div class="frame-item">
        <CoinNewsVue />
      </div>
      <div class="frame-item">
        <CoinNewsVue />
      </div>
      <div class="frame-item">
        <CoinNewsVue />
      </div>
    </div>
  </div>
</template>

<script>
import CoinNewsVue from './components/CoinNews.vue';


export default {
  name: 'App',
  components: {
    CoinNewsVue,
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 1h;
  padding: 0 10px;
  box-sizing: border-box; /* 패딩이 콘텐츠 크기에 포함되도록 설정 */
  max-height: 1300px;
  max-width: 1180px; /* 최대 너비 제한 */
  width:100%; /* 전체 너비의 90%로 설정 */
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열 레이아웃 */
  grid-gap: 5px; /* 항목 간격 */
  width: 100%; /* 그리드의 너비를 부모와 맞추기 */
  height: 100%;
}

.frame-item {
  position: relative;
  display: flex; /* 자식 요소의 정렬 조정 */
  justify-content: flex-start; /* 수평 방향: 왼쪽 정렬 */
  align-items: flex-start; /* 수직 방향: 위쪽 정렬 */
  padding: 10px;
  border: 1px solid #ccc; /* 확인용 테두리 */
  border-radius: 10px;
  height: 50vh; /* 화면 너비의 26%로 높이 설정 */
  min-height: 350px;
  max-height: 450px;
  width: 50vw; /* 화면 너비의 32%로 너비 설정 */
  max-width: 550px; /* 최대 너비 제한 */
  min-width: 400px; /* 최소 너비 제한 */
}

/* sign-in-up 스타일 추가 */
.sign-in-up {
  position: absolute; /* 화면 내에서 자유롭게 위치 지정 */
  top: 10px; /* 화면 위쪽으로부터 10px 떨어짐 */
  right: 10px; /* 화면 오른쪽으로부터 10px 떨어짐 */
  font-size: 1.2rem; /* 텍스트 크기 */
  color: black; /* 텍스트 색상 */
}
</style>