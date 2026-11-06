import './style.css'
import { renderOverview, setupOverviewEvents, updateOverviewBalance } from '@/components/Overview'
import { renderDialog, setupDialogEvents } from '@/components/TransAddDialog'
import {
  renderTransDetails,
  setupTransDetailsEvents,
  updateTransDetails,
} from '@/components/TransDetails'

const app = document.querySelector<HTMLDivElement>('#app')

const openDialog = (): void => {
  const dialogContainer = document.querySelector<HTMLDivElement>('#dialog-container')
  if (dialogContainer) {
    dialogContainer.innerHTML = renderDialog()
    setupDialogEvents(closeDialog)
  }
}

const closeDialog = (): void => {
  const dialogContainer = document.querySelector<HTMLDivElement>('#dialog-container')
  if (dialogContainer) {
    dialogContainer.innerHTML = ''
  }
}

if (app) {
  app.innerHTML = `
    <div id="app-root" class="relative h-screen flex flex-col bg-stone-950 text-stone-100 font-sans select-none overflow-hidden">
      
      <!-- Background -->
      <div id="app-bg-layer" class="absolute inset-0 pointer-events-none -z-10"></div>

      <!-- Overview & Thống kê số dư -->
      ${renderOverview()}

      <!-- Chi tiết Thu nhập & Chi tiêu -->
      <div id="trans-details-container" class="basis-2/3 min-h-0 pb-6">
        ${renderTransDetails()}
      </div>

      <!-- Dialog -->
      <div id="dialog-container"></div>
    </div>
  `

  setupOverviewEvents(openDialog)
  setupTransDetailsEvents()

  // Đồng bộ giao diện khi có thay đổi dữ liệu
  document.addEventListener('budgety:updated', () => {
    updateOverviewBalance()
    updateTransDetails()
  })
}
