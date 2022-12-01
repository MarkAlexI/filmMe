<template>
  <div class="display-cover">
    <video class="d-none" ref="myVideoEl" :srcObject="myStreamSrc" autoplay="autoplay"></video>
    <canvas class="d-none" ref="canvas"></canvas>
    <div class="video-options">
      <label for="selectcamera">Select camera</label>
      <br>
      <select name="selectcamera" v-model="selectVal" class="custom-select" @change="changeCamera">
        <option v-for="(camera, index) in cameras" :value="camera.id" :key="index">
          {{ camera.label }}
        </option>
      </select>
    </div>

    <img class="screenshot-image d-none" alt="" ref="screenshot">

    <div class="controls">
      <button class="btn play" title="Play" @click="playVideo" ref="playBtn">
        <vue-feather type="play-circle" />
      </button>
      <button class="btn d-none" title="Pause" ref="pauseBtn" @click="pauseVideo">
        <vue-feather type="pause" />
      </button>
      <button class="btn d-none" title="ScreenShot" ref="shotBtn" @click="doScreenshot">
        <vue-feather type="image" />
      </button>
    </div>
    
    <BatteryInfo />
  </div>
</template>

<script setup lang="ts">
  /// <reference types="webrtc" />
  import { ref, nextTick } from 'vue';
  import BatteryInfo from '@/BatteryInfo';

  const selectVal: null = ref(null);
  const cameras = ref([{}]);
  let streamStarted = false;
  const myStreamSrc = ref(null);
  const cameraId = ref('');

  const myVideoEl = ref(null);
  const playBtn = ref(null);
  const pauseBtn = ref(null);
  const shotBtn = ref(null);
  const canvas = ref(null);
  const screenshot = ref(null);

  interface devices {
    id: string,
      label: string
  };

  interface mediaConstraints {
    video: {
      width: {
        min: number,
        ideal: number,
        max: number,
      },
      height: {
        min: number,
        ideal: number,
        max: number
      },
      deviceId? : {
        exact? : string
      }
    }
  };

  const constraints: mediaConstraints = {
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

  const getCameraSelection = async (): Promise < void > => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = await videoDevices.map((videoDevice, i) => {
      return { id: videoDevice.deviceId, label: videoDevice.label || String(i + 1) };
    });

    cameras.value = options;
  };

  getCameraSelection();

  const playVideo = (): void => {
    if (streamStarted) {
      myVideoEl.value.play();
      playBtn.value.classList.add('d-none');
      pauseBtn.value.classList.remove('d-none');
      return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
      const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraId.value
        }
      };
      startStream(updatedConstraints);
    }
  };

  const pauseVideo = (): void => {
    render('pause');
  };

  const startStream = async (constraints: mediaConstraints): Promise < void > => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
  };

  const handleStream = (stream: MediaStream): void => {
    myStreamSrc.value = stream;
    render('play');
    streamStarted = true;
  };

  const changeCamera = (event: Event): void => {
    const option = event.target as HTMLOptionElement;
    cameraId.value = option.value;
  };

  const render = async (videoState: string): Promise < void > => {
    await nextTick();

    if (videoState === 'play') {
      myVideoEl.value.classList.remove('d-none');
      playBtn.value.classList.add('d-none');
      pauseBtn.value.classList.remove('d-none');
      shotBtn.value.classList.remove('d-none');
    }
    
    if (videoState === 'pause') {
      myVideoEl.value.pause();
      playBtn.value.classList.remove('d-none');
      pauseBtn.value.classList.add('d-none');
    }
  };
  
  const doScreenshot = () => {
    canvas.value.width = myVideoEl.value.videoWidth;
    canvas.value.height = myVideoEl.value.videoHeight;
    canvas.value.getContext('2d').drawImage(myVideoEl.value, 0, 0);
    screenshot.value.src = canvas.value.toDataURL('image/webp');
    screenshot.value.classList.remove('d-none');
  };
</script>

<style lang="scss">
  .d-none {
    display: none;
  }

  .display-cover {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 87%;
    margin: 5% auto;
    position: relative;
  }

  video {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    margin-bottom: 1.1rem;
  }

  .video-options {
    position: absolute;
    left: 1rem;
    top: 2rem;
  }
  
  .screenshot-image {
    width: 90px;
    height: 150px;
    border-radius: 4px;
    border: 2px solid whitesmoke;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 5px;
    left: 10px;
    background: white;
  }

  .controls {
    position: absolute;
    right: 1rem;
    top: 1rem;
    display: flex;

    &>button {
      width: 45px;
      height: 45px;
      text-align: center;
      border-radius: 100%;
      margin: 0 6px;
      background: transparent;
    }

    &s>button:hover svg {
      color: white !important;
    }

    @media (min-width: 300px) and (max-width: 400px) {
      & {
        flex-direction: column;
      }

      & button {
        margin: 5px 0 !important;
      }
    }

    &>button>svg {
      height: 20px;
      width: 18px;
      text-align: center;
      margin: 0 auto;
      padding: 0;
    }

    & button:nth-child(1) {
      border: 2px solid red;
    }

    & button:nth-child(1) svg {
      color: red;
    }

    & button:nth-child(2) {
      border: 2px solid lightblue;
    }

    & button:nth-child(2) svg {
      color: lightblue;
    }

    & button:nth-child(3) {
      border: 2px solid lightgreen;
    }

    & button:nth-child(3) svg {
      color: lightgreen;
    }
    
    & button:nth-child(3):hover {
      background-color: green;
    }

    &>button {
      width: 45px;
      height: 45px;
      text-align: center;
      border-radius: 100%;
      margin: 0 6px;
      background: transparent;
    }
    
    &>button:hover svg {
      color: white;
    }
  }
</style>