const BASE_CONFIG = {
  antialias: true,
  backgroundColor: 0xAAAAAA,
  camera: {
    fov: 60,
    near: 0.01,
    far: 500,
  },
  lights: {
    ambient: {
      color: 0xFFEFE4,
      intensity: 0.6,
    },
    directional: {
      color: 0xFFEFE4,
      intensity: 0.6,
      position: { x: 5, y: 5, z: 5 },
    },
  },
};

export default BASE_CONFIG;
