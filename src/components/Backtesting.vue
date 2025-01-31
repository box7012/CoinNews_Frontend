<template>
  <div>
    <div>
      <p>현재 포트폴리오 목록</p>
      <p>{{ selectedTickerList }}</p>
    </div>

    <!-- 티커 선택 -->
    <label for="ticker">티커 선택:</label>
    <select v-model="selectedTicker" id="ticker" @change="addTicker">
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
      <option v-for="strategy in strategList" :key="strategy" :value="strategy">
        {{ strategy }}
      </option>
    </select>
    <div v-if="strategy.selected === 'RSI'">
      <div>
        <label for="buy">Buy</label>
        <input type="range" id="buy" v-model="buyValue" min="0" max="100" />
        <span>{{ buyValue }}%</span>
      </div>
      <div>
        <label for="sell">Sell</label>
        <input type="range" id="sell" v-model="sellValue" min="0" max="100" />
        <span>{{ sellValue }}%</span>
      </div>
    </div>
    <div v-if="strategy.selected === 'Bollinger Band'">
      <div>
        hi
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
      sellValue: 50, // Sell 값 (초기값 50%)
      buyValue: 50,  // Buy 값 (초기값 50%)
    };
  },
  mounted() {
    this.fetchTickers();  // 컴포넌트가 마운트되면 데이터 가져오기
  },

  methods: {

    addStrategy() {
      this.selectedStrategyList.push({
        selected: '',
      })
      console.log(this.selectedStrategyList);
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
  },
};
</script>

<style scoped>
select {
  width: 200px;
  padding: 5px;
}
</style>
