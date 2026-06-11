# vuepress-plugin-notebook-viewer

在 VuePress 2 站点中渲染 Jupyter Notebook（`.ipynb`）的插件，基于 [nbviewer.js](https://github.com/kokes/nbviewer.js) 在浏览器端完成渲染。

## 功能

- 在 Markdown 页面中通过 `<NotebookViewer />` 组件嵌入 notebook
- 支持 `light` / `dark` / `auto` 主题，`auto` 跟随 [vuepress-theme-plume](https://theme-plume.vuejs.press/) 的深色模式
- 可配置容器 `width` / `height`
- 内置加载状态、错误提示与重试
- 支持下载原始 `.ipynb` 文件
- 内置本地 `nbviewer.js`，无需用户手动下载第三方脚本

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| Node.js | `^20.19.0` 或 `>=22.0.0` |
| VuePress | `^2.0.0-rc.30` |
| Vue | `^3.5.0` |
| vuepress-theme-plume | `^1.0.0-rc.202` |

> 本插件使用 Plume 主题的 `useDarkMode`，因此需要配合 **vuepress-theme-plume** 使用。

## 安装

```bash
npm install vuepress-plugin-notebook-viewer
# 或
pnpm add vuepress-plugin-notebook-viewer
# 或
yarn add vuepress-plugin-notebook-viewer
```

本地开发时，可将插件仓库放在项目旁并通过 `file:` 协议安装：

```bash
npm install ../vuepress-plugin-notebook-viewer
```

## 快速开始

### 1. 注册插件

在 `.vuepress/config.ts` 中：

```typescript
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { notebookViewerPlugin } from 'vuepress-plugin-notebook-viewer'

export default defineUserConfig({
  theme: plumeTheme({ /* ... */ }),
  plugins: [
    notebookViewerPlugin({
      defaultTheme: 'auto',
    }),
  ],
})
```

### 2. 放置 notebook 文件

将 `.ipynb` 文件放到 VuePress 的 `public` 目录，例如：

```
docs/
└── .vuepress/
    └── public/
        └── demo.ipynb
```

构建后可通过 `/demo.ipynb` 访问。

### 3. 在 Markdown 中使用

```markdown
<NotebookViewer src="/demo.ipynb" />
```

## 组件 Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | （必填） | notebook 文件路径，相对于站点根路径 |
| `theme` | `'light' \| 'dark' \| 'auto'` | 继承插件配置 | 单个实例的主题，优先级高于插件 `defaultTheme` |
| `width` | `string` | `'100%'` | 整个 viewer 外框宽度 |
| `height` | `string` | `'600px'` | 标题栏下方内容区的滚动高度 |

主题优先级：

```
组件 theme  >  插件 defaultTheme  >  'auto'
```

## 插件配置

```typescript
notebookViewerPlugin({
  defaultTheme: 'auto', // 'light' | 'dark' | 'auto'
})
```

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultTheme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 所有 `<NotebookViewer />` 的默认主题 |

## 示例

### 基础用法

```markdown
# 数据分析笔记

<NotebookViewer src="/analysis.ipynb" />
```

### 自定义尺寸

```markdown
<NotebookViewer src="/analysis.ipynb" width="800px" height="500px" />
<NotebookViewer src="/analysis.ipynb" width="100%" height="70vh" />
```

### 主题控制

```markdown
<!-- 跟随站点深色模式 -->
<NotebookViewer src="/analysis.ipynb" theme="auto" />

<!-- 强制深色 / 浅色 -->
<NotebookViewer src="/analysis.ipynb" theme="dark" />
<NotebookViewer src="/analysis.ipynb" theme="light" />
```

## 渲染能力

基于 nbviewer.js，当前支持：

- Markdown 单元格（标题、列表、链接、图片等）
- 代码单元格（Python / Julia / R 等，通过 Prism 高亮）
- LaTeX 公式（通过 KaTeX）
- 输出类型：纯文本、HTML、PNG、JPEG、SVG、stream、error

## 依赖说明

| 资源 | 来源 |
| --- | --- |
| `nbviewer.js` | 插件内置（`src/public/nbviewer.js`） |
| `marked`、`Prism`、`KaTeX` | 运行时从 CDN 加载 |

首次打开 notebook 时需要网络连接以加载语法高亮和公式渲染依赖。

## 项目结构

```
vuepress-plugin-notebook-viewer/
├── src/
│   ├── components/
│   │   └── NotebookViewer.vue   # 主组件
│   ├── public/
│   │   └── nbviewer.js          # 本地 nbviewer 库（含深色主题适配）
│   ├── client.ts                # 客户端配置
│   ├── options.ts               # 插件选项类型
│   └── index.ts                 # 插件入口
├── package.json
└── README.md
```

## 开发

在插件仓库中修改代码后，在使用方项目中重新安装或刷新 `file:` 依赖，并重启 VuePress 开发服务：

```bash
npm run docs:dev
```

## 许可证

MIT
