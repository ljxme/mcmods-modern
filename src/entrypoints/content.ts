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
import '../styles/components/banner.css';
import '../styles/components/cards.css';
import '../styles/components/buttons.css';
import '../styles/components/tables.css';
import '../styles/components/search.css';
import '../styles/components/footer.css';
import '../styles/pages/home.css';
import '../styles/pages/item.css';
import '../styles/pages/list.css';

import { createObserver, injectCLIDecoration, injectStyle } from '../utils/observer';

export default defineContentScript({
  matches: ['*://*.mcmod.cn/*'],
  runAt: 'document_start',

  main() {
    // ── FOUC 防护：先隐藏，CSS 加载后恢复（借鉴 BewlyBewly） ──
    injectStyle(
      'body{visibility:hidden}html[data-mcmods-theme] body{visibility:visible}',
      '__mcmods-fouc-guard',
    );

    // ── 主题初始化（在 CSS 注入后立即设置，防止闪烁） ──
    initTheme();

    // ── CLI 终端装饰 + 主题切换 + Observer ──
    if (document.body) {
      injectCLIDecoration();
      injectThemeToggle();
      startObserver();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        injectCLIDecoration();
        injectThemeToggle();
        startObserver();
      });
    }

    // ── 开发者控制台签名 ──
    console.log(
      '%c mcmods-modern %c v0.1.0 ',
      'background:#000;color:#fff;font-family:Geist,sans-serif;padding:2px 6px;border-radius:2px',
      'background:#111;color:#a1a1aa;font-family:Geist,sans-serif;padding:2px 6px;border-radius:2px',
    );
  },
});

/**
 * 主题初始化 — 默认跟随系统，其次读取 localStorage
 * 在 document_start 执行以消除 page-load 闪烁
 */
function initTheme(): void {
  const root = document.documentElement;
  // 排除存储可能不存在的情况（background script 也有可能）
  const stored = (() => { try { return localStorage.getItem('mcmods-theme'); } catch { return null; } })();
  const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-mcmods-theme', theme);
}

/**
 * 注入主题切换按钮 — 右下角固定圆形按钮
 * 点击切换 dark ⇄ light
 */
function injectThemeToggle(): void {
  const id = '__mcmods-theme-toggle';
  if (document.getElementById(id)) return;

  const btn = document.createElement('button');
  btn.id = id;
  btn.setAttribute('aria-label', 'Toggle theme');

  const root = document.documentElement;
  const current = root.getAttribute('data-mcmods-theme') || 'dark';
  btn.textContent = current === 'dark' ? '\u263e' : '\u2600';

  btn.style.cssText = `
    position: fixed; bottom: 12px; left: 12px; z-index: 99998;
    width: 36px; height: 36px;
    border: 1px solid #30363d;
    background: #0d1117;
    color: #c9d1d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: grid; place-items: center;
    transition: background 0.15s ease, transform 0.15s ease;
    padding: 0; line-height: 1;
  `;

  btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.08)'; });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });

  btn.addEventListener('click', () => {
    const r = document.documentElement;
    const cur = r.getAttribute('data-mcmods-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-mcmods-theme', next);
    btn.textContent = next === 'dark' ? '\u263e' : '\u2600';
    try { localStorage.setItem('mcmods-theme', next); } catch { /* quota or private */ }
  });

  document.body.appendChild(btn);
}

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
