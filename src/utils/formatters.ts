// Định dạng VNĐ
export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (!Number.isFinite(amount)) return '0 đ'

  const absAmount = Math.abs(amount)

  if (absAmount >= 1e8) {
    const exp = amount
      .toExponential(2)
      .replace(/\.00(?=e)/, '')
      .replace(/(\.[0-9])0(?=e)/, '$1')
      .replace('+', '')
    return `${exp} đ`
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Định dạng ngày tháng từ "YYYY-MM-DD" sang "DD/MM/YYYY" để hiển thị lên UI
export const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

// Định dạng "YYYY-MM-DD" để <input> sử dụng và lưu vào localStorage
export const getTodayDateString = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
