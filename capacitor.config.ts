import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weatherexam.app',
  appName: '気象検定3級',
  webDir: 'out',
  server: {
    // 本番用設定（デプロイ後にURLを設定）
    // url: 'https://your-vercel-app.vercel.app',
    // cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#f0f9ff',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f0f9ff',
      showSpinner: false,
    },
  },
};

export default config;

