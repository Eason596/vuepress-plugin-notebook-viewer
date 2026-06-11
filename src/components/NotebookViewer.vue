<template>
  <div class="notebook-viewer-wrapper">
    <div v-if="error" class="notebook-error">
      <span class="error-icon">⚠</span>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="loadNotebook">重试</button>
    </div>

    <div v-else class="notebook-container">
      <div class="notebook-header">
        <div class="notebook-title">{{ filename }}</div>
        <div class="notebook-actions">
          <button class="action-btn" @click="downloadNotebook" title="下载">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>

      <div ref="viewerContainer" class="notebook-content">
        <div v-if="loading" class="notebook-loading">
          <div class="loading-spinner"></div>
          <span class="loading-text">加载 notebook...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { useDarkMode } from 'vuepress-theme-plume/composables'

const props = withDefaults(defineProps<{
  src: string
  theme?: 'light' | 'dark' | 'auto'
}>(), {
  src: '',
  theme: 'auto',
})

const viewerContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref('')
const isDark = useDarkMode()

const effectiveTheme = computed(() => {
  if (props.theme === 'auto') {
    return isDark.value ? 'dark' : 'light'
  }
  return props.theme
})

const filename = computed(() => {
  const parts = props.src.split('/')
  return parts[parts.length - 1] || 'notebook.ipynb'
})

let loadedDeps = false

async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve()
    }
    const s = document.createElement('script')
    s.src = src
    s.async = false
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function loadCss(href: string, id: string): void {
  if (document.getElementById(id)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'
  l.href = href
  l.id = id
  document.head.appendChild(l)
}

function setPrismTheme(isDarkMode: boolean): void {
  const lightCss = document.getElementById('prism-light')
  const darkCss = document.getElementById('prism-dark')
  if (lightCss) lightCss.disabled = isDarkMode
  if (darkCss) darkCss.disabled = !isDarkMode
}

async function loadNotebook(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    if (!loadedDeps) {
      loadCss('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-solarizedlight.css', 'prism-light')
      loadCss('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css', 'prism-dark')
      loadCss('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css', 'katex-css')

      await loadScript('https://cdn.jsdelivr.net/npm/marked@4/marked.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-julia.min.js')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-r.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js')
      await loadScript('https://cdn.jsdelivr.net/npm/nbviewer-js@0.1.1/dist/nbviewer.min.js')
      
      loadedDeps = true
    }

    setPrismTheme(effectiveTheme.value === 'dark')

    const res = await fetch(props.src)
    if (!res.ok) {
      throw new Error(`Failed to load notebook: ${res.status} ${res.statusText}`)
    }
    const notebook = await res.json()

    if (!viewerContainer.value) {
      throw new Error('Viewer container not found')
    }

    const win = window as unknown as Record<string, unknown>
    const nbviewer = win.nbviewer
    if (!nbviewer || typeof nbviewer.render !== 'function') {
      throw new Error('nbviewer.js library not loaded properly')
    }

    viewerContainer.value.innerHTML = ''
    
    nbviewer.render(notebook, viewerContainer.value, {
      theme: effectiveTheme.value,
    })

    loading.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
    loading.value = false
  }
}

async function downloadNotebook(): Promise<void> {
  try {
    const res = await fetch(props.src)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename.value
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    error.value = e instanceof Error ? `下载失败: ${e.message}` : '下载失败'
  }
}

watch(effectiveTheme, (val) => {
  setPrismTheme(val === 'dark')
})

watch(() => props.src, () => {
  loadNotebook()
})

onMounted(() => {
  loadNotebook()
})

onBeforeUnmount(() => {
})
</script>

<style scoped>
.notebook-viewer-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.notebook-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: var(--vp-c-text-2);
}

.error-icon {
  font-size: 32px;
}

.retry-btn {
  padding: 8px 16px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
}

.notebook-container {
  display: flex;
  flex-direction: column;
}

.notebook-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.notebook-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.notebook-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.action-btn:hover {
  background: var(--vp-c-hover);
  color: var(--vp-c-text-1);
}

.notebook-content {
  padding: 16px;
  max-height: 70vh;
  overflow-y: auto;
}

.notebook-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

:notebook-content :deep(.nbviewer) {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
}

:notebook-content :deep(.nbviewer-cell) {
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
}

:notebook-content :deep(.nbviewer-cell.code) {
  background: var(--vp-c-bg-mute);
}

:notebook-content :deep(.nbviewer-cell.markdown) {
  line-height: 1.6;
}

:notebook-content :deep(.nbviewer-input) {
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow-x: auto;
}

:notebook-content :deep(.nbviewer-output) {
  margin-top: 8px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-left: 3px solid var(--vp-c-brand);
  border-radius: 0 4px 4px 0;
}

@media (prefers-color-scheme: dark) {
  :notebook-content :deep(.nbviewer-input) {
    background: rgba(255, 255, 255, 0.05);
  }
  :notebook-content :deep(.nbviewer-output) {
    background: rgba(255, 255, 255, 0.02);
  }
}
</style>
