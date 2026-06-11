import { defineClientConfig } from 'vuepress/client'
import NotebookViewer from './components/NotebookViewer.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('NotebookViewer', NotebookViewer)
  },
})
