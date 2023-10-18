<template>
  <div>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<style scoped>
button {
  margin-top: 10px;
  padding: 5px 15px;
  font-size: 16px;
  cursor: pointer;
}
</style>
