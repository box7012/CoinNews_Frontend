// src/store.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      selectedCoin: null,
    };
  },
  mutations: {
    setSelectedCoin(state, coin) {
      state.selectedCoin = coin;
    },
  },
  actions: {
    updateSelectedCoin({ commit }, coin) {
      commit('setSelectedCoin', coin);
    },
  },
  getters: {
    getSelectedCoin(state) {
      return state.selectedCoin;
    },
  },
});

export default store;