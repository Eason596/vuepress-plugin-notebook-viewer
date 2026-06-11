# vuepress-plugin-notebook-viewer

A VuePress plugin for rendering Jupyter Notebook files (.ipynb) using [nbviewer.js](https://github.com/kokes/nbviewer.js).

## Features

- 📚 Render Jupyter Notebook files (.ipynb) directly in your VuePress site
- 🎨 Support for light/dark/auto theme modes
- 📐 Customizable width and height for the viewer container
- 📦 Automatic loading of required dependencies (prism, katex, marked)
- 📥 Download button for original notebook files
- ⚡ Built-in loading states and error handling
- 📦 Local JS dependencies (no external CDN required for core rendering)

## Installation

```bash
npm install vuepress-plugin-notebook-viewer
# or
yarn add vuepress-plugin-notebook-viewer
# or
pnpm add vuepress-plugin-notebook-viewer
```

## Usage

### 1. Register the plugin

In your `.vuepress/config.ts`:

```typescript
import { defineUserConfig } from 'vuepress'
import { notebookViewerPlugin } from 'vuepress-plugin-notebook-viewer'

export default defineUserConfig({
  plugins: [
    notebookViewerPlugin({
      // Optional: set default theme (default: 'auto')
      defaultTheme: 'auto',
    }),
  ],
})
```

### 2. Use the component

Place your `.ipynb` files in the `public` directory, then use the component in your Markdown files:

```markdown
<NotebookViewer src="/notebook.ipynb" />
```

### Component Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | (required) | Path to the notebook file (.ipynb) |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme mode |
| `width` | `string` | `'100%'` | Container width (e.g., `'800px'`, `'100%'`, `'90vw'`) |
| `height` | `string` | `'600px'` | Container height (e.g., `'500px'`, `'70vh'`) |

## Plugin Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Enable/disable the plugin |
| `defaultTheme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Default theme for all instances |

## Examples

### Basic Usage

```markdown
# My Notebook

<NotebookViewer src="/my-analysis.ipynb" />
```

### Custom Dimensions

```markdown
<!-- Fixed size -->
<NotebookViewer src="/notebook.ipynb" width="800px" height="500px" />

<!-- Responsive size -->
<NotebookViewer src="/notebook.ipynb" width="100%" height="70vh" />

<!-- Viewport units -->
<NotebookViewer src="/notebook.ipynb" width="90vw" height="80vh" />
```

### Theme Control

```markdown
<!-- Force light theme -->
<NotebookViewer src="/notebook.ipynb" theme="light" />

<!-- Force dark theme -->
<NotebookViewer src="/notebook.ipynb" theme="dark" />

<!-- Auto (follows system/browser preference) -->
<NotebookViewer src="/notebook.ipynb" theme="auto" />
```

## Project Structure

```
vuepress-plugin-notebook-viewer/
├── src/
│   ├── components/
│   │   └── NotebookViewer.vue    # Main Vue component
│   ├── public/
│   │   └── nbviewer.js           # Local nbviewer.js library
│   ├── client.ts                 # Client-side configuration
│   └── index.ts                  # Plugin entry point
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features in Detail

### Markdown Rendering
Supports standard Markdown features:
- Headings (H1-H6)
- Bold and italic text
- Inline code and code blocks
- Links and images
- Lists (ordered and unordered)

### Code Highlighting
Uses Prism.js for syntax highlighting, supporting:
- Python
- Julia
- R
- And many other languages

### Mathematical Equations
Uses KaTeX for rendering LaTeX mathematical expressions.

### Output Rendering
Supports various notebook output types:
- Text output
- HTML output
- Image output (PNG, JPEG)

## Requirements

- VuePress 2.x
- VuePress Theme Plume
- Vue 3.x

## License

MIT
