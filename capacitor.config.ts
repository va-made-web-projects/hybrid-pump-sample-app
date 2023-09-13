import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Hybrid Pump Companion',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
