import type { Category, Transaction } from '@/types'

const STORAGE_KEY = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
} as const

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Lương', type: 'income' },
  { id: '2', name: 'Đầu tư', type: 'income' },
  { id: '3', name: 'Làm thêm', type: 'income' },
  { id: '4', name: 'Ăn uống', type: 'expense' },
  { id: '5', name: 'Di chuyển', type: 'expense' },
  { id: '6', name: 'Nhà ở', type: 'expense' },
  { id: '7', name: 'Mua sắm', type: 'expense' },
  { id: '8', name: 'Giải trí', type: 'expense' },
]

export const StorageService = {
  getTransactions(): Transaction[] {
    const rawTrans = localStorage.getItem(STORAGE_KEY.TRANSACTIONS)
    return rawTrans ? JSON.parse(rawTrans) : []
  },

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEY.TRANSACTIONS, JSON.stringify(transactions))
  },

  getCategories(): Category[] {
    const rawCats = localStorage.getItem(STORAGE_KEY.CATEGORIES)
    if (!rawCats) {
      this.saveCategories(DEFAULT_CATEGORIES)
      return DEFAULT_CATEGORIES
    }
    return JSON.parse(rawCats)
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEY.CATEGORIES, JSON.stringify(categories))
  },
}
