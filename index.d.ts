import type { Plugin } from 'vuepress'

export interface NotebookViewerPluginOptions {
  enabled?: boolean
  defaultTheme?: 'light' | 'dark' | 'auto'
}

export declare function notebookViewerPlugin(options?: NotebookViewerPluginOptions): Plugin

export default notebookViewerPlugin
