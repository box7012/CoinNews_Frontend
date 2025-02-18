<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal">
      <button class="close-btn" @click="closeModal">×</button>
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <div>
          <!-- <label for="username">아이디</label> -->
          <input v-model="email" type="text" id="username" placeholder="아이디" required />
        </div>
        <div>
          <!-- <label for="password">비밀번호</label> -->
          <input v-model="password" type="password" id="password" placeholder="비밀번호"  required />
        </div>
        <button type="submit" class="center-button">로그인</button> <!-- submit으로 수정 -->
        <button @click="goToSignUp" type="button" class="center-button">회원가입</button>
      </form>
      <p>-------간편 로그인-------</p>
      <div class="social-logo-wrapper">
        <button class="social-logo"> 
          <img src="../assets/images/Naver.png" @click="naverLogin" style="width: 50px; height: auto;" />
        </button>
        <button class="social-logo"> 
          <img src="../assets/images/Google.png" @click="googleLogin" style="width: 50px; height: auto;" />
        </button>
        <button class="social-logo"> 
          <img src="../assets/images/Kakao.png" @click="kakaoLogin" style="width: 50px; height: auto;" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  props: {
    show: Boolean,
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
    };
  },

  setup() {
    const route = useRoute();
    return {
      route,
    };
  },

  methods: {
    async login() {
      const { email, password } = this;

      try {
        const response = await axios.post("/auth/login", {
          email: email,
          password: password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const token = response.data;  // 응답에서 직접 토큰을 받음
        if (!token) {
          throw new Error("토큰이 응답에 포함되지 않았습니다.");
        }
        
        // 'Bearer '를 제거한 후 토큰을 디코딩
        const cleanedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const decodedToken = VueJwtDecode.decode(cleanedToken); // JWT 토큰을 디코딩
        console.log("Decoded Token:", decodedToken); // 디코딩된 내용 확인
        
        const user = { email: decodedToken.sub }; // 사용자 정보 생성
        localStorage.setItem("authToken", token); // JWT 토큰만 저장
        localStorage.setItem("user", JSON.stringify(user)); // 사용자 정보도 저장
        this.$emit('user-logged-in', user); // 부모 컴포넌트로 사용자 정보 전달

        alert('로그인 성공!');
        this.$emit('close'); // 로그인 성공 후 모달 닫기

      } catch (error) {
        console.error("Failed to send Login Information: ", error);
        alert('로그인 실패.. 다시 시도해주세요.');
      }
    },

    closeModal() {
      this.$emit('close');
    },

    goToSignUp() {
      this.$router.push("/signup"); // 회원가입 페이지로 이동
      this.$emit("close"); // 로그인 모달 닫기
    },

    naverLogin() {
      console.log("hi!")
    },

    googleLogin() {
      console.log("hi!")
    },

    kakaoLogin() {
      console.log("hi!")
    },

  },
};
</script>

<style>

input[type="text"],
input[type="password"] {
  width: 100%;            /* 입력란의 너비를 부모 요소에 맞게 100%로 설정 */
  height: 40px;           /* 높이 설정 */
  padding: 10px;          /* 안쪽 여백 추가 */
  font-size: 16px;        /* 폰트 크기 조정 */
  border: 1px solid #ccc; /* 테두리 설정 */
  border-radius: 5px;     /* 둥근 테두리 */
  margin-bottom: 15px;    /* 입력란 간 간격 */
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #5c5c5c; /* 포커스 시 테두리 색상 변경 */
  outline: none;         /* 포커스 시 기본 윤곽선 제거 */
}

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
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.center-button {
  background: #ffffff;
  color: #444444;
  padding: 12px;
  margin: 10px;
  border: 1px solid #000;
  border-radius: 8px;
}

.center-button:hover {
  color: #000;
  background: #ffffff;
  transform: none; /* 만약 다른 곳에서 transform이 적용되었으면 리셋 */
  box-shadow: none; /* 그림자 제거 */
}



/* 간편 로그인 텍스트 스타일 */
p {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;  /* 텍스트 아래 여백 추가 */
}


/* 소셜 로그인 버튼들을 가로로 배치 */
.social-logo-wrapper {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  gap: 20px; /* 버튼들 간 간격 */
  margin-top: 20px; /* 위쪽 여백 */
}

.social-logo {
  background: white; /* 배경색 (필요에 따라 변경 가능) */
  border: 1px solid #ddd; /* 테두리 추가 */
  padding: 10px;
  width: 60px; /* 버튼 크기 */
  height: 60px;
  display: flex; /* 이미지 가운데 정렬 */
  justify-content: center;
  align-items: center;
  border-radius: 50%; /* 원형 버튼 */
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.social-logo:hover {
  background: #f5f5f5; /* 호버 시 색상 변경 */
  transform: scale(1.1); /* 약간 확대 */
}

.social-logo img {
  width: 50px;
  height: auto;
}


/* 닫기 버튼 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
  /* border: 1px solid #000; */
  border-radius: 8px;  /* 둥근 모서리 제거 */
  padding: 3px;
}

.close-btn:hover {
  color: #000;
  background: #ffffff;
  transform: none; /* 만약 다른 곳에서 transform이 적용되었으면 리셋 */
  box-shadow: none; /* 그림자 제거 */
}



</style>
