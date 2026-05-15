/**
 * mcmods-modern — MutationObserver 封装
 * 监听 DOM 变化，对动态加载内容应用样式
 */

type ObserverCallback = (mutations: MutationRecord[]) => void;

interface ObserverOptions {
  /** 防抖延迟（毫秒），默认 100ms */
  debounceMs?: number;
  /** 目标选择器过滤 — 只有匹配的元素变化才触发回调 */
  targetSelector?: string;
  /** 监听子树变化，默认 true */
  subtree?: boolean;
}

/**
 * 创建带防抖和条件过滤的 MutationObserver
 *
 * @param callback  变化回调
 * @param options   配置选项
 * @returns         返回 disconnect 函数，用于清理
 */
export function createObserver(
  callback: ObserverCallback,
  options: ObserverOptions = {},
): () => void {
  const {
    debounceMs = 100,
    targetSelector,
    subtree = true,
  } = options;

  let timer: ReturnType<typeof setTimeout> | null = null;

  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    // 条件过滤：如果指定了 targetSelector，检查是否有匹配的元素变化
    if (targetSelector) {
      const hasTarget = mutations.some((mutation) => {
        if (mutation.type === 'childList') {
          // 检查新增节点
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              if (
                node.matches(targetSelector) ||
                node.querySelector(targetSelector)
              ) {
                return true;
              }
            }
          }
        }
        // 检查属性变化的目标元素
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof HTMLElement
        ) {
          if (mutation.target.matches(targetSelector)) {
            return true;
          }
        }
        return false;
      });

      if (!hasTarget) return;
    }

    // 防抖处理
    if (debounceMs <= 0) {
      callback(mutations);
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => callback(mutations), debounceMs);
    }
  });

  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree,
    attributes: targetSelector ? true : false,
    attributeFilter: targetSelector ? ['class', 'style'] : undefined,
  });

  // 返回清理函数
  return () => {
    if (timer) clearTimeout(timer);
    observer.disconnect();
  };
}

/**
 * 注入样式表到页面
 *
 * @param cssText    CSS 文本
 * @param id         可选 style 元素 id（用于去重）
 * @returns          style 元素引用
 */
export function injectStyle(cssText: string, id?: string): HTMLStyleElement {
  // 去重检查
  if (id) {
    const existing = document.getElementById(id);
    if (existing) return existing as HTMLStyleElement;
  }

  const style = document.createElement('style');
  if (id) style.id = id;
  style.textContent = cssText;
  document.head.appendChild(style);
  return style;
}

/**
 * 注入 CLI 终端装饰到页面顶部
 * 样式：伪终端提示符 `> mcmod.modern loaded`
 */
export function injectCLIDecoration(): void {
  const id = '__mcmods-cli-decoration';
  if (document.getElementById(id)) return;

  const el = document.createElement('div');
  el.id = id;
  el.innerHTML = '<span class="mcmods-prompt">></span> mcmod.modern loaded';
  el.style.cssText = `
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 99999;
    background: #0d1117;
    color: #3fb950;
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 11px;
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid #30363d;
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
    letter-spacing: 0.5px;
  `;

  // prompt 符号特殊样式
  const prompt = el.querySelector('.mcmods-prompt') as HTMLElement;
  if (prompt) {
    prompt.style.cssText = 'color: #58a6ff; margin-right: 6px;';
  }

  document.body.appendChild(el);
}
