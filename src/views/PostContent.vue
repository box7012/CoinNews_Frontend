<template>
    <div>
        <h1>제목 : {{ post.title }}</h1>
        <h2>작성자 : {{ post.email}}</h2>
        <h2>날짜 : {{ post.createdDate}}</h2>
        <p>내용 : {{ post.text }}</p>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        post: {}
      };
    },
    created() {
      const postId = this.$route.params.id;
      this.fetchPost(postId);
    },
    methods: {
      async fetchPost(id) {
        try {
          const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
          this.post = response.data;
          console.log(this.post);
        } catch (error) {
          console.error("게시글을 불러오는 중 오류 발생:", error);
          this.post = { title: "게시글 없음", content: "" };
        }
      }
    }
  };
  </script>