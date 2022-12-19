type mixFunction = (r: number, g: number, b: number, a: number) => number[];

type hsla = {
  h: number,
  s: number,
  l: number,
  alpha: number
};

type BatteryManager = {
  charging: boolean,
  chargingTime: number,
  dischargingTime: number,
  level: number,
  onchargingchange: Event | null,
  onchargingtimechange: Event | null,
  ondischargingtimechange: Event | null,
  onlevelchange: Event | null
};

interface Navigator extends Navigator {
  getBattery ? : () => Promise < BatteryManager > ;
};

interface mediaConstraints {
  video: {
    width: {
      min?: number,
      ideal: number,
      max?: number,
    },
    height: {
      min?: number,
      ideal: number,
      max?: number
    },
    deviceId?: {
      exact?: string
    }
  }
};
