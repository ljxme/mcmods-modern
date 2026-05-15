/**
 * mcmods-modern — Background Service Worker
 *
 * 扩展后台脚本（Manifest V3 Service Worker）
 * 负责：存储设置、处理消息、可选功能开关
 */

import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';

/* ── 消息类型定义 ── */
type ExtensionMessage =
  | { type: 'GET_SETTINGS' }
  | { type: 'SET_SETTING'; key: string; value: unknown }
  | { type: 'TOGGLE_ENABLED' };

type SuccessResponse<T = unknown> = { success: true; data?: T; enabled?: boolean };
type ErrorResponse = { success: false; error: string };

export default defineBackground(() => {
  console.log('[mcmods-modern] Background service worker started');

  // 初始化默认设置
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      browser.storage.local.set({
        enabled: true,
        styleMode: 'dark', // 'dark' | 'light'（未来扩展）
        showCLIDecoration: true,
        version: browser.runtime.getManifest().version,
      });
      console.log('[mcmods-modern] First install — settings initialized');
    }
  });

  // 消息处理：content script 与 popup/options 通信
  browser.runtime.onMessage.addListener(
    (message: unknown, _sender, sendResponse) => {
      const msg = message as ExtensionMessage;

      switch (msg.type) {
        case 'GET_SETTINGS': {
          browser.storage.local.get(null).then((settings) => {
            sendResponse({ success: true, data: settings } satisfies SuccessResponse);
          });
          return true; // 异步响应
        }

        case 'SET_SETTING': {
          browser.storage.local.set({ [msg.key]: msg.value }).then(() => {
            sendResponse({ success: true } satisfies SuccessResponse);
          });
          return true;
        }

        case 'TOGGLE_ENABLED': {
          browser.storage.local.get('enabled').then(({ enabled }) => {
            browser.storage.local.set({ enabled: !enabled }).then(() => {
              sendResponse({ success: true, enabled: !enabled } satisfies SuccessResponse);
            });
          });
          return true;
        }

        default: {
          sendResponse({ success: false, error: 'Unknown message type' } satisfies ErrorResponse);
          return true; // 保持返回类型一致
        }
      }
    },
  );
});
