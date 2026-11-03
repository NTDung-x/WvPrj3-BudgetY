export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: TransactionType
}

export interface Transaction {
  id: string
  description: string
  amount: number
  categoryId: string
  type: TransactionType
  date: string
  createdAt: number
}

export interface BudgetSummary {
  totalIncome: number
  totalExpense: number
  balance: number
}
