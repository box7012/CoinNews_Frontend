<template>
  <div id="app">
    <div class="grid">
      <div class="frame-item">
        <MessageList />
      </div>
      <div class="frame-item">
        <MessageList />
      </div>
      <div class="frame-item">
        <MessageList />
      </div>
      <div class="frame-item">
        <MessageList />
      </div>
    </div>
  </div>
</template>

<script>
import MessageList from './components/MessageList.vue';

export default {
  name: 'App',
  components: {
    MessageList,
    MessageList,
    MessageList,
    MessageList,
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