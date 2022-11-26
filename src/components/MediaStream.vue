<template>
  <div class="display-cover">
    <video v-if="myStreamSrc" id="myVideoEl" :srcObject ="myStreamSrc" autoplay="autoplay"></video>
    <canvas class="d-none"></canvas>
    <div class="video-options">
      <label for="selectcamera">Select camera</label>
      <select name="selectcamera" v-model="selectVal" class="custom-select" @change="changeCamera">
        <option v-for="(camera, index) in cameras" :value="camera.id" :key="index">
          {{ camera.label }}
        </option>
      </select>
    </div>

    <div class="controls">
      <button class="btn play" title="Play" @click="playVideo">
        <vue-feather type="play-circle"></vue-feather>
      </button>
      <button class="btn d-none" title="Pause" v-if="streamStarted">
        <vue-feather type="pause" stroke="red" fill="blue"></vue-feather>
      </button>
      <button class="btn d-none" title="ScreenShot">
        <vue-feather type="image"></vue-feather>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference types="webrtc" />
  import { ref, watch } from 'vue';

  const selectVal: null = ref(null);
  const cameras = ref([{}]);
  let streamStarted = false;
  let myStreamSrc = ref(null);
  let cameraId = '';
  let myVideoEl = ref();
  
  const constraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560,
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      },
    }
  };

  const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map((videoDevice, i) => {
      return { id: videoDevice.deviceId, label: videoDevice.label || String(i + 1)};
    });

    cameras.value = options;
  };

  getCameraSelection();
  
  const playVideo = () => {
    if (streamStarted) {
    
      return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
      const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraId
        }
      };
      startStream(updatedConstraints);
    }
  };
  
  const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
  };
  
  const handleStream = (stream) => {
    myStreamSrc = stream;
    streamStarted = true;
  };
  
  const changeCamera = (event) => {
    cameraId = event.target.value;
  };
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