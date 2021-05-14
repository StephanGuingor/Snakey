<template>
    <SnakeGame/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SnakeGame from "@/components/SnakeGame.vue";


export default defineComponent({
  name: 'App',
  components: {
    SnakeGame

  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>