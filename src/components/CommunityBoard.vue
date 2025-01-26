<template>
    <div class="board">
      <h1 class="title">게시판</h1>

      <ul class="post-list">
        <li v-for="(post, index) in posts" :key="index" class="post-item">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-content">{{ post.content }}</p>
          <button @click="deletePost(index)" class="delete-button">삭제</button>
        </li>
      </ul>
    </div>
    <button @click="goToWritePage">글쓰기</button>
  </template>
  
  <script>

  import axios from 'axios';
  
  export default {
    data() {
      return {
        newPost: {
          title: '',
          content: ''
        },
        posts: []
      };
    },
    methods: {
      goToWritePage() {
        this.$router.push("writepage");
      },

      async loadPosts() {
        try {
            const response = await axios.get('/posts');
            this.posts = response.data;
        } catch (error) {
            console.error("Failed to load Posts: ", error)
        }

      }

    },

    mounted() {
        this.loadPosts();
    }

  };
  </script>
  
  <style scoped>
  .board {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  .title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  .input, .textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .button:hover {
    background-color: #0056b3;
  }
  .post-list {
    list-style: none;
    padding: 0;
  }
  .post-item {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
  }
  .post-title {
    font-size: 18px;
    margin-bottom: 5px;
  }
  .post-content {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .delete-button {
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .delete-button:hover {
    background-color: #a71d2a;
  }
  </style>
  