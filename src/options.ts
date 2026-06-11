import type { InjectionKey } from 'vue'

export type NotebookViewerTheme = 'light' | 'dark' | 'auto'

export interface NotebookViewerOptions {
  defaultTheme: NotebookViewerTheme
}

export const NOTEBOOK_VIEWER_OPTIONS_KEY: InjectionKey<NotebookViewerOptions> = Symbol(
  __VUEPRESS_DEV__ ? 'notebook-viewer-options' : '',
)
