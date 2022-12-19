<template>
  <div class="container">
    <MyHeader />
    <MediaStream />
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
  
  body {
    background-color: lightcyan;
  }

  .container {
    max-width: 1024px;
    padding-top: 1rem;
    margin: 10px 20px;
    background-color: dodgerblue;
    min-height: 250px;
  }
</style>
