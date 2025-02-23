<template>
  <div class="container">
    <div class="left-panel">
      <div class="section">
        <h3>📌 포트폴리오 목록</h3>
        <div class="ticker-list">
          <div v-for="(ticker, index) in selectedTickerList" :key="index" class="ticker-item">
            {{ ticker }}
            <button @click="removeTicker(index)" class="remove-btn">x</button>
          </div>
        </div>
      </div>
  
      <div class="section">
        <h3>🎯 티커 선택</h3>
        <label for="ticker">티커 선택:</label>
        <select v-model="selectedTicker" id="ticker" @change="addTicker" class="select-box">
          <option value="" disabled selected>티커를 선택하세요</option>
          <option v-for="ticker in tickers" :key="ticker" :value="ticker">
            {{ ticker }}
          </option>
        </select>
      </div>
  
      <div class="section">
        <button @click="addStrategy" class="add-strategy-btn">전략 추가</button>
      </div>
  
      <div class="section">
        <p>Strategy select</p>
        <div v-for="(strategy, index) in selectedStrategyList" :key="index" class="strategy-item">
          <div class="strategy-header">
            <select v-model="strategy.selected" id="selectedStrategy" class="select-box">
              <option value="" disabled selected>전략을 선택하세요</option>
              <option v-for="strategy in strategList" :key="strategy" :value="strategy">
                {{ strategy }}
              </option>
            </select>
            <button @click="deleteStrategy(index)" class="remove-btn">x</button>
          </div>
          <div v-if="strategy.selected === 'RSI'" class="strategy-params">
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
          <div v-if="strategy.selected === 'Bollinger Band'" class="strategy-params">
            <div>
              hi bollinger band
            </div>
          </div>
          <div v-if="strategy.selected === 'MACD'" class="strategy-params">
            <div>
              hi MACD
            </div>
          </div>
          <div v-if="strategy.selected === 'Psychological Line'" class="strategy-params">
            <div>
              <label for="buy">Buy</label>
              <input type="range" id="buy" v-model="PsychologicalBuyValue" min="0" max="100" />
              <span>{{ PsychologicalBuyValue }}%</span>
            </div>
            <div>
              <label for="sell">Sell</label>
              <input type="range" id="sell" v-model="PsychologicalSellValue" min="0" max="100" />
              <span>{{ PsychologicalSellValue }}%</span>
            </div>
          </div>
          <div v-if="strategy.selected === 'CCI'" class="strategy-params">
            <div>
              <label for="buy">Buy</label>
              <input type="range" id="buy" v-model="CCIBuyValue" min="-200" max="200" />
              <span>{{ CCIBuyValue }}%</span>
            </div>
            <div>
              <label for="sell">Sell</label>
              <input type="range" id="sell" v-model="CCISellValue" min="-200" max="200" />
              <span>{{ CCISellValue }}%</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- <div class="section">
        <p>Period</p>
        <div class="date-picker">
          <label for="startDate">시작 날짜:</label>
          <input type="date" id="startDate" v-model="startDate" class="date-input" />
  
          <label for="endDate">종료 날짜:</label>
          <input type="date" id="endDate" v-model="endDate" class="date-input" />
        </div>
      </div>
  
      <div class="section">
        <div class="selected-dates">
          <p>📆 선택한 기간: <strong>{{ startDate }} ~ {{ endDate }}</strong></p>
        </div>
      </div> -->
  
      <div class="section">
        <button @click="sendAnalysisData" class="analysis-btn">🕵️Analysis</button>
      </div>
    </div>
  
    <div class="center-panel">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-message">Loading...</div>
      </div>
      <div v-for="(imageBase64, index) in imageBase64List" :key="index">
        <img :src="imageBase64" alt="Graph" class="graph-image" />
      </div>
    </div>
  
    <div class="right-panel">
      <div class="section">
        <h2>Final Value List</h2>
        <table class="final-value-table">
          <thead>
            <tr>
              <th>코인</th>
              <th>값</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in finalValueList" :key="index">
              <td>{{ Object.keys(item)[0] }}</td>
              <td>{{ Object.values(item)[0].toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-for="(result, tickerIndex) in backTestHistory" :key="tickerIndex" class="section">
        <h2>Backtest Results - {{ result[0]?.ticker || 'Unknown' }}</h2>
        <table class="backtest-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>티커</th>
              <th>RSI</th>
              <th>매수 신호</th>
              <th>매도 신호</th>
              <th>거래가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in result" :key="index">
              <td>{{ formatDate(item.timestamp) }}</td>
              <td>{{ item.ticker }}</td>
              <td>{{ item.rsi }}</td>
              <td>{{ item.buySignal || 'N/A' }}</td>
              <td>{{ item.sellSignal || 'N/A' }}</td>
              <td>{{ item.tradePrice }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState, mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        tickers: [],  // API로 받은 티커 목록
        selectedTicker: '',  // 선택된 티커
        selectedTickerList: [],  // 선택된 티커 목록
  
        selectedStrategy: '',
        strategList: ['RSI', 'Bollinger Band', 'MACD', 'Psychological Line', 'CCI'],
        selectedStrategyList: [],
        rsiSellValue: 50, // Sell 값 (초기값 50%)
        rsiBuyValue: 50,  // Buy 값 (초기값 50%)
  
        CCIBuyValue: 0,
        CCISellValue: 0,
  
        PsychologicalBuyValue: 50,
        PsychologicalSellValue: 50,
  
        startDate: '',
        endDate: '',
  
        imageBase64List: [],
        isLoading: false,
  
        backTestHistory: [],
  
        backTestResults: [],
  
        finalValueList: [],
  
      };
    },
    mounted() {
      this.fetchTickers();  // 컴포넌트가 마운트되면 데이터 가져오기
      const darkMode = localStorage.getItem('darkMode') === 'true';
      this.$store.dispatch('updateDarkMode', darkMode); // 초기 다크 모드 상태 설정
    },

    computed: {
      ...mapState(['isDarkMode']), // Vuex 상태 매핑
    },

   
    methods: {

      ...mapActions(['toggleDarkMode']), // Vuex 액션 매핑

      formatDate(timestamp) {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식으로 변환
      },
  
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
              CCI: { buy: this.CCIBuyValue, sell: this.CCISellValue },
              "Psychological Line": { buy: this.PsychologicalBuyValue, sell: this.PsychologicalSellValue },
            },
            startDate: this.startDate,
            endDate: this.endDate,
          };
  
          // const response = await axios.post("http://192.168.0.2:8080/api/analysis", requestData);
          const response = await axios.post("https://coin-dashboard.xyz/api/analysis", requestData);
          this.imageBase64List = response.data.graphs.map(graph => "data:image/png;base64," + graph);
          this.backTestHistory = response.data.backTestHistory;
          this.finalValueList = response.data.finalValueList;
          // this.backtestResults = response.data.backtestresult;
          this.isLoading = false;
        } catch (error) {
          alert("⚠️ 분석 요청 중 오류가 발생했습니다.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 전체 컨테이너 스타일 */
  .container {
    margin-top: 50px;
    display: grid;
    grid-template-columns: 1fr 4fr 3fr;
    gap: 20px;
    padding: 0px;
    height: 1000px;
    max-height: 25000px;
    background-color: #ffffff;
    font-family: 'Arial', sans-serif;
    width: 1465px;
  }
  
  /* 왼쪽 패널 스타일 */
  .left-panel {
    background-color: #e8eee7;
    padding: 20px;
    border-radius: 10px;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    width: 240px;
    min-height: 600px;
  }
  
  /* 섹션 스타일 */
  .section {
    margin-bottom: 20px;
  }
  
  /* 티커 리스트 스타일 */
  .ticker-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  
  /* 티커 아이템 스타일 */
  .ticker-item {
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: #e3f2fd;
    padding: 8px 12px;
    border-radius: 5px;
    font-weight: bold;
  }
  
    .strategy-item {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    background-color: #f9f9f9;
  }

  .strategy-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .strategy-header .select-box {
    flex: 1;
  }

  .strategy-header .remove-btn {
    background-color: #ff6b6b;
    color: white;
    border: none;
    padding: 5px 8px;
    cursor: pointer;
    border-radius: 3px;
  }

  .strategy-params {
    margin-top: 10px;
    padding-left: 10px;
  }
  
  /* 삭제 버튼 스타일 */
  .remove-btn {
    background-color: #ff6b6b;
    color: white;
    border: none;
    padding: 5px 8px;
    cursor: pointer;
    border-radius: 3px;
  }
  
  /* 셀렉트 박스 스타일 */
  .select-box {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  /* 전략 추가 버튼 스타일 */
  .add-strategy-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
  }
  
  /* 분석 버튼 스타일 */
  .analysis-btn {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    width: 100%;
  }
  
  /* 중앙 패널 스타일 */
  .center-panel {
    background-color: #e8eee7;
    padding: 25px;
    border-radius: 10px;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    /* width: 750px; */
  }

    /* 오른쪽 패널 스타일 */
  .right-panel {
    background-color: #e8eee7;
    padding: 20px;
    border-radius: 10px;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    width: 500px;
  }
  
  
  /* 그래프 이미지 스타일 */
  .graph-image {
    width: 100%;
    border-radius: 5px;
    padding: auto;
    margin: 10px;
  }
  
  /* 테이블 스타일 */
  .final-value-table, .backtest-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .final-value-table th, .final-value-table td,
  .backtest-table th, .backtest-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .final-value-table th, .backtest-table th {
    background-color: #f8f9fa;
  }
  
  /* 로딩 오버레이 스타일 */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .loading-message {
    font-size: 1.5em;
    color: #333;
  }

  /* 다크 모드 스타일 */
  .dark .container {
    background-color: #1b1b1b; 
    color: #ffffff;
  }

  .dark .left-panel,
  .dark .center-panel,
  .dark .right-panel {
    background-color: #2d2d2d;
    color: #ffffff;
  }

  .dark .ticker-item {
    background-color: #5f5f5f;
    color: #ffffff;
  }

  .dark .select-box,
  .dark .date-input {
    background-color: #2d2d2d;
    color: #ffffff;
    border-color: #555;
  }

  .dark .strategy-item {
    background-color: #2d2d2d; /* 다크 모드 배경색 */
    border: 1px solid #555; /* 다크 모드 테두리 색 */
    color: #ffffff; /* 다크 모드 텍스트 색 */
  }

  .dark .strategy-header {
    background-color: #2d2d2d; /* 다크 모드 배경색 */
    color: #ffffff; /* 다크 모드 텍스트 색 */
  }

  .dark .add-strategy-btn,
  .dark .analysis-btn {
    background-color: #4caf50;
    color: #ffffff;
  }

  .dark .remove-btn {
    background-color: #ff6b6b;
    color: #ffffff;
  }

  .dark .final-value-table th,
  .dark .backtest-table th {
    background-color: #2d2d2d;
    color: #ffffff;
  }

  .dark .final-value-table td,
  .dark .backtest-table td {
    background-color: #1b1b1b;
    color: #ffffff;
    border-color: #555;
  }

  .dark .loading-overlay {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .dark .loading-message {
    color: #ffffff;
  }

  .dark .section {
    background-color: #2d2d2d; /* 다크 모드 배경색 */
    color: #ffffff; /* 다크 모드 텍스트 색 */
  }

  .dark p {
  color: #ffffff;  /* 텍스트 색상을 밝은 색으로 설정 */
}

  </style>