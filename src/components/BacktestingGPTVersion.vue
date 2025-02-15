<template>
  <div class="container">
    <div class="left-panel">
      <div class="portfolio-section">
        <h3>📌 포트폴리오 목록</h3>
        <div class="ticker-list">
          <div v-for="(ticker, index) in selectedTickerList" :key="index" class="ticker-item">
            {{ ticker }}
            <button @click="removeTicker(index)" class="remove-btn">x</button>
          </div>
        </div>
      </div>

      <!-- 티커 선택 -->
      <div class="strategy-section">
        <h3>🎯 티커 선택</h3>
        <label for="ticker" class="select-label">티커 선택:</label>
        <select v-model="selectedTicker" id="ticker" @change="addTicker" class="select-box">
          <option value="" disabled selected>티커를 선택하세요</option>
          <option v-for="ticker in tickers" :key="ticker" :value="ticker">
            {{ ticker }}
          </option>
        </select>
      </div>

      <div>
        <button @click="addStrategy" class="add-btn">전략 추가</button>
      </div>

      <div v-for="(strategy, index) in selectedStrategyList" :key="index" class="strategy-card">
        <select v-model="strategy.selected" id="selectedStrategy" class="select-box">
          <option value="" disabled selected>전략을 선택하세요</option>
          <option v-for="strategy in strategList" :key="strategy" :value="strategy">
            {{ strategy }}
          </option>
        </select>
        <button @click="deleteStrategy(index)" class="remove-btn">x</button>

        <!-- RSI 전략 설정 -->
        <div v-if="strategy.selected === 'RSI'" class="strategy-settings">
          <div class="range-input">
            <label for="buy">Buy</label>
            <input type="range" id="buy" v-model="rsiBuyValue" min="0" max="100" />
            <span>{{ rsiBuyValue }}%</span>
          </div>
          <div class="range-input">
            <label for="sell">Sell</label>
            <input type="range" id="sell" v-model="rsiSellValue" min="0" max="100" />
            <span>{{ rsiSellValue }}%</span>
          </div>
        </div>

        <!-- 다른 전략들(여기서 수정) -->
        <div v-if="strategy.selected === 'Bollinger Band'">
          <div class="strategy-settings">hi bollinger band</div>
        </div>
        <div v-if="strategy.selected === 'MACD'">
          <div class="strategy-settings">hi MACD</div>
        </div>
        <div v-if="strategy.selected === 'Psychological Line'">
          <div class="range-input">
            <label for="buy">Buy</label>
            <input type="range" id="buy" v-model="PsychologicalBuyValue" min="0" max="100" />
            <span>{{ PsychologicalBuyValue }}%</span>
          </div>
          <div class="range-input">
            <label for="sell">Sell</label>
            <input type="range" id="sell" v-model="PsychologicalSellValue" min="0" max="100" />
            <span>{{ PsychologicalSellValue }}%</span>
          </div>
        </div>
        <div v-if="strategy.selected === 'CCI'">
          <div class="range-input">
            <label for="buy">Buy</label>
            <input type="range" id="buy" v-model="CCIBuyValue" min="-200" max="200" />
            <span>{{ CCIBuyValue }}%</span>
          </div>
          <div class="range-input">
            <label for="sell">Sell</label>
            <input type="range" id="sell" v-model="CCISellValue" min="-200" max="200" />
            <span>{{ CCISellValue }}%</span>
          </div>
        </div>
      </div>

      <div class="date-picker">
        <label for="startDate">시작 날짜:</label>
        <input type="date" id="startDate" v-model="startDate" class="date-input" />

        <label for="endDate">종료 날짜:</label>
        <input type="date" id="endDate" v-model="endDate" class="date-input" />
      </div>

      <div class="selected-dates">
        <p>📆 선택한 기간: <strong>{{ startDate }} ~ {{ endDate }}</strong></p>
      </div>

      <div>
        <button @click="sendAnalysisData" class="analysis-btn">🕵️ 분석 시작</button>
      </div>
    </div>

    <div class="center-panel">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-message">Loading...</div>
      </div>
      <div v-for="(imageBase64, index) in imageBase64List" :key="index">
        <img :src="imageBase64" alt="Graph" class="graph-img" />
      </div>
    </div>

    <div class="right-panel">
      <h2>Final Value List</h2>
      <table class="data-table">
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

      <div v-for="(result, tickerIndex) in backTestHistory" :key="tickerIndex" class="backtest-results">
        <h2>Backtest Results - {{ result[0]?.ticker || 'Unknown' }}</h2>
        <table class="data-table">
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
// 이전 스크립트 내용 그대로 유지
</script>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  gap: 20px;
  padding: 20px;
  height: 100vh;
}

.left-panel {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.right-panel, .center-panel {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h3, h2 {
  color: #333;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.select-box, .date-input {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
}

.remove-btn, .add-btn, .analysis-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.remove-btn:hover, .add-btn:hover, .analysis-btn:hover {
  background-color: #0056b3;
}

.range-input {
  margin-bottom: 10px;
}

.range-input label {
  font-weight: bold;
}

.range-input input {
  width: 100%;
}

.ticker-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #e3f2fd;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
}

.selected-dates {
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th, .data-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.graph-img {
  width: 100%;
  height: auto;
  margin-top: 20px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-message {
  font-size: 1.5em;
}
</style>
