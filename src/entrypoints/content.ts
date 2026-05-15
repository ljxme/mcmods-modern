/**
 * mcmods-modern — Content Script
 * 在 MCMod 页面注入终端风格样式 + CLI 装饰
 *
 * 流程：
 *   1. CSS 在 document_start 注入，防止闪烁（WXT 自动注入 import 的 CSS）
 *   2. CLI 终端装饰在 body 可用时附加
 *   3. MutationObserver 监听动态加载的内容，确保新元素也被覆盖样式
 */
import { defineContentScript } from 'wxt/sandbox';

import '../styles/base/variables.css';
import '../styles/base/reset.css';
import '../styles/base/scrollbar.css';
import '../styles/components/navbar.css';
import '../styles/components/cards.css';
import '../styles/components/buttons.css';
import '../styles/components/tables.css';
import '../styles/components/modals.css';
import '../styles/components/search.css';
import '../styles/pages/home.css';
import '../styles/pages/item.css';
import '../styles/pages/list.css';

import { createObserver, injectCLIDecoration } from '../utils/observer';

export default defineContentScript({
  matches: ['*://*.mcmod.cn/*'],
  runAt: 'document_start',

  main() {
    // ── CLI 终端装饰 ──
    if (document.body) {
      injectCLIDecoration();
      startObserver();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        injectCLIDecoration();
        startObserver();
      });
    }

    // ── 开发者控制台签名 ──
    console.log(
      '%c mcmods-modern %c v0.1.0 ',
      'background:#1a1b26;color:#3fb950;font-family:monospace;padding:2px 6px;border-radius:2px',
      'background:#30363d;color:#c9d1d9;font-family:monospace;padding:2px 6px;border-radius:2px',
    );
  },
});

/**
 * 启动 MutationObserver 监听动态加载的内容
 * 当页面通过 AJAX/动态渲染加载新卡片、列表项等元素时，
 * CSS 会自动生效（非侵入式），observer 负责触发防抖回调
 * 用于未来可能的动态样式修补
 */
function startObserver(): void {
  createObserver(
    (_mutations) => {
      // 默认回调 —— CSS 已通过选择器覆盖至所有元素
      // 未来可在此处添加动态样式修补逻辑
    },
    {
      debounceMs: 100,
      subtree: true,
    },
  );
}
