import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  manifest: {
    name: 'mcmods-modern',
    description: 'MCMod 网站美化扩展 — Claude Code 硬核编码科技风格',
    version: '0.1.0',
    icons: {
      128: '/icons/icon.svg',
    },
    permissions: ['storage'],
    host_permissions: ['*://*.mcmod.cn/*'],
    browser_specific_settings: {
      gecko: {
        id: 'mcmods-modern@example.com',
        strict_min_version: '115.0',
      },
    },
    // web_accessible_resources 由 WXT 自动从 content script 的 CSS import 推断
  },
  runner: {
    disabled: true,
  },
});
