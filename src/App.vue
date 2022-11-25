<template>
  <div class="container">
    <MyHeader></MyHeader>
    <MediaStream></MediaStream>
  </div>
</template>

<script setup lang="ts">
  import MyHeader from '@/MyHeader';
  import MediaStream from '@/MediaStream';
  
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  .container {
    margin: 10px 20px;
  }
</style>
