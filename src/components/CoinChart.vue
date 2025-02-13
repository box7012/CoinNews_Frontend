<template>
  <div>
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
      // timeInterval: '5', // 기본 시간 간격 5분
      // market: 'KRW-BTC', // 기본 티커 KRW-BTC (Bitcoin)
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

    timeInterval() {
      this.fetchData();
    },

    market() {
      this.fetchData();
    },

  },
  methods: {


    coinNameFormatChange(coinName) {
      return coinName.toLowerCase().replace(/\s+/g, '-');
    },

    async fetchData() {
      try {
        // 선택된 시간 간격과 티커로 API 요청
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${this.formatChangedSelectedCoin}/ohlc?vs_currency=usd&days=365`,
          {
            headers: {
              Accept: "application/json",
              "x-cg-api-key": import.meta.env.VITE_CG_API_KEY,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          const data = response.data;

          // API에서 받은 배열 데이터를 차트 형식으로 변환
          const formattedData = data.map(item => ({
            x: new Date(item[0]),  // timestamp를 Date 객체로 변환
            o: item[1],            // 시가
            h: item[2],            // 고가
            l: item[3],            // 저가
            c: item[4]             // 종가
          }));

          // 차트 데이터 갱신
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
      
      // 기존 차트가 존재하면 삭제
      if (this.chart) {
        this.chart.destroy();
      }

      // 새 차트 생성
      this.chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [
            {
              label: `${this.market} OHLC`,
              data: formattedData,
              borderColor: 'rgba(0, 128, 0, 1)', // 상승 캔들 색
              borderWidth: 1,
              backgroundColor: 'rgba(0, 128, 0, 0.3)', // 상승 캔들의 배경색
              hoverBackgroundColor: 'rgba(0, 128, 0, 0.5)', // 호버 시 배경색
              hoverBorderColor: 'rgba(0, 128, 0, 1)',
              barThickness: 5, // 캔들스틱의 너비 설정
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day', // 분 단위로 설정
              },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
              },
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 400px;
}
</style>
