import { dirname, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function slash(value) {
  return value.split(sep).join('/')
}

/**
 * @param {import('./index.d.ts').NotebookViewerPluginOptions} [options]
 */
export function notebookViewerPlugin(options = {}) {
  return {
    name: 'vuepress-plugin-notebook-viewer',
    clientConfigFile: slash(join(__dirname, 'src/client.ts')),
    define: {
      __NOTEBOOK_VIEWER_ENABLED__: options.enabled ?? true,
      __NOTEBOOK_VIEWER_DEFAULT_THEME__: JSON.stringify(options.defaultTheme ?? 'auto'),
    },
  }
}

export default notebookViewerPlugin
