import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Capacitor用の静的エクスポート設定
  output: 'export',
  // 画像最適化を無効化（静的エクスポート時に必要）
  images: {
    unoptimized: true,
  },
  // トレイリングスラッシュを追加（Capacitorとの互換性向上）
  trailingSlash: true,
};

export default nextConfig;
