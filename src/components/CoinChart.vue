<template>
    <div>
      <canvas id="coinChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  
  export default {
    name: 'CoinChart',
    mounted() {
      Chart.register(...registerables);
      const ctx = document.getElementById('coinChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar', // 막대형 차트
        data: {
          labels: ['Bitcoin', 'Ethereum', 'Ripple'], // X축 라벨
          datasets: [{
            label: '24시간 거래량 (USD)',
            data: [20000000, 15000000, 10000000], // 데이터 값
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  };
  </script>
  
  <style scoped>

div {
  width: 100%;
  height: 100%;
}

canvas {
  width: 100%;
  height: 100%;
}
  </style>