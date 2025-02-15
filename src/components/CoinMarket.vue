<template>
  <div class="container">
    <!-- <h1 class="title">Crypto Dashboard</h1> -->

    <!-- 검색 입력창 -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="코인 검색"
        class="search-box"
        @focus="showDropdown = true"
        @blur="hideDropdown"
        @keydown.enter="filterCoinsOnEnter"
      />
      <button v-if="searchQuery" class="clear-button" @click="clearSearch">❌</button>
      <!-- 자동완성 목록 -->
      <ul v-if="showDropdown && filteredCoins.length" class="dropdown">
        <li v-for="coin in filteredCoins" :key="coin.id" @click="selectCoin(coin)">
          {{ coin.name }}
        </li>
      </ul>
    </div>
    <div class="main-content">
      <table class="crypto-table">
        <colgroup>
          <col style="width: 8%;" />
          <col style="width: 12%;" />
          <col style="width: 25%;" />
          <col style="width: 30%;" />
          <col style="width: 25%;" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>코인</th>
            <th @click="sortTable('current_price')" class="sortable">
              현재 가격 (USD)
              <span v-if="sortBy === 'current_price'">
                {{ sortOrder === 'asc' ? '▲' : sortOrder ===  'desc'? '▼' : '' }}
              </span>
            </th>
            <th @click="sortTable('total_volume')" class="sortable">
              24h 거래량 (USD)
              <span v-if="sortBy === 'total_volume'">
                {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc'? '▼' : '' }}
              </span>
            </th>
            <th @click="sortTable('price_change_percentage_24h')" class="sortable">
              24h 변동 (%)
              <span v-if="sortBy === 'price_change_percentage_24h'">
                {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="coin in displayedCoins" 
            :key="coin.id" 
            @click="selectCoin(coin)"
            :class="{'selected-coin': coin.id === selectedCoin?.id}"
          >
            <td>
              <img :src="coin.image" alt="Coin Image" style="width: 25px; height: 25px;" />
            </td>
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
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      coins: [],
      searchQuery: "",
      selectedCoin: null,
      showDropdown: false,
      sortBy: null,
      sortOrder: null,
    };
  },

  computed: {

    sortedCoins() {
      if (!this.sortBy || !this.sortOrder) return this.coins;
      return [...this.coins].sort((a, b) => {
        const valueA = a[this.sortBy];
        const valueB = b[this.sortBy];

        return this.sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
    },

    filteredCoins() {
      if (!this.searchQuery) return [];
      return this.sortedCoins.filter((coin) =>
        coin.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      );
    },

    displayedCoins() {
      return this.searchQuery ? this.filteredCoins : this.sortedCoins;
    },
  },

  methods: {

    ...mapActions(["updateSelectedCoin"]),

    clearSearch() {
      // selectedCoin은 null로 설정
      this.selectedCoin = null;

      // searchQuery 초기화
      this.searchQuery = null;

      // 드롭다운 숨기기
      this.showDropdown = false;

      // Vuex 상태도 업데이트 (선택된 코인 없음)
      this.updateSelectedCoin(null);
    },

    sortTable(column) {
      if (this.sortBy === column) {
        if (this.sortOrder === "asc") {
          this.sortOrder = "desc";
        } else if (this.sortOrder === "desc") {
          this.sortBy = null;
          this.sortOrder = null;
        }
      } else {
        this.sortBy = column;
        this.sortOrder = "asc";
      }
    },

    async fetchCryptoData() {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              // per_page: 50,
              // page: 1,
              // sparkline: false,
            },
          }
        );
        this.coins = response.data;
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    },

    // 코인 선택 또는 선택 해제
    selectCoin(coin) {
      if (this.selectedCoin && this.selectedCoin.id === coin.id) {
        // 이미 선택된 코인을 다시 클릭하면 null로 설정
        this.selectedCoin = null;
        this.updateSelectedCoin(null);
      } else {
        // 코인 선택
        this.selectedCoin = coin;
        this.updateSelectedCoin(coin.id);
      }
    },

    // ESC 키 눌렀을 때 selectedCoin을 null로 설정
    handleKeydown(event) {
      if (event.key === "Escape") {
        this.selectedCoin = null;
        this.updateSelectedCoin(null);
      }
    },



    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    },

    filterCoinsOnEnter() {
      this.showDropdown = false; // 드롭다운 숨기기
      // 테이블에 필터링된 코인만 표시
      if (this.searchQuery) {
        this.displayedCoins; // displayedCoins는 필터된 결과를 기반으로 계산됨
      }
    },
  },

  mounted() {
    this.fetchCryptoData();
    window.addEventListener("keydown", this.handleKeydown);
  },

  beforeDestroy() {
    // 컴포넌트가 제거되기 전에 이벤트 리스너 제거
    window.removeEventListener("keydown", this.handleKeydown);
  },

};
</script>

<style scoped>

/* 테이블 스타일 */
.crypto-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; /* 테이블 간격 */
  background-color: #fff; /* 배경색 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 테이블 그림자 */
  border-radius: 10px; /* 모서리 둥글게 */
}

.crypto-table th, .crypto-table td {
  padding: 12px 20px; /* 셀 내부 여백 */
  text-align: left;
  font-size: 16px; /* 글자 크기 */
  border-bottom: 1px solid #f1f1f1; /* 셀 하단 테두리 */
}

.crypto-table th {
  background-color: #f9f9f9; /* 헤더 배경 */
  font-weight: bold;
}

.crypto-table tr:hover {
  background-color: #f4f4f4; /* 호버시 배경색 */
}

.coin-row {
  cursor: pointer; /* 클릭 가능한 느낌 */
}

.coin-row:hover {
  background-color: #f1f1f1; /* 클릭 시 배경색 */
}


.search-container {
  position: sticky;
  top: 0;  /* 화면 상단에 고정되도록 */
  background-color: white;  /* 배경색을 설정하여 다른 요소들과 겹치지 않게 */
  z-index: 1000;  /* 다른 요소들 위에 표시되도록 */
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  /* 하단 그림자 */
}


/* 자동완성 드롭다운 */
.dropdown {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover {
  background: lightgray;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #f5f5f5;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-box {
  width: 100%;
  padding: 8px;
  padding-right: 40px; /* X 버튼과 겹치지 않도록 여유 공간 추가 */
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  font-size: 16px; /* 글자 크기 조정 */
}

.clear-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px; /* 버튼 너비 */
  height: 30px; /* 버튼 높이 */
  background: #e0e0e0; /* 배경색 */
  border: 1px solid #bbb; /* 테두리 추가 */
  font-size: 16px; /* X 크기 조정 */
  cursor: pointer;
  color: rgb(70, 70, 70);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px; /* 네모난 모양 유지 */
}

.clear-button:hover {
  background: #d6d6d6; /* 마우스 호버 시 색상 변경 */
}


.clear-button:hover {
  color: black;
}

.selected-coin {
  background-color: rgba(255, 215, 0, 0.2); /* 옅은 노란색 배경 */
  transition: background-color 0.3s ease-in-out;
}


</style>
