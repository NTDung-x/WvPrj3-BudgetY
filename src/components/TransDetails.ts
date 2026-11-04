import { transManager } from '@/services/transManager'
import type { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

const renderTransDetailItems = (
  items: Transaction[],
  tone: 'emerald' | 'red',
  emptyMessage: string,
): string => {
  if (items.length === 0) {
    return `<li class="text-sm text-stone-500 text-center py-10">${emptyMessage}</li>`
  }

  const isEmerald = tone === 'emerald'
  const textColor = isEmerald ? 'text-emerald-400' : 'text-red-500'
  const subCategoryColor = isEmerald ? 'text-emerald-400/90' : 'text-red-400/90'
  const hoverBg = isEmerald ? 'hover:bg-emerald-950/40' : 'hover:bg-red-950/40'
  const sign = isEmerald ? '+' : '-'

  return items
    .map((item) => {
      const category = transManager.getCategoryById(item.categoryId)
      const categoryName = category?.name ?? 'Khác'

      return `
        <li class="flex items-center justify-between gap-3 rounded-xl bg-stone-900/60 ${hoverBg} border border-stone-800/40 px-4 py-3.5 transition group overflow-x-hidden">
          <div class="min-w-0">
            <p class="text-sm font-normal text-stone-100 truncate">
              ${item.description || categoryName}
            </p>
            <p class="text-xs text-stone-400 mt-1">
              <span class="${subCategoryColor} font-normal">${categoryName}</span>
              <span> · </span>
              <span>${formatDate(item.date)}</span>
            </p>
          </div>

          <div class="relative flex items-center justify-end shrink-0">
            <span class="font-normal tabular-nums whitespace-nowrap text-base ${textColor} transition-transform duration-200 ease-out group-hover:-translate-x-10">
              ${sign}${formatCurrency(item.amount)}
            </span>
            <button
              type="button"
              data-action="delete"
              data-id="${item.id}"
              class="absolute right-0 text-xs text-stone-500 hover:text-red-400 transition-opacity duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Xóa giao dịch"
            >
              Xóa
            </button>
          </div>
        </li>
      `
    })
    .join('')
}

export const renderTransDetails = (): string => {
  const transactions = transManager.getTransactions()
  const incomeList = transactions.filter((t) => t.type === 'income')
  const expenseList = transactions.filter((t) => t.type === 'expense')

  const totalIncome = incomeList.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = expenseList.reduce((sum, t) => sum + t.amount, 0)

  return `
    <main class="h-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6 lg:px-12 max-w-7xl mx-auto w-full">
      <!-- Thu nhập -->
      <section class="h-full flex flex-col min-h-0">
        <div class="py-4 text-center">
          <h2 class="text-xs uppercase tracking-[0.25em] text-emerald-400 font-normal">
            Thu nhập
          </h2>
          <div class="mt-1 flex items-center justify-center gap-4 font-normal tabular-nums">
            <span class="text-emerald-400 text-2xl">
              +${formatCurrency(totalIncome)}
            </span>
            <span class="text-stone-400 font-normal text-m">
              trên ${incomeList.length} giao dịch
            </span>
          </div>
        </div>
        <ul id="income-list-container" class="flex-1 overflow-y-auto space-y-2.5 pr-2">
          ${renderTransDetailItems(incomeList, 'emerald', 'Chưa có khoản thu nhập nào')}
        </ul>
      </section>

      <!-- Chi tiêu -->
      <section class="h-full flex flex-col min-h-0">
        <div class="py-4 text-center">
          <h2 class="text-xs uppercase tracking-[0.25em] text-red-500 font-normal">
            Chi tiêu
          </h2>
          <div class="mt-1 flex items-center justify-center gap-4 font-normal tabular-nums">
            <span class="text-red-500 text-2xl">
              -${formatCurrency(totalExpense)}
            </span>
            <span class="text-stone-400 font-normal text-m">
              trên ${expenseList.length} giao dịch
            </span>
          </div>
        </div>
        <ul id="expense-list-container" class="flex-1 overflow-y-auto space-y-2.5 pr-2">
          ${renderTransDetailItems(expenseList, 'red', 'Chưa có khoản chi tiêu nào')}
        </ul>
      </section>
    </main>
  `
}

export const updateTransDetails = (): void => {
  const container = document.querySelector<HTMLElement>('#trans-details-container')
  if (container) {
    container.innerHTML = renderTransDetails()
  }
}

export const setupTransDetailsEvents = (): void => {
  const container = document.querySelector<HTMLElement>('#trans-details-container')
  if (!container) return

  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const deleteBtn = target.closest<HTMLButtonElement>('[data-action="delete"]')
    if (deleteBtn) {
      const id = deleteBtn.dataset.id
      if (!id) return

      if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này không?')) {
        transManager.deleteTransaction(id)
        document.dispatchEvent(new CustomEvent('budgety:updated'))
      }
    }
  })
}
