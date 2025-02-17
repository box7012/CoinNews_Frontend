import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      selectedCoin: null,
      isDarkMode: localStorage.getItem('darkMode') === 'true', // 초기값 설정
    };
  },
  mutations: {
    setSelectedCoin(state, coin) {
      state.selectedCoin = coin;
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', state.isDarkMode); // 상태를 localStorage에 저장
    },
    // 새로운 setDarkMode mutation 추가
    setDarkMode(state, value) {
      state.isDarkMode = value;
      localStorage.setItem('darkMode', value); // localStorage에 값 저장
    },
  },
  actions: {
    updateSelectedCoin({ commit }, coin) {
      commit('setSelectedCoin', coin);
    },
    toggleDarkMode({ commit }) {
      commit('toggleDarkMode');
    },
    // setDarkMode 액션도 추가할 수 있습니다.
    updateDarkMode({ commit }, value) {
      commit('setDarkMode', value);
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
