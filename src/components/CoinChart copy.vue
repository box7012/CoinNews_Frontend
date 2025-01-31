<template>
  <div>
    <!-- 시간 간격 선택 -->
    <div>
      <label for="timeInterval">시간 간격:</label>
      <select v-model="timeInterval" id="timeInterval">
        <option value="5">5분</option>
        <option value="10">10분</option>
        <option value="20">20분</option>
        <option value="30">30분</option>
      </select>
    </div>

    <!-- 티커 선택 -->
    <div>
      <label for="market">티커:</label>
      <select v-model="market" id="market">
        <option value="BTCUSDT">BTC</option>
        <option value="ETHUSDT">ETH</option>
        <option value="XRPUSDT">XRP</option>
      </select>
    </div>

    <!-- 차트 -->
    <canvas ref="ohlcChart" v-show="true"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import axios from 'axios';
import { nextTick } from 'vue';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);
Chart.register(CandlestickController, CandlestickElement);

export default {
  name: 'CoinChart',
  data() {
    return {
      chartData: [],
      timeInterval: '5', // 기본 시간 간격
      market: 'BTCUSDT', // 기본 티커
      chart: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
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
      const url = `https://api.binance.com/api/v3/klines`;
      const params = {
        symbol: this.market,
        interval: `${this.timeInterval}m`,
        limit: 50,
      };
      const response = await axios.get(url, { params });

      if (response.data && Array.isArray(response.data)) {
        const formattedData = response.data.map(item => ({
          x: new Date(item[0]),
          o: parseFloat(item[1]),
          h: parseFloat(item[2]),
          l: parseFloat(item[3]),
          c: parseFloat(item[4]),
        }));

        await nextTick();

        // 100ms 후에 실행 (DOM이 완전히 렌더링된 후)
        setTimeout(() => {
          this.updateChart(formattedData);
        }, 100);
      }
    } catch (error) {
      console.error('API 요청 오류:', error);
    }
  },

  updateChart(formattedData) {
    const canvas = this.$refs.ohlcChart;

    if (!canvas) {
      console.error("❌ Canvas를 찾을 수 없습니다.");
      return;
    }

    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error("❌ Canvas의 2D 컨텍스트를 가져올 수 없습니다.");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: `${this.market} OHLC`,
            data: formattedData,
            borderColor: 'rgba(0, 128, 0, 1)',
            borderWidth: 1,
            backgroundColor: 'rgba(0, 128, 0, 0.3)',
            hoverBackgroundColor: 'rgba(0, 128, 0, 0.5)',
            hoverBorderColor: 'rgba(0, 128, 0, 1)',
            barThickness: 10,
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
              unit: 'minute',
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
   }
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 400px;
}
</style>
