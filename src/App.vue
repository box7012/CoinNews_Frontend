<template>
  <div id="app">
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
  min-height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열로 구성 */
  grid-gap: 20px;
  width: 80%;
}

.frame-item {
  padding: 10px;
}
</style>