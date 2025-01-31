import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        // target: 'https://coin-dashboard.xyz/api', // 백엔드 서버 주소
        changeOrigin: true,
        secure: true, // HTTPS로 통신할 때 필요한 설정
        // rewrite: (path) => path.replace(/^\/api/, ''), // '/api'를 제거하여 요청
      },
    },
  },
  build: {
    base: '/', // 배포할 경로를 지정
  },
  define: {
    // 프로덕션 환경에서 실제 API URL을 HTTPS로 설정
    // __API_URL__: process.env.NODE_ENV === 'production' ? '"https://coin-dashboard.xyz"' : '"/api"',
    __API_URL__: process.env.NODE_ENV === 'production' ? '"http://localhost:8080"' : '"/api"',
  },
});
