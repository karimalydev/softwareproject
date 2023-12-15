<script setup>
import ThreePuzzle from './components/ThreePuzzle.vue'
</script>

<template>
  <div id="app">
    <div class="puzzle">
    <ThreePuzzle />
    </div>
  </div>
</template>

<script>

export default {
  name: "App",
  components: {
    ThreePuzzle,
  },
};
</script>

<style>

</style>
