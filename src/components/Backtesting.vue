<template>

<div class="container">
  <div class="left-panel">

  <div>
    <div>
      <h3>📌 포트폴리오 목록</h3>
      <div class="ticker-list">
        <div v-for="(ticker, index) in selectedTickerList" :key="index" class="ticker-item">
          {{ ticker }}
          <button @click="removeTicker(index)">x</button>
        </div>
      </div>
    </div>

    <!-- 티커 선택 -->
    <h3>🎯 티커 선택</h3>
    <label for="ticker">티커 선택:</label>
    <select v-model="selectedTicker" id="ticker" @change="addTicker">
      <option value="" disabled selected>티커를 선택하세요</option>
      <option v-for="ticker in tickers" :key="ticker" :value="ticker">
        {{ ticker }}
      </option>
    </select>
  </div>

  <div>
    <button @click="addStrategy">전략 추가</button>
  </div>

  <p>Strategy select</p>
  <div v-for="(strategy, index) in selectedStrategyList" :key="index">
    <select v-model="strategy.selected" id="selectedStrategy">
      <option value="" disabled selected>전략을 선택하세요</option>
      <option v-for="strategy in strategList" :key="strategy" :value="strategy">
        {{ strategy }}
      </option>
    </select>
    <button @click="deleteStrategy(index)">x</button>
    <div v-if="strategy.selected === 'RSI'">
      <div>
        <label for="buy">Buy</label>
        <input type="range" id="buy" v-model="rsiBuyValue" min="0" max="100" />
        <span>{{ rsiBuyValue }}%</span>
      </div>
      <div>
        <label for="sell">Sell</label>
        <input type="range" id="sell" v-model="rsiSellValue" min="0" max="100" />
        <span>{{ rsiSellValue }}%</span>
      </div>
    </div>
    <div v-if="strategy.selected === 'Bollinger Band'">
      <div>
        <label for="buy">Buy</label>
        <input type="range" id="buy" v-model="bollingerBuyValue" min="0" max="100" />
        <span>{{ bollingerBuyValue }}%</span>
      </div>
      <div>
        <label for="sell">Sell</label>
        <input type="range" id="sell" v-model="bollingerSellValue" min="0" max="100" />
        <span>{{ bollingerSellValue }}%</span>
      </div>
    </div>
  </div>

  <div>
    <p>Period</p>
    <!-- 날짜 선택 -->
    <div class="date-picker">
      <label for="startDate">시작 날짜:</label>
      <input type="date" id="startDate" v-model="startDate" />

      <label for="endDate">종료 날짜:</label>
      <input type="date" id="endDate" v-model="endDate" />
    </div>

        <!-- 선택한 날짜 표시 -->
    <div class="selected-dates">
      <p>📆 선택한 기간: <strong>{{ startDate }} ~ {{ endDate }}</strong></p>
    </div>
  </div>

  <div>
    <button @click="sendAnalysisData">🕵️Analysis</button>
  </div>
</div>

  <div class="right-panel">
    <!-- 로딩 중 화면 흐릿하게 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-message">Loading...</div>
    </div>
    <div v-for="(imageBase64, index) in imageBase64List" :key="index">
      <img :src="imageBase64" alt="Graph" />
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tickers: [],  // API로 받은 티커 목록
      selectedTicker: '',  // 선택된 티커
      selectedTickerList: [],  // 선택된 티커 목록

      selectedStrategy: '',
      strategList: ['RSI', 'Bollinger Band'],
      selectedStrategyList: [],
      rsiSellValue: 50, // Sell 값 (초기값 50%)
      rsiBuyValue: 50,  // Buy 값 (초기값 50%)

      bollingerBuyValue: 50,
      bollingerSellValue: 50,

      startDate: '',
      endDate: '',

      imageBase64List: [],
      isLoading: false,

    };
  },
  mounted() {
    this.fetchTickers();  // 컴포넌트가 마운트되면 데이터 가져오기
  },

  methods: {

    deleteStrategy(index) {
      this.selectedStrategyList.splice(index, 1);
    },

    addStrategy() {
      this.selectedStrategyList.push({
        selected: '',
      })
    },

    // API에서 티커 목록을 가져오는 메서드
    async fetchTickers() {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
        response.data.symbols.forEach(symbolInfo => {
          this.tickers.push(symbolInfo.baseAsset);
        });

        // 중복 제거 후 tickers에 저장
        this.tickers = this.removeDuplicates(this.tickers);
      } catch (error) {
        console.error('API 요청 오류:', error);
      }
    },
    removeDuplicates(arr) {
      return [...new Set(arr)];
    },

    // 티커를 selectedTickerList에 추가하는 메서드
    addTicker() {
      if (this.selectedTicker && !this.selectedTickerList.includes(this.selectedTicker)) {
        this.selectedTickerList.push(this.selectedTicker);
      }
    },
    // 선택한 티커 삭제
    removeTicker(index) {
      this.selectedTickerList.splice(index, 1);
    },

    async sendAnalysisData() {
      try {
        this.isLoading = true;
        const requestData = {
          tickers: this.selectedTickerList,
          strategies: this.selectedStrategyList,
          parameters: {
            RSI: { buy: this.rsiBuyValue, sell: this.rsiSellValue },
            BollingerBand: { buy: this.bollingerBuyValue, sell: this.bollingerSellValue },
          },
          startDate: this.startDate,
          endDate: this.endDate,
        };

        const response = await axios.post("http://192.168.0.2:8080/api/analysis", requestData);
        this.imageBase64List = response.data.graphs.map(graph => "data:image/png;base64," + graph);
        this.isLoading = false;
      } catch (error) {
        alert("⚠️ 분석 요청 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
/* 화면을 1:2 비율로 나누는 Grid */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* 왼쪽:오른쪽 = 1:2 비율 */
  gap: 20px;
  padding: 20px;
  height: 100vh;
}

/* 왼쪽 패널 스타일 */
.left-panel {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

/* 오른쪽 패널 스타일 */
.right-panel {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
}

/* 티커 리스트 스타일 */
.ticker-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

/* 티커 아이템 */
.ticker-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #e3f2fd;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
}

/* 삭제 버튼 */
button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 8px;
  cursor: pointer;
  border-radius: 3px;
}

/* 날짜 선택 스타일 */
.date-picker {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 선택한 날짜 스타일 */
.selected-dates {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

/* 분석 요청 버튼이 로딩 중일 때 비활성화 */
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

</style>