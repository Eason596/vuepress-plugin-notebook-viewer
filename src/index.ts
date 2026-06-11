import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vuepress'

export interface NotebookViewerPluginOptions {
  enabled?: boolean
  defaultTheme?: 'light' | 'dark' | 'auto'
}

const __dirname = dirname(fileURLToPath(import.meta.url))

function slash(value: string): string {
  return value.split(sep).join('/')
}

export function notebookViewerPlugin(options: NotebookViewerPluginOptions = {}): Plugin {
  return {
    name: 'vuepress-plugin-notebook-viewer',
    clientConfigFile: slash(join(__dirname, 'client.ts')),
    define: {
      __NOTEBOOK_VIEWER_ENABLED__: options.enabled ?? true,
      __NOTEBOOK_VIEWER_DEFAULT_THEME__: JSON.stringify(options.defaultTheme ?? 'auto'),
    },
  }
}

export default notebookViewerPlugin
