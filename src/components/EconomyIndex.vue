<template>
  <div>
    <div class="header">
      <h1>경제 지표</h1>
    </div>
    <div v-if="loading" class="loading">데이터를 불러오는 중...</div>
    <div v-else>
      <h2>환율 정보</h2>
      <ul>
        <li v-for="(value, key) in exchangeRates" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>

      <h2>국내 경제 지표</h2>
      <ul>
        <li v-for="(value, key) in economicIndicators" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      exchangeRates: {},
      economicIndicators: {},
    };
  },
  methods: {
    async fetchData() {
      try {
        // 환율 API (예시: Open Exchange Rates API)
        const exchangeResponse = await axios.get('https://api.exchangeratesapi.io/latest', {
          params: {
            base: 'USD',
            symbols: 'EUR,JPY,GBP,KRW',
          }
        });

        this.exchangeRates = exchangeResponse.data.rates;

        // 경제 지표 API 예시 (예: GDP, CPI 등)
        // 실제 API URL로 변경 필요
        const economicResponse = await axios.get('https://api.example.com/economic-indicators', {
          params: {
            country: 'KR', // 예: 한국
          }
        });

        this.economicIndicators = economicResponse.data;

      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: gray;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 0;
}
</style>
