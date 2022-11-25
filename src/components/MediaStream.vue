<template>
  <div class="display-cover">
    <video autoplay></video>
    <canvas class="d-none"></canvas>
    <div class="video-options">
      <label for="selectcamera">Select camera</label>
      <select name="selectcamera" v-model="selectVal" class="custom-select">
        <option v-for="(camera, index) in cameras" :value="camera.id" :key="index">
          {{ camera.label }}
        </option>
      </select>
    </div>

    <div class="controls">
      <button class="btn play" title="Play">
        <vue-feather type="play-circle"></vue-feather>
      </button>
      <button class="btn d-none" title="Pause">
        <vue-feather type="pause" stroke="red" fill="blue"></vue-feather>
      </button>
      <button class="btn d-none" title="ScreenShot">
        <vue-feather type="image"></vue-feather>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const selectVal: null = ref(null);
  const cameras = ref([{}]);

  const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map((videoDevice, i) => {
      return { id: videoDevice.deviceId, label: videoDevice.label || String(i + 1)};
    });

    cameras.value = options;
  };

  getCameraSelection();
</script>

<style lang="scss">
  h1 {
    font-size: 28px;
    color: rebeccapurple;
    margin-bottom: 30px;
  }

  .d-none {
    display: none;
  }
</style>