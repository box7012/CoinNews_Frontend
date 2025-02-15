<template>
  <div>
    <h2 class="chart-title">{{ getSelectedCoin }} 가격 차트</h2>
    <!-- 차트 -->
    <canvas id="ohlcChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { mapGetters } from 'vuex';
import axios from 'axios';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);
Chart.register(CandlestickController, CandlestickElement);

export default {
  name: 'CoinChart',
  data() {
    return {
      chartData: [], // 차트 데이터를 담을 변수
      chart: null, // 차트 객체를 저장할 변수
    };
  },
  mounted() {
    this.fetchData(); // 컴포넌트가 마운트되면 데이터를 가져옵니다.
  },
  computed: {
    ...mapGetters(['getSelectedCoin']), // Vuex에서 선택된 코인 가져오기
    formatChangedSelectedCoin() {
      return this.getSelectedCoin // Vuex에서 가져온 값 사용
        ? this.getSelectedCoin.toLowerCase().replace(/\s+/g, '-')
        : 'bitcoin';
    },
  },
  watch: {
    getSelectedCoin() {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${this.formatChangedSelectedCoin}/ohlc?vs_currency=usd&days=365&x-cg-api-key=${import.meta.env.VITE_CG_API_KEY}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          const data = response.data;
          const formattedData = data.map(item => ({
            x: new Date(item[0]),  // timestamp를 Date 객체로 변환
            o: item[1],            // 시가
            h: item[2],            // 고가
            l: item[3],            // 저가
            c: item[4]             // 종가
          }));
          this.updateChart(formattedData);
        } else {
          console.error("응답 데이터가 배열이 아닙니다:", response.data);
        }
      } catch (error) {
        console.error('API 요청 오류:', error);
      }
    },
    updateChart(formattedData) {
      const ctx = document.getElementById('ohlcChart').getContext('2d');
      
      // 그라데이션 배경 생성
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(0, 128, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 128, 0, 0)');

      // 기존 차트가 존재하면 삭제
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
      type: "candlestick",
      data: {
        datasets: [
          {
            label: `${this.displayCoinName} OHLC`,
            data: formattedData,
            borderColor: (ctx) => {
              return ctx.raw.c >= ctx.raw.o ? "rgba(255, 0, 0, 1)" : "rgba(0, 0, 255, 1)"; // 빨강(양봉), 파랑(음봉)
            },
            backgroundColor: (ctx) => {
              return ctx.raw.c >= ctx.raw.o ? "rgba(255, 0, 0, 0.3)" : "rgba(0, 0, 255, 0.3)";
            },
            hoverBackgroundColor: (ctx) => {
              return ctx.raw.c >= ctx.raw.o ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 0, 255, 0.5)";
            },
            hoverBorderColor: (ctx) => {
              return ctx.raw.c >= ctx.raw.o ? "rgba(255, 0, 0, 1)" : "rgba(0, 0, 255, 1)";
            },
            barThickness: 5, // 캔들스틱의 너비 설정
          },
        ],
      },

        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                generateLabels: (chart) => {
                  return [
                    {
                      text: 'white candle',
                      fillStyle: 'rgba(0, 128, 0, 0.3)',
                      strokeStyle: 'rgba(0, 128, 0, 1)',
                      lineWidth: 1,
                    },
                    {
                      text: 'black candle',
                      fillStyle: 'rgba(255, 0, 0, 0.3)',
                      strokeStyle: 'rgba(255, 0, 0, 1)',
                      lineWidth: 1,
                    },
                  ];
                },
              },
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: { size: 14 },
              bodyFont: { size: 12 },
              footerFont: { size: 10 },
              padding: 10,
              cornerRadius: 5,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
              },
            },
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
            },
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

canvas {
  max-width: 100%;
  height: 400px;
  background: linear-gradient(to bottom, rgba(0, 128, 0, 0.1), rgba(0, 128, 0, 0));
}
</style>