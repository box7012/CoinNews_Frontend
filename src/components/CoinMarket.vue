<template>
    <div class="container">
      <h1 class="title">Crypto Dashboard</h1>

      <table class="crypto-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>현재 가격 (USD)</th>
            <th>24시간 거래량 (USD)</th>
            <th>24시간 변동 (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coin in coins" :key="coin.id">
            <td>{{ coin.name }}</td>
            <td>${{ coin.current_price.toLocaleString() }}</td>
            <td>${{ coin.total_volume.toLocaleString() }}</td>
            <td :style="{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }">
              {{ coin.price_change_percentage_24h.toFixed(2) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        coins: []
      };
    },
  
    methods: {
      async fetchCryptoData() {
        try {
          const response = await axios.get(
            'https://api.coingecko.com/api/v3/coins/markets',
            {
              params: {
                vs_currency: 'usd', // USD 기준
                order: 'market_cap_desc', // 시가총액 기준 내림차순
                per_page: 10, // 최대 10개의 코인만 표시
                page: 1,
                sparkline: false // 스파크라인 데이터 제외
              }
            }
          );
          this.coins = response.data;
        } catch (error) {
          console.error('Error fetching crypto data:', error);
          alert('데이터를 가져오는 데 실패했습니다.');
        }
      }
    },
  
    mounted() {
      this.fetchCryptoData(); // 페이지 로드 시 데이터 가져오기
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  .refresh-btn {
    display: block;
    margin: 0 auto;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .refresh-btn:hover {
    background-color: #45a049;
  }
  
  .crypto-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .crypto-table th,
  .crypto-table td {
    padding: 5px;
    text-align: center;
    border: 1px solid #ddd;
    font-size: 1rem;
  }
  
  .crypto-table th {
    background-color: #f4f4f4;
    color: #333;
  }
  
  .crypto-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .crypto-table tbody tr:nth-child(odd) {
    background-color: #fff;
  }
  
  .crypto-table tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  .crypto-table td {
    color: #555;
  }
  
  .crypto-table td:nth-child(4) {
    font-weight: bold;
  }
  </style>
  