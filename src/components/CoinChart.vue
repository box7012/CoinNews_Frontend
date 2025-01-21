<template>
  <div>
    <!-- 시간 간격과 티커를 선택할 수 있는 입력 필드 -->
    <div>
      <label for="timeInterval">시간 간격:</label>
      <select v-model="timeInterval" id="timeInterval">
        <option value="5">5분</option>
        <option value="10">10분</option>
        <option value="20">20분</option>
        <option value="30">30분</option>
      </select>
    </div>

    <div>
      <label for="market">티커:</label>
      <select v-model="market" id="market">
        <option value="KRW-BTC">BTC</option>
        <option value="KRW-ETH">ETH</option>
        <option value="KRW-XRP">XRP</option>
        <!-- 필요한 만큼 옵션 추가 -->
      </select>
    </div>

    <!-- 차트 -->
    <canvas id="ohlcChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import axios from 'axios';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);
Chart.register(CandlestickController, CandlestickElement);

export default {
  name: 'CoinChart',
  data() {
    return {
      chartData: [], // 차트 데이터를 담을 변수
      timeInterval: '5', // 기본 시간 간격 5분
      market: 'KRW-BTC', // 기본 티커 KRW-BTC (Bitcoin)
      chart: null, // 차트 객체를 저장할 변수
    };
  },
  mounted() {
    this.fetchData(); // 컴포넌트가 마운트되면 데이터를 가져옵니다.
  },
  watch: {
    // 시간 간격 또는 티커가 변경될 때마다 데이터 새로 가져오기
    timeInterval() {
      this.fetchData();
    },
    market() {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      try {
        // 선택된 시간 간격과 티커로 API 요청
        const response = await axios.get(`https://api.upbit.com/v1/candles/minutes/${this.timeInterval}?market=${this.market}&count=20`);

        if (response.data && Array.isArray(response.data)) {
          const data = response.data;

          // API에서 받은 데이터를 차트 형식에 맞게 변환
          const formattedData = data.map(item => ({
            x: new Date(item.candle_date_time_kst),  // KST 시간으로 변환
            o: item.opening_price,                    // 시가
            h: item.high_price,                       // 고가
            l: item.low_price,                        // 저가
            c: item.trade_price                       // 종가
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
              barThickness: 10, // 캔들스틱의 너비 설정
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
                unit: 'minute', // 분 단위로 설정
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
