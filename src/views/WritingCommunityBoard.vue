<template>
    <form @submit.prevent="addPost" class="form">
        <input v-model="newPost.title" type="text" placeholder="제목" class="input" required />
        <textarea v-model="newPost.content" placeholder="내용" class="textarea" required></textarea>
        <button type="submit" class="button">등록</button>
        <button type="button" @click="backToCommunityBoard" class="button">게시판으로</button>
    </form>
</template>

<script>

import axios from 'axios';
import { useRoute } from 'vue-router';

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

    backToCommunityBoard() {
        // this.$router.push("/");
        this.$router.go(-1); 
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
