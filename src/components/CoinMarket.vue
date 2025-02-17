<template>
  <div :class="{ 'dark': isDarkMode }" class="container">
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
          <col style="width: 7%;" />
          <col style="width: 12%;" />
          <col style="width: 26%;" />
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
                {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '' }}
              </span>
            </th>
            <th @click="sortTable('total_volume')" class="sortable">
              24h 거래량 (USD)
              <span v-if="sortBy === 'total_volume'">
                {{ sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '' }}
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
            :class="{'selected-coin': coin.id === selectedCoin?.id}"> 
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
import { mapActions, mapGetters } from "vuex";

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
    ...mapGetters(['isDarkMode']),

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
      this.selectedCoin = null;
      this.searchQuery = null;
      this.showDropdown = false;
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
            },
          }
        );
        this.coins = response.data;
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    },

    selectCoin(coin) {
      if (this.selectedCoin && this.selectedCoin.id === coin.id) {
        this.selectedCoin = null;
        this.updateSelectedCoin(null);
      } else {
        this.selectedCoin = coin;
        this.updateSelectedCoin(coin.id);
      }
    },

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
      this.showDropdown = false;
      if (this.searchQuery) {
        this.displayedCoins;
      }
    },
  },

  mounted() {
    this.fetchCryptoData();
    window.addEventListener("keydown", this.handleKeydown);
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style>
.container {
  transition: background-color 0.3s, color 0.3s;
}

.crypto-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.crypto-table th,
.crypto-table td {
  padding: 12px 20px;
  text-align: left;
  font-size: 16px;
  border-bottom: 1px solid #f1f1f1;
}

.crypto-table th {
  background-color: #f9f9f9;
  font-weight: bold;
}

.crypto-table tr:hover {
  background-color: #f4f4f4;
}

.coin-row {
  cursor: pointer;
}

.coin-row:hover {
  background-color: #f1f1f1;
}

.search-container {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 900;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

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

.search-box {
  width: 100%;
  padding: 8px;
  padding-right: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  position: relative;
}

.clear-button {
  position: absolute;
  top: 12px;
  right: 15px;
  width: 30px;
  height: 30px;
  background: #e0e0e0;
  border: 1px solid #bbb;
  font-size: 16px;
  cursor: pointer;
  color: rgb(70, 70, 70);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}


.clear-button:hover {
  background: #d6d6d6;
  transform: translateY(5%) translateY(-3px);
}

.selected-coin {
  background-color: rgba(180, 235, 91, 0.911);
  transition: background-color 0.3s ease-in-out;
  font-weight: bold;  /* 글자 굵게 */
}

/* 다크모드 관련 스타일 */
.dark {
  background-color: #1b1b1b;  /* 배경색 어두운 색 */
  color: #fff;  /* 텍스트 색 흰색 */
}

.dark .crypto-table {
  background-color: #444;  /* 테이블 배경 어두운 색 */
  color: #fff;  /* 테이블 텍스트 색 흰색 */
}

.dark .search-container {
  background-color: #555;  /* 검색창 배경 어두운 색 */
  color: white;
}

/* 다크 모드에서 placeholder 텍스트 색상 */
.dark .search-container input::placeholder {
  color: #ffffff; /* 어두운 배경에 잘 보이는 밝은 색 */
}

.dark .search-box {
  background-color: #2c2c2c;  /* 검색창 입력란 배경 어두운 색 */
  color: #fff;  /* 텍스트 색 흰색 */
}

.dark .dropdown {
  background-color: #444;  /* 드롭다운 배경 어두운 색 */
}

.dark .sortable:hover {
  background-color: #666;  /* 테이블 헤더 호버 시 배경 어두운 색 */
}

/* 다크모드에서 테이블 헤더 스타일 */
.dark .crypto-table th {
  background-color: #444;  /* 어두운 배경색 */
  color: #fff;  /* 흰색 텍스트 */
}

.dark .crypto-table th.sortable:hover {
  background-color: #555;  /* 호버 시 배경색을 조금 더 어두운 색으로 */
}

/* 다크모드에서 테이블 항목 호버링 시 스타일 */
.dark .crypto-table tbody tr:hover {
  background-color: #555;  /* 어두운 배경색 */
  color: #fff;  /* 흰색 텍스트 */
}

/* 다크모드에서 선택된 항목의 스타일 */
.dark .crypto-table .selected-coin {
  background-color: #124b12;  /* 선택된 항목의 배경색 */
  color: #ffffff;  /* 선택된 항목의 텍스트 색 */
  font-weight: bold;  /* 글자 굵게 */
}

</style>
