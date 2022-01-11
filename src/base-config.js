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
      intensity: 3,
    },
    directional: {
      color: 0xFFEFE4,
      intensity: 3,
      position: { x: 0.5, y: 2, z: -3 },
    },
  },
};

export default BASE_CONFIG;
