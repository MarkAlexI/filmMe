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
    
    <div class="image-options">
      <label for="select-effect">Select effect</label>
      <br>
      <select name="select-effect" v-model="selectEffect" class="custom-select" @change="changeEffect">
        <option default value="none">---None---</option>
        <option v-for="(effect, index) in effects" :value="effect.name" :key="index">
          {{ effect.text }}
        </option>
      </select>
    </div>

    <img class="screenshot-image original d-none" alt="original image" ref="screenshot">
    <img class="screenshot-image selfie d-none" alt="selfie image" ref="selfie">

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
      <button class="btn d-none" title="Save" ref="saveBtn" @click="saveSelfie">
        <vue-feather type="save" />
      </button>
    </div>

    <BatteryInfo></BatteryInfo>
  </div>
</template>

<script setup lang="ts">
  /// <reference types="webrtc" />
  import { ref, nextTick } from 'vue';
  import BatteryInfo from '@/BatteryInfo.vue';
  import { goGreen, mix, goTransparent, negative, goGrey, noise, sepia, blackAndWhite, plusSat } from '../utils/effects';

  const selectVal: null = ref(null);
  const selectEffect = ref('none');
  const cameras = ref([{}]);
  const effects = ref([
    { name: 'lessOpacity', text: 'Less opacity', method: goTransparent },
    { name: 'goGreen', text: 'Make green photo', method: goGreen },
    { name: 'mix', text: 'Mix this', method: mix },
    { name: 'negative', text: 'Make negative', method: negative },
    { name: 'goGrey', text: 'Grayscale', method: goGrey },
    { name: 'noise', text: 'Add noise', method: noise},
    { name: 'sepia', text: 'Old sepia', method: sepia },
    { name: 'blackAndWhite', text: 'Only black and white', method: blackAndWhite },
    { name: 'plusSaturation', text: 'More saturation', method: plusSat }
  ]);
  let streamStarted = false;
  const myStreamSrc = ref(null);
  const cameraId = ref('');
  const currentEffect = ref('none');

  const myVideoEl = ref(null);
  const playBtn = ref(null);
  const pauseBtn = ref(null);
  const shotBtn = ref(null);
  const saveBtn = ref(null);
  
  const canvas = ref(null);
  const screenshot = ref(null);
  const selfie = ref(null);

  const srcData = ref(null);
  let cloned: Uint8ClampedArray | null = null;

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
  
  const changeEffect = (event: Event): void => {
    const option = event.target as HTMLOptionElement;
    currentEffect.value = option.value;
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

  const doScreenshot = (): void => {
    canvas.value.width = myVideoEl.value.videoWidth;
    canvas.value.height = myVideoEl.value.videoHeight;
    canvas.value.getContext('2d').drawImage(myVideoEl.value, 0, 0);
    screenshot.value.src = canvas.value.toDataURL('image/webp');
    screenshot.value.classList.remove('d-none');
    selfie.value.classList.remove('d-none');
    saveBtn.value.classList.remove('d-none');
    grabImageData();
    remakeImage();
  };

  const grabImageData = (): void => {
    const ctx = canvas.value.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
    srcData.value = imageData;
    cloned = new Uint8ClampedArray(imageData.data);
  };

  const remakeImage = (): void => {
    if (!srcData.value) return;

    const canvasWidth = canvas.value.width;
    const canvasHeight = canvas.value.height;
    let buf8 = new Uint8ClampedArray(cloned);
    const effect = effects.value.find(el => el.name === currentEffect.value);
    const action = effect?.method;
   
    if (action) {
      for (let y = 0; y < canvasHeight; ++y) {
        for (let x = 0; x < canvasWidth; ++x) {
          let index = (y * canvasWidth + x) * 4;
          makeEffect(buf8, index, action);
        }
      }
    }
    
    srcData.value.data.set(buf8);
    canvas.value.getContext('2d').putImageData(srcData.value, 0, 0);

    selfie.value.src = canvas.value.toDataURL('image/webp');
  };
  
  const makeEffect = (arr: Uint8ClampedArray, i: number, f: Function): void => {
    let red = arr[i], green = arr[i + 1],
        blue = arr[i + 2], alfa = arr[i + 3];
    const temp = f(red, green, blue, alfa);
    [arr[i], arr[i + 1], arr[i + 2], arr[i + 3]] = temp;
  };
  
  const saveSelfie = (): void => {
    const image = canvas.value.toDataURL("image/png");
    let link = document.createElement('a');
    link.setAttribute("download", "Selfie.png");
    link.setAttribute("href", image);
    link.click();
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
  
  %options {
    position: absolute;
    left: 1rem;
    
    & label {
      text-shadow: 1px 1px 2px whitesmoke;
    }
  }

  .video-options {
    @extend %options;
    top: 1rem;
  }
  
  .image-options {
    @extend %options;
    top: 4rem;
  }

  %screenshot {
    width: 5.625rem;
    height: 9.375rem;
    border-radius: 4px;
    border: 2px solid whitesmoke;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    bottom: 1.5rem;
    background: white;
  }
  
  .original {
    @extend %screenshot;
    left: .6rem;
  }
  
  .selfie {
    @extend %screenshot;
    left: 7rem;
  }
  
  .custom-select {
    font-weight: bold;
  }
  
  option {
    background-color: yellow;
    color: red;
  }

  .controls {
    position: absolute;
    right: 1rem;
    top: 1rem;
    display: flex;

    &>button {
      width: 2.8125rem;
      height: 2.8125rem;
      text-align: center;
      border-radius: 100%;
      margin: 0 .375rem;
      background: transparent;
    }

    &s>button:hover svg {
      color: white !important;
    }

    @media (min-width: 300px) and (max-width: 420px) {
      & {
        flex-direction: column;
      }

      & button {
        margin: 5px 0 !important;
      }
    }

    &>button>svg {
      height: 1.25rem;
      width: 1.125rem;
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
    
    & button:nth-child(4) {
      border: 2px solid blue;
    }
    
    & button:nth-child(4) svg {
      color: blue;
    }
    
    & button:nth-child(4):hover {
      background-color: lightblue;
    }

    &>button {
      width: 2.8125rem;
      height: 2.8125rem;
      text-align: center;
      border-radius: 100%;
      margin: 0 .375rem;
      background: transparent;
    }

    &>button:hover svg {
      color: white;
    }
  }
</style>