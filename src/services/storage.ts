import type { Category, Transaction } from '@/types'

const STORAGE_KEY = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
} as const

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Investing', type: 'income' },
  { id: '3', name: 'Food', type: 'expense' },
  { id: '4', name: 'Transportation', type: 'expense' },
  { id: '5', name: 'Entertainment', type: 'expense' },
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
