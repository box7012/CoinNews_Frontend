<template>
  <div class="signup">
    <h1>회원가입</h1>
    <form @submit.prevent="handleSignup">
      <input type="email" v-model="email" placeholder="이메일" />

      <input type="password" v-model="password" placeholder="비밀번호" />
      <input type="password" v-model="password_check"  placeholder="비밀번호 확인"  @input="validatePassword" />
      
      <!-- 비밀번호 불일치 메시지 -->
      <p v-if="passwordError" class="error">{{ passwordError }}</p>

      <button type="submit" :disabled="passwordError">회원가입</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      password_check: '',
      passwordError: '', // 비밀번호 불일치 메시지 저장
    };
  },
  methods: {
    validatePassword() {
      if (this.password !== this.password_check) {
        this.passwordError = '비밀번호가 다릅니다.';
      } else {
        this.passwordError = '';
      }
    },
    async handleSignup() {
      if (this.passwordError) {
        alert('비밀번호를 확인해주세요.');
        return;
      }

      try {
        const response = await axios.post('http://180.83.251.5:8080/api/signup', {
          email: this.email,
          password: this.password,
        });
        alert(response.data);
      } catch (error) {
        console.error(error);
        alert('회원가입 실패');
      }
    },
  },
};
</script>


<style scoped>
.signup {
  width: 300px; /* 폼 너비 */
  margin: 0 auto; /* 가운데 정렬 */
}

.error {
  color: red;
  font-size: 14px;
  margin-top: -5px;
  margin-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column; /* 세로로 나열 */
  gap: 10px; /* 요소 간 간격 */
}

input,
button {
  padding: 10px; /* 내부 여백 */
  font-size: 16px; /* 글자 크기 */
}

button {
  background-color: #007bff; /* 버튼 색상 */
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3; /* 버튼 호버 색상 */
}
</style>