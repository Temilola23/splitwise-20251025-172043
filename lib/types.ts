export interface Member {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  date: Date
  category: string
  groupId?: string
}

export interface Group {
  id: string
  name: string
  members: string[]
  createdAt: Date
}

export interface Balance {
  from: string
  to: string
  amount: number
}

export interface Settlement {
  id: string
  from: string
  to: string
  amount: number
  date: Date
  settled: boolean
}
