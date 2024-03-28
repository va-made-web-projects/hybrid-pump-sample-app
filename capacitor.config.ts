import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recover.hybridpump',
  appName: 'Hybrid Pump Companion',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
