<template>
  <div id="app">
    <TheLogin v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    <TaskListMorning v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TaskListMorning from './components/TaskListMorning.vue';
import TheLogin from './components/TheLogin.vue';

export default defineComponent({
  name: 'App',
  components: {
    TaskListMorning,
    TheLogin
  },
  setup() {
    const jwtToken = localStorage.getItem('jwtToken');
    const isLoggedIn = ref(!!jwtToken);
    const handleLoginSuccess = (token: string) => {
      localStorage.setItem('jwtToken', token);
      isLoggedIn.value = true;
    };
    return {
      isLoggedIn,
      handleLoginSuccess
    };
  }
});
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>