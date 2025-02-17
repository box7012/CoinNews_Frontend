import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      selectedCoin: null,
      isDarkMode: localStorage.getItem('darkMode') === 'true',
    };
  },
  mutations: {
    setSelectedCoin(state, coin) {
      state.selectedCoin = coin;
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', state.isDarkMode);
    },
  },
  actions: {
    updateSelectedCoin({ commit }, coin) {
      commit('setSelectedCoin', coin);
    },
    toggleDarkMode({ commit }) {
      commit('toggleDarkMode');
    },
  },
  getters: {
    getSelectedCoin(state) {
      return state.selectedCoin;
    },
    isDarkMode(state) {
      return state.isDarkMode;
    },
  },
});

export default store;
