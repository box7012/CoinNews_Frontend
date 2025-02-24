<template>
  <footer class="footer">
    <div class="footer-content">
      <p>Contact Me : box7012@naver.com</p>
      <p>&copy; 2025 Coin-Dashboard. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped>
.footer {
  background-color: #161616;
  padding: 20px;
  text-align: center;
  width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px; /* 좌우 여백 추가 */
  position: absolute;
}

footer p {
  margin: 0;
  color: rgb(255, 255, 255);
  font-size: 18px;
}

</style>
