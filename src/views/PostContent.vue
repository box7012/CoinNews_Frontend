<template>
    <div>
      <h1>{{ post.title }}</h1>
      <p>{{ post.content }}</p>
    </div>
  </template>
  
  <script>
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
      fetchPost(id) {
        const samplePosts = [
          { id: "1", title: "첫 번째 게시글", content: "첫 번째 게시글 내용입니다." },
          { id: "2", title: "두 번째 게시글", content: "두 번째 게시글 내용입니다." }
        ];
        this.post = samplePosts.find(post => post.id === id) || { title: "게시글 없음", content: "" };
      }
    }
  };
  </script>