<template>
  <div>c{{result}}</div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const result = ref('asd');

      return { result };
    }
  });
</script>

<style lang="scss">
  $body-color: red;

  body {
    background-color: $body-color;
  }
</style>