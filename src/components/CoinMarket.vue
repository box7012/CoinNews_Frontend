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

    <table class="crypto-table">
      <colgroup>
        <col style="width: 20%;" />
        <col style="width: 30%;" />
        <col style="width: 30%;" />
        <col style="width: 20%;" />
      </colgroup>
      <thead>
        <tr>
          <th>코인명</th>
          <th @click="sortTable('current_price')" class="sortable">
            현재 가격 (USD)
            <span v-if="sortBy === 'current_price'">
              {{ sortOrder === 'asc' ? '▲' : sortOrder ===  'desc'? '▼' : '' }}
            </span>
          </th>
          <th @click="sortTable('total_volume')" class="sortable">
            24시간 거래량 (USD)
            <span v-if="sortBy === 'total_volume'">
              {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc'? '▼' : '' }}
            </span>
          </th>
          <th @click="sortTable('price_change_percentage_24h')" class="sortable">
            24시간 변동 (%)
            <span v-if="sortBy === price_change_percentage_24h">
              {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coin in displayedCoins" :key="coin.id">
          <td @click="selectCoin(coin)">{{ coin.name }}</td>
          <td>${{ coin.current_price.toLocaleString() }}</td>
          <td>${{ coin.total_volume.toLocaleString() }}</td>
          <td :style="{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }">
            {{ coin.price_change_percentage_24h.toFixed(2) }}%
          </td>
        </tr>
      </tbody>
    </table>
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
      showDropdown: false,
      sortBy: null,
      sortOrder: null,
    };
  },

  computed: {

    clearSearch() {
      this.searchQuery = "";
      this.showDropdown = false;
    },

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
              per_page: 50,
              page: 1,
              sparkline: false,
            },
          }
        );
        this.coins = response.data;
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    },

    selectCoin(coin) {
      this.updateSelectedCoin = coin.name;
      this.searchQuery = coin.name;
      this.showDropdown = false;
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
  },
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
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

</style>
