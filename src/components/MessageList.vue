<template>
  <div>
    <input v-model="newMessage" placeholder="Type a message" />
    <button @click="addMessage">Add Message</button>
    <ul>
      <li v-for="message in messages" :key="message.id">{{ message.text }} - {{ message.createdAt }}
        <button @click="deleteMessage(message.id)">deleteMessage</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      messages: [],
      newMessage: ''
    };
  },
  methods: {
    // 메시지 추가
    async addMessage() {
      if (this.newMessage.trim()) {
        try {
          const response = await axios.post('http://192.168.0.2:8080/api/messages', {
            text: this.newMessage
          });
          this.messages.push(response.data); // 서버에서 반환된 데이터를 추가
          this.newMessage = '';
        } catch (error) {
          console.error('Failed to add message:', error);
        }
      }
    },

    // 메시지 삭제
    async deleteMessage(id) {
      try {
        await axios.delete(`http://192.168.0.2:8080/api/messages/${id}`);
        this.messages = this.messages.filter(message => message.id !== id); // 삭제된 메시지 제거
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    },

    // 초기 메시지 로드
    async loadMessages() {
      try {
        const response = await axios.get('http://192.168.0.2:8080/api/messages');
        this.messages = response.data;
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    }
  },
  
  mounted() {
    this.loadMessages(); // 컴포넌트가 로드될 때 초기 메시지 가져오기
  }
};
</script>