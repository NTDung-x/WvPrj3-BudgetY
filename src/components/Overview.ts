import { transManager } from '@/services/transManager'
import { formatCurrency } from '@/utils/formatters'

// Lấy thời gian hiện tại
const getTimeString = (): string => {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const renderOverview = (): string => {
  const { balance } = transManager.getSummary()
  const balanceColor = balance < 0 ? 'text-red-500' : 'text-stone-50'

  return `
    <header class="basis-1/3 shrink-0 flex flex-col items-center justify-center gap-2 px-4 select-none">
      <!-- Thời gian hiện tại -->
      <p id="overview-time" class="text-sm sm:text-base text-stone-400 tabular-nums capitalize text-center">
        ${getTimeString()}
      </p>

      <!-- Số dư -->
      <p class="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
        Số dư hiện tại
      </p>

      <!-- Số tiền -->
      <h1 id="overview-balance" class="text-5xl sm:text-7xl font-semibold tabular-nums tracking-tight ${balanceColor}">
        ${formatCurrency(balance)}
      </h1>

      <!-- Dialog -->
      <button
        id="btn-open-dialog"
        type="button"
        class="mt-3 rounded-full bg-stone-100 text-stone-900 px-6 py-2.5 text-sm font-medium hover:bg-white active:scale-95 transition cursor-pointer shadow-sm"
      >
        + Thêm giao dịch
      </button>
    </header>
  `
}

// Mở dialog thêm giao dịch
export const setupOverviewEvents = (onOpenDialog: () => void): void => {
  const btn = document.querySelector<HTMLButtonElement>('#btn-open-dialog')
  if (btn) {
    btn.addEventListener('click', onOpenDialog)
  }
}

// Cập nhật số dư trong overview khi có thay đổi
export const updateOverviewBalance = (): void => {
  const balanceEl = document.querySelector<HTMLHeadingElement>('#overview-balance')
  if (balanceEl) {
    const { balance } = transManager.getSummary()
    balanceEl.textContent = formatCurrency(balance)
    balanceEl.className = `text-5xl sm:text-7xl font-semibold tabular-nums tracking-tight ${
      balance < 0 ? 'text-red-500' : 'text-stone-50'
    }`
  }
}
