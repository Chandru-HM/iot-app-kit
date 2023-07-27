import { reactConfig } from '@iot-app-kit/jest-config';

const config = {
  ...reactConfig,
  roots: ['src'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 82,
      functions: 85,
      lines: 85,
    },
  },
};

export default config;
