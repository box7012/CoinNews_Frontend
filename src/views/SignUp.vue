<template>
  <router-view />
  <div class="signup">
    <h1>회원가입</h1>
    <form>
      <input type="email" v-model="email" placeholder="이메일" @blur="validateEmail" />
      <p v-if="emailError" class="error">{{ emailError }}</p>
      <button type="button" @click="emailDuplicateCheck" :disabled="Boolean(emailError)">중복 검사</button>
      <p v-if="emailStatusok || emailStatusbad">{{ emailStatusok || emailStatusbad }}</p>
      <input type="password" v-model="password" placeholder="비밀번호" />
      <input type="password" v-model="password_check"  placeholder="비밀번호 확인" @input="validatePassword" />
      
      <!-- 비밀번호 불일치 메시지 -->
      <p v-if="passwordError" class="error">{{ passwordError }}</p>
      <button type="button" :disabled="!emailPasswordValidation" @click="processSignup">회원가입</button>

    </form>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      password_check: '',
      emailError: '', // 이메일 중복 확인 에러
      passwordError: '', // 비밀번호 불일치 메시지 저장
      emailStatusok: '',
      emailStatusbad: '',
    };
  },
  setup() {
        const route = useRoute();
        return {
            route
        };
    },

  computed: {
    emailPasswordValidation() {
      return !this.emailError && !this.passwordError;
    },
  },
  methods: {
    validatePassword() {
      if (this.password !== this.password_check) {
        this.passwordError = '비밀번호가 다릅니다.';
      } else {
        this.passwordError = '';
      }
    },

    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
          this.emailError = '유효한 이메일 형식이 아닙니다.';
        } else {
          this.emailError = '';
      }
    },

    async emailDuplicateCheck() {
    try {
      // 서버로 중복 체크 요청 전송
      const response = await axios.post('http://180.83.251.5:8080/api/emailcheck', {
        email: this.email,
      });

      // 응답 상태에 따른 처리
      if (response.status === 200) {
        this.emailStatusok = "유효한 이메일 입니다.";
        this.emailStatusbad = "";
      } else if (response.status === 409) {
        this.emailStatusbad = "이미 존재하는 이메일 입니다.";
        this.emailStatusok = "";
      } else {
        console.warn("Unexpected status:", response.status);
        alert("예상치 못한 응답 상태입니다. 다시 시도해주세요.");
      }
    } catch (error) {
      // 에러 처리
      console.error("Error during email check:", error);

      if (error.response) {
        // 서버 응답이 있는 경우
        if (error.response.status === 500) {
          alert("서버 오류로 인해 중복 확인에 실패했습니다.");
        } else {
          alert(`오류 발생: ${error.response.data || "알 수 없는 이유"}`);
        }
      } else {
        // 서버에 도달하지 못한 경우
        alert("서버와 연결할 수 없습니다. 네트워크 상태를 확인하세요.");
      }
    }
  },


    async processSignup() {
      if (this.passwordError) {
        alert('비밀번호를 확인해주세요.');
        return;
      }
      try {
        const response = await axios.post('http://180.83.251.5:8080/api/signup', {
          email: this.email,
          password: this.password,
        });

        if (response.data) {
          alert(response.data);
          this.$router.push("/signupsuccess"); // 회원가입 페이지로 이동
        } else {
          alert('회원가입 실패.. 확인 부탁');
        }
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