const goGreen: mixFunction = (r, g, b, a) => {
  return [r * .3, g * .59, b * .11, 255];
};

const mix: mixFunction = (r, g, b, a) => {
  return [g, b, r, 255];
};

const goTransparent: mixFunction = (r, g, b, a) => {
  return [r, g, b, 120];
};

const negative: mixFunction = (r, g, b, a) => {
  return [255 - r, 255 - g, 255 - b, a];
};

const goGrey: mixFunction = (r, g, b, a) => {
  const avg = r * .3 + g * .59 + b * .11;
  return [avg, avg, avg, a];
};

const noise: mixFunction = (r, g, b, a) => {
  const rand = (.5 - Math.random()) * 100;
  return [r + rand, g + rand, b + rand, a];
};

const sepia: mixFunction = (r, g, b, a) => {
  const avg = .3 * r + .59 * g + .11 * b;
  return [avg + 100, avg + 50, avg, a];
};

const blackAndWhite: mixFunction = (r, g, b, a) => {
  const avg = .3 * r + .59 * g + .11 * b;
  return avg > 127 ? [255, 255, 255, a] : [0, 0, 0, a];
};

const hsla2rgb = ({ h, s, l, alpha }: hsla): number[] => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255), alpha];
}

const rgb2hsla = (r: number, g: number, b: number, a: number = 255): hsla => {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
  }

  return { h: h * 60, s: s, l: l, alpha: a };
}

const correctHsla = (r: number, g: number, b: number, a: number, coord: 'h' | 's' | 'l', direction: 'up' | 'down', value: number) => {
  const pixel = rgb2hsla(r, g, b, a);
  pixel[coord] = pixel[coord] + (direction === 'up' ? 1 : -1) * value;
  return hsla2rgb(pixel);
};

const plusSat: mixFunction = (r, g, b, a) => {
  return correctHsla(r, g, b, a, 's', 'up', 2);
}

const plusHue: mixFunction = (r, g, b, a) => {
  return correctHsla(r, g, b, a, 'h', 'up', 50);
};

const plusLight: mixFunction = (r, g, b, a) => {
  return correctHsla(r, g, b, a, 'l', 'up', .2);
};

export { goGreen, mix, goTransparent, negative, goGrey, noise, sepia, blackAndWhite, plusSat, plusHue, plusLight };