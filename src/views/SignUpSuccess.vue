<template>
    회원가입에 성공했습니다. 축하합니다~~
    <button @click="goMain">메인 화면으로</button>
</template>

<script>
    import { useRoute } from 'vue-router';

    export default {
        setup() {
                const route = useRoute();
                return {
                    route
                };
            },

        methods: {
            goMain() {
                this.$router.push("/"); // 회원가입 페이지로 이동
            }
            
        }
    }
</script>