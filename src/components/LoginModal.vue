<template>
    <div v-if="show" class="modal-backdrop">
      <div class="modal">
        <h2>로그인</h2>
        <form @submit.prevent="login">
          <div>
            <label for="username">아이디</label>
            <input v-model="username" type="text" id="username" required />
          </div>
          <div>
            <label for="password">비밀번호</label>
            <input v-model="password" type="password" id="password" required />
          </div>
          <button type="submit">로그인</button>
          <button @click="closeModal" type="button">닫기</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: Boolean,
    },
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      login() {
        alert('로그인 성공!');
        this.$emit('close');
      },
      closeModal() {
        this.$emit('close');
      },
    },
  };
  </script>
  
<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center;    /* 수직 중앙 정렬 */
    z-index: 1000;
  }
  
  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
    text-align: center;
  }

</style>
  