# AGENTS.md — mcmods-modern

AI 助手工作指南。本项目是一个 Firefox 浏览器扩展，用于美化 MCMod (MC百科) 网站，采用 Claude Code 硬核编码科技风格。

## 项目概述

- **名称**: mcmods-modern
- **类型**: Firefox 浏览器扩展 (Browser Extension)
- **目标平台**: Firefox（Manifest V3），后续可扩展至 Chrome / Edge 及 Tampermonkey
- **目标站点**: https://www.mcmod.cn/（MC百科）
- **核心功能**: 将 MCMod 整站外观重绘为终端/CLI 风格的暗色编码界面
- **设计风格**: Claude Code 硬核编码科技风 —— 深色终端背景、等宽字体、高对比度语法配色、命令行式交互元素
- **技术栈**: TypeScript + CSS，构建工具 WXT（优先）或手动 Vite 配置

## 设计语言：Claude Code 硬核编码科技风格

### 色彩系统
- **背景**: 深灰黑基色 `#1a1b26` 或 `#0d1117`（终端黑）
- **前景/正文**: 高可读性浅灰 `#c9d1d9`，终端绿 `#3fb950` 用于强调
- **强调色**: 电光蓝 `#58a6ff`、冷紫 `#bc8cff`、警告橙 `#d29922`
- **代码块**: 深色底 `#161b22` + 语法高亮（类似 GitHub Dark / Tokyo Night）
- **边框/分割线**: 极细 `1px solid #30363d`，低调不抢眼
- **悬停/激活态**: 半透明叠加 `rgba(88, 166, 255, 0.12)`

### 排版
- **正文**: 系统无衬线字体（`-apple-system, sans-serif`），保证中文可读性
- **代码/数据**: `JetBrains Mono` / `Fira Code` / `Cascadia Code`，回退 `Consolas, monospace`
- **标题/导航**: 可混用等宽字体加强终端感
- **字号基准**: 14px 正文，12px 辅助信息

### 终端元素
- 页面可注入微型 CLI 装饰（如页面顶部伪终端提示符 `> mcmod.modern loaded`）
- 卡片/面板采用终端窗口风格：顶部伪标题栏 + 圆角 + 细边框
- 链接 hover 时显示下划线动画，模拟终端光标效果
- 滚动条细窄暗色，匹配终端风格

### 原则
- **克制**: 不改动页面 DOM 结构，仅通过 CSS 覆盖和少量注入实现风格重绘
- **可读性优先**: 硬核风格不等于低可读性，正文对比度 ≥ 4.5:1 (WCAG AA)
- **性能零开销**: 纯 CSS 方案为主，JS 仅用于必要的 DOM 微调；无运行时框架

## 目录结构

```
mcmods-modern/
├── src/
│   ├── entrypoints/       # WXT entry points
│   │   ├── content.ts     # Content script 入口
│   │   └── background.ts  # Service Worker（可选）
│   ├── styles/
│   │   ├── base/          # 全局基础变量、重置、滚动条
│   │   │   ├── variables.css   # CSS 自定义属性（色彩、字号、间距）
│   │   │   ├── reset.css       # 站点元素重置
│   │   │   └── scrollbar.css   # 终端风滚动条
│   │   ├── components/    # 组件级样式覆盖
│   │   │   ├── navbar.css      # 导航栏
│   │   │   ├── cards.css       # 卡片/列表项
│   │   │   ├── buttons.css     # 按钮/交互元素
│   │   │   ├── tables.css      # 表格/数据区
│   │   │   ├── modals.css      # 弹窗/对话框
│   │   │   └── search.css      # 搜索框
│   │   └── pages/         # 特定页面样式
│   │       ├── home.css        # 首页
│   │       ├── item.css        # 物品/模组详情页
│   │       └── list.css        # 列表/分类页
│   └── utils/             # 工具函数
│       └── observer.ts    # MutationObserver 封装
├── public/
│   └── icons/             # 扩展图标（终端风格）
├── wxt.config.ts          # WXT 构建配置
├── package.json
├── tsconfig.json
└── AGENTS.md
```

## 技术约定

### Firefox 扩展规范
- 遵循 **Manifest V3**，使用 `browser.*` API（兼容 Chrome 的 `chrome.*` 回调风格需 polyfill）
- `manifest.json` 中 `browser_specific_settings.gecko.id` 必填
- 开发时通过 `about:debugging#/runtime/this-firefox` 加载临时扩展
- 签名：发布到 AMO 需 Mozilla 签名；自用可通过 `web-ext sign` 或直接加载未签名版本（仅 Nightly/Developer Edition）

### Content Script 原则
- `"run_at": "document_start"` 确保样式在页面渲染前注入，避免闪烁
- CSS 类名前缀 `mcmods-`，DOM id 前缀 `__mcmods-`，防止与站点冲突
- 使用 `MutationObserver` 监听动态加载内容，debounce 100ms
- 不引入任何第三方 JS 库，保持 content script 轻量

### CSS 架构
- 所有设计 Token 集中在 `variables.css` 的 `:root` 中，使用 `--mcmods-*` 命名空间
- 按组件/页面分层组织，便于维护和按需加载
- 样式优先级：使用选择器特异性覆盖原站样式，禁止 `!important` 滥用（仅在必要时使用）
- 暗色主题为默认，后续可通过设置面板扩展亮色切换

### 构建工具链
- 首选 **WXT**（专为浏览器扩展设计的构建框架，支持 Firefox 开箱即用）
- 备选：手动 Vite + `vite-plugin-web-extension`
- 包管理：pnpm
- 格式化：Prettier，检查：ESLint

## 构建与开发

```bash
# 安装依赖
npm install

# 开发模式（Firefox 热更新）
npm dev

# 构建生产版本
npm build

# 构建并打包为 .zip（提交 AMO 用）
npm zip

# 在 Firefox 中加载开发版本
npm dev:firefox    # web-ext run 自动启动 Firefox

# 代码检查
npm lint

# 类型检查
npm typecheck
```

## 开发流程

1. **分析页面结构**：在 MCMod 站点上确定目标 DOM 选择器，记录在样式文件头部注释中
2. **建立变量**：在 `variables.css` 中定义当前组件/页面所需的 CSS 自定义属性
3. **编写样式**：在对应组件/页面 CSS 文件中覆写样式，确保不影响其他区域
4. **验证**：在 Firefox 中加载扩展，检查视觉效果和功能完整性
5. **提交**：使用 Conventional Commits

## 提交规范

```
feat(style): 添加首页导航栏终端风格覆盖
fix(style): 修复详情页表格在窄屏下的溢出问题
refactor(css): 提取公共按钮样式到 component/buttons.css
style(mcmod): 调整卡片阴影以匹配终端风格
```

## 目前状态

| 模块 | 状态 |
|------|------|
| 项目脚手架 | 待搭建 |
| CSS 变量系统 (variables.css) | 待实现 |
| 全局重置 (reset.css) | 待实现 |
| 导航栏覆盖 | 待实现 |
| 首页重绘 | 待实现 |
| 详情页重绘 | 待实现 |
| 列表/分类页重绘 | 待实现 |

## 注意事项

- 不得拦截或修改 MCMod 的网络请求
- 不得绕过任何付费或登录限制
- 发布到 AMO 前需确保隐私政策合规（本扩展不收集任何数据）
- 避免使用 `innerHTML` 注入，优先 `createElement` + `textContent`
- `gitignore` 排除 `.output/`、`dist/`、`node_modules/`、`.env*`
