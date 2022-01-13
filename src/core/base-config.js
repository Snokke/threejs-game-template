const BASE_CONFIG = {
  antialias: true,
  backgroundColor: 0xAAAAAA,
  camera: {
    fov: 60,
    near: 0.01,
    far: 500,
    startPosition: { x: 10, y: 8, z: 10 },
  },
  lights: {
    ambient: {
      color: 0xFFEFE4,
      intensity: 0.8,
    },
    directional: {
      color: 0xFFEFE4,
      intensity: 0.8,
      position: { x: -2, y: 7, z: -7 },
    },
  },
  physics: {
    enableCannonDebugger: true,
    gravity: { x: 0, y: -9.82, z: 0 },
    sleepSpeedLimit: 0.2,
    sleepTimeLimit: 0.5,
  }
};

export default BASE_CONFIG;
