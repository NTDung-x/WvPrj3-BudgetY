import { transManager } from '@/services/transManager'
import type { Category, TransactionType } from '@/types'
import { getTodayDateString } from '@/utils/formatters'

let currentType: TransactionType = 'expense'

const fieldStyle =
  'w-full rounded-lg bg-stone-800 border border-stone-700/80 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-400 transition'

export const renderDialog = (): string => {
  const isIncome = currentType === 'income'

  return `
    <div id="dialog-backdrop" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <form
        id="dialog-form"
        role="dialog"
        aria-modal="true"
        class="w-full max-w-md rounded-2xl bg-stone-900 border border-stone-700/80 p-6 space-y-4 shadow-2xl"
      >
        <h2 class="text-lg font-semibold text-stone-100">Thêm giao dịch mới</h2>

        <!-- Tabs chuyển loại giao dịch -->
        <div class="grid grid-cols-2 gap-1 p-1 rounded-lg bg-stone-800">
          <button
            type="button"
            id="tab-income"
            class="rounded-md py-2 text-sm font-medium transition cursor-pointer ${
              isIncome ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
            }"
          >
            Thu nhập
          </button>
          <button
            type="button"
            id="tab-expense"
            class="rounded-md py-2 text-sm font-medium transition cursor-pointer ${
              !isIncome ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-white'
            }"
          >
            Chi tiêu
          </button>
        </div>

        <!-- Số tiền -->
        <label class="block space-y-1.5 text-xs text-stone-400">
          Số tiền (VND)
          <input
            id="dialog-amount"
            class="${fieldStyle}"
            type="number"
            min="1000"
            step="1000"
            required
            autofocus
            placeholder="0"
          />
        </label>

        <!-- Danh mục -->
        <div class="space-y-1.5 text-xs text-stone-400 relative" id="combobox-wrapper">
          <label for="dialog-category-input" class="block">Danh mục</label>
          <div class="relative">
            <input
              id="dialog-category-input"
              class="${fieldStyle} pr-9"
              type="text"
              required
              autocomplete="off"
              placeholder="Danh mục"
            />
            <button
              type="button"
              id="btn-toggle-category"
              tabindex="-1"
              class="absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400 hover:text-stone-200 cursor-pointer"
              title="Xem danh mục"
            >
              <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <!-- Dropdown -->
          <ul
            id="category-dropdown"
            class="hidden absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-stone-800 border border-stone-700 rounded-lg shadow-xl z-20 py-1 divide-y divide-stone-700/50"
          >
          </ul>
        </div>

        <!-- Ghi chú -->
        <label class="block space-y-1.5 text-xs text-stone-400">
          Nội dung ghi chú
          <input
            id="dialog-desc"
            class="${fieldStyle}"
            type="text"
            placeholder="Ghi chú (tùy chọn)"
          />
        </label>

        <!-- Ngày giao dịch -->
        <label class="block space-y-1.5 text-xs text-stone-400">
          Ngày giao dịch
          <input
            id="dialog-date"
            class="${fieldStyle}"
            type="date"
            required
            value="${getTodayDateString()}"
          />
        </label>

        <!-- Button -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            id="dialog-btn-cancel"
            class="flex-1 rounded-lg border border-stone-700 py-2.5 text-sm font-medium text-stone-300 cursor-pointer hover:bg-stone-800 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            id="dialog-btn-submit"
            class="flex-1 rounded-lg py-2.5 text-sm font-medium text-white cursor-pointer transition ${
              isIncome ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
            }"
          >
            Lưu ${isIncome ? 'thu nhập' : 'chi tiêu'}
          </button>
        </div>
      </form>
    </div>
  `
}

export const setupDialogEvents = (onClose: () => void): void => {
  const backdrop = document.querySelector<HTMLDivElement>('#dialog-backdrop')
  const form = document.querySelector<HTMLFormElement>('#dialog-form')

  const cancelBtn = document.querySelector<HTMLButtonElement>('#dialog-btn-cancel')

  const tabExpense = document.querySelector<HTMLButtonElement>('#tab-expense')
  const tabIncome = document.querySelector<HTMLButtonElement>('#tab-income')

  const submitBtn = document.querySelector<HTMLButtonElement>('#dialog-btn-submit')

  const comboboxWrapper = document.querySelector<HTMLDivElement>('#combobox-wrapper')
  const catInput = document.querySelector<HTMLInputElement>('#dialog-category-input')
  const toggleBtn = document.querySelector<HTMLButtonElement>('#btn-toggle-category')
  const dropdown = document.querySelector<HTMLUListElement>('#category-dropdown')

  // Close & Escape
  const handleClose = () => {
    window.removeEventListener('keydown', handleKeyDown)
    onClose()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }
  window.addEventListener('keydown', handleKeyDown)

  // Render dropdown theo filter
  const renderDropdownList = (filterText = '') => {
    if (!dropdown) return
    const categories = transManager.getCategories(currentType)
    const normalizedQuery = filterText.trim().toLowerCase()

    const filtered = categories.filter((c) => c.name.toLowerCase().includes(normalizedQuery))

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <li class="px-3 py-2 text-xs text-stone-400 italic">
          Danh mục mới: "${filterText.trim()}"
        </li>
      `
      return
    }

    dropdown.innerHTML = filtered
      .map(
        (c: Category) => `
        <li
          class="px-3 py-2 text-sm text-stone-200 hover:bg-stone-700/70 hover:text-white cursor-pointer transition flex items-center justify-between"
          data-name="${c.name}"
        >
          <span>${c.name}</span>
        </li>
      `,
      )
      .join('')
  }

  const openDropdown = () => {
    if (!dropdown || !catInput) return
    renderDropdownList(catInput.value)
    dropdown.classList.remove('hidden')
  }

  const closeDropdown = () => {
    if (!dropdown) return
    dropdown.classList.add('hidden')
  }

  // Gõ input: lọc + hiển thị dropdown
  catInput?.addEventListener('input', () => {
    openDropdown()
  })

  catInput?.addEventListener('focus', () => {
    openDropdown()
  })

  // Mở dropdown
  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (!dropdown) return
    if (dropdown.classList.contains('hidden')) {
      openDropdown()
      catInput?.focus()
    } else {
      closeDropdown()
    }
  })

  // Chọn danh mục từ dropdown
  dropdown?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const item = target.closest<HTMLLIElement>('li[data-name]')
    if (item?.dataset.name && catInput) {
      catInput.value = item.dataset.name
      closeDropdown()
      catInput.focus()
    }
  })

  // Đóng dropdown
  document.addEventListener('click', (e) => {
    if (comboboxWrapper && !comboboxWrapper.contains(e.target as Node)) {
      closeDropdown()
    }
  })

  // Chuyển Tab
  const updateType = (newType: TransactionType) => {
    currentType = newType
    const isIncome = currentType === 'income'

    if (tabExpense && tabIncome) {
      tabExpense.className = `rounded-md py-2 text-sm font-medium transition cursor-pointer ${
        !isIncome ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-white'
      }`
      tabIncome.className = `rounded-md py-2 text-sm font-medium transition cursor-pointer ${
        isIncome ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
      }`
    }

    if (catInput) {
      catInput.value = ''
    }
    closeDropdown()

    if (submitBtn) {
      submitBtn.className = `flex-1 rounded-lg py-2.5 text-sm font-medium text-white cursor-pointer transition ${
        isIncome ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
      }`
      submitBtn.textContent = `Lưu ${isIncome ? 'thu nhập' : 'chi tiêu'}`
    }
  }

  tabExpense?.addEventListener('click', () => updateType('expense'))
  tabIncome?.addEventListener('click', () => updateType('income'))

  // Click ra ngoài modal để đóng
  backdrop?.addEventListener('mousedown', (e) => {
    if (e.target === backdrop) handleClose()
  })

  // Hủy
  cancelBtn?.addEventListener('click', handleClose)

  // Lưu giao dịch
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const amountEl = document.querySelector<HTMLInputElement>('#dialog-amount')
    const descEl = document.querySelector<HTMLInputElement>('#dialog-desc')
    const dateEl = document.querySelector<HTMLInputElement>('#dialog-date')

    if (!amountEl || !dateEl || !catInput) return

    const amount = Number.parseFloat(amountEl.value)
    const categoryName = catInput.value.trim()

    if (!amount || amount <= 0 || !categoryName) return

    // Nếu trùng danh mục cũ thì lấy ID cũ, chưa có thì tự sinh ID mới và lưu vào storage
    const category = transManager.getOrCreateCategory(categoryName, currentType)

    transManager.addTransaction({
      type: currentType,
      amount,
      categoryId: category.id,
      description: descEl?.value.trim() ?? '',
      date: dateEl.value,
    })

    handleClose()
    document.dispatchEvent(new CustomEvent('budgety:updated'))
  })
}
