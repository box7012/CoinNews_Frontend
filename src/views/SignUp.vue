<template>
    <div class="signup">
      <h1>회원가입</h1>
      <form>
        <input type="text" placeholder="아이디" />
        <input type="email" placeholder="이메일" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit">회원가입</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "SignUp",
  };
  </script>
  
  <style scoped>
  .signup {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  </style>