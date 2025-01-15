import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.2:8080', // 백엔드 서버 주소
        // target: 'http://180.83.251.5:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api'를 제거하여 요청
      },
    },
  },
  build: {
    // 배포할 경로를 지정, 예: `/my-app/`로 설정하면 프로덕션에서 /my-app 경로에 배포됨
    base: '/',
  },
  define: {
    // 환경에 맞춰 API의 기본 URL을 설정
    // __API_URL__: process.env.NODE_ENV === 'production' ? '"http://192.168.0.2:8080/messages"' : '"/api"',
    __API_URL__: process.env.NODE_ENV === 'production' ? '"http://180.83.251.5:8080/messages"' : '"/api"',
  },
});
