import { defineClientConfig } from 'vuepress/client'
import NotebookViewer from './components/NotebookViewer.vue'
import { NOTEBOOK_VIEWER_OPTIONS_KEY, type NotebookViewerTheme } from './options'

declare const __NOTEBOOK_VIEWER_DEFAULT_THEME__: NotebookViewerTheme

export default defineClientConfig({
  enhance({ app }) {
    app.provide(NOTEBOOK_VIEWER_OPTIONS_KEY, {
      defaultTheme: __NOTEBOOK_VIEWER_DEFAULT_THEME__,
    })
    app.component('NotebookViewer', NotebookViewer)
  },
})
