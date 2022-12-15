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
  return [avg, avg, avg, 255];
};

const noise: mixFunction = (r, g, b, a) => {
  const rand = (.5 - Math.random()) * 100;
  return [r + rand, g + rand, b + rand, a];
};

export { goGreen, mix, goTransparent, negative, goGrey, noise };