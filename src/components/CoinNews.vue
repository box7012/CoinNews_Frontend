<template>
    <div>
      <input v-model="searchQuery" placeholder="검색어를 입력하세요" />
      <button @click="searchNews">검색</button>
      <ul>
        <li v-for="information in news" :key="information.id">{{ information.date }} - {{ information.title }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        searchQuery: "",
        news: [],
      };
    },

    methods: {

        async searchNews() {
            try {
                if (!this.searchQuery.trim()) {
                    alert("검색어를 입력하세요.");
                    return;
                }

                const response = await axios.post("http://180.83.251.5:8080/api/news/search", {
                    query: this.searchQuery,
                })

                this.news = response.data.slice(-5);
            } catch (error) {
                console.error("검색 실패 : ", error);
            }
        },

        async loadMessages() {
            try {
                const response = await axios.get('http://180.83.251.5:8080/api/news');
                this.news = response.data.slice(-5);
            } catch (error) {
                console.error("Failed to load Messages: ", error)
            }
        },

        startmessagePolling() {
            this.loadMessages();
            setInterval(this.loadMessages, 5000); 
        }
    },

    
    mounted() {
      this.startmessagePolling();
    }
  };
  </script>