<template>
  <div class="battery" v-if="haveBattery">
    <p ref="batteryLevel"></p>
    <vue-feather :type="batteryState" stroke="yellow" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const haveBattery = !!navigator.getBattery;
  const batteryLevel = ref(null);
  const batteryState = ref('battery');

  if (haveBattery) {
    const getBatteryLevel = async () => {
      const batteryManager = await navigator.getBattery();
      const level = batteryManager.level;
      const charging = batteryManager.charging;
      
      const updateChargeInfo = () => {
        batteryState.value = batteryManager.charging ?
          'battery-charging' :
          'battery';
      };
      
      const updateLevelInfo = () => {
        batteryLevel.value.textContent = `${Math.round(batteryManager.level * 10000)/100}%`;
      };
      updateLevelInfo();
      
      batteryManager.addEventListener('chargingchange', updateChargeInfo);
      batteryManager.addEventListener('levelchange', updateLevelInfo);
    };
    
    getBatteryLevel();
  }
</script>

<style lang="scss">
  .battery {
    position: absolute;
    right: 1rem;
    bottom: 1rem;

    & p {
      font-size: .8rem;
      color: yellow;
    }
  }
</style>