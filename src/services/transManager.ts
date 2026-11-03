import { StorageService } from '@/services/storage'
import type { BudgetSummary, Category, Transaction, TransactionType } from '@/types'

class TransactionManager {
  private transactions: Transaction[] = []
  private categories: Category[] = []

  constructor() {
    this.transactions = StorageService.getTransactions()
    this.categories = StorageService.getCategories()
  }

  getTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => b.createdAt - a.createdAt)
  }

  addTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }

    this.transactions.push(newTransaction)
    StorageService.saveTransactions(this.transactions)
    return newTransaction
  }

  // Kiểm tra toàn bộ ID, ID khác giữ lại, trùng thì xóa
  deleteTransaction(transactionId: string): boolean {
    const initialLength = this.transactions.length
    this.transactions = this.transactions.filter((t) => t.id !== transactionId)

    if (this.transactions.length !== initialLength) {
      StorageService.saveTransactions(this.transactions)
      return true
    }
    return false
  }

  getSummary(): BudgetSummary {
    return this.transactions.reduce(
      (sum, item) => {
        if (item.type === 'income') {
          sum.totalIncome += item.amount
          sum.balance += item.amount
        } else if (item.type === 'expense') {
          sum.totalExpense += item.amount
          sum.balance -= item.amount
        }
        return sum
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 },
    )
  }

  // Gọi tất cả Category để hiển thị lên Dropdown
  getCategories(type?: TransactionType): Category[] {
    if (type) {
      return this.categories.filter((cat) => cat.type === type)
    }
    return [...this.categories]
  }

  // Gọi chi tiết Category theo ID, dùng cho xử lý dữ liệu hoặc hiển thị chi tiết giao dịch
  getCategoryById(categoryId: string): Category | undefined {
    return this.categories.find((cat) => cat.id === categoryId)
  }
}

export const transManager = new TransactionManager()
