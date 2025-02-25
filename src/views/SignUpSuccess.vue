<template>
    <div class="signup-success">
      <h2>회원가입에 성공했습니다! 🎉</h2>
      <p>이제 모든 기능을 이용할 수 있어요!</p>
      <button @click="goMain" class="main-btn">메인 화면으로</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goMain() {
        this.$router.push("/"); // 메인 화면으로 이동
      }
    }
  };
  </script>
  
  <style scoped>
  .signup-success {
    text-align: center;
    padding: 50px;
    border: 2px solid #a5a5a5;
    border-radius: 10px;
    background-color: #f0f8ff;
    width: 430px;
    margin: 100px auto;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #007bff;
  }
  
  p {
    margin-bottom: 20px;
  }
  
  .main-btn {
    padding: 10px 20px;
    background-color: #676d62;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .main-btn:hover {
    background-color: #0056b3;
  }
  </style>
  