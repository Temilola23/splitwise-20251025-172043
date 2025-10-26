"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Member, Expense, Group, Balance, Settlement } from "./types"

interface AppState {
  members: Member[]
  expenses: Expense[]
  groups: Group[]
  settlements: Settlement[]
  addMember: (member: Member) => void
  addExpense: (expense: Expense) => void
  addGroup: (group: Group) => void
  addSettlement: (settlement: Settlement) => void
  deleteExpense: (id: string) => void
  getBalances: () => Balance[]
  getSimplifiedBalances: () => Balance[]
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      members: [
        { id: "1", name: "You", email: "you@example.com" },
        { id: "2", name: "Alice", email: "alice@example.com" },
        { id: "3", name: "Bob", email: "bob@example.com" },
        { id: "4", name: "Charlie", email: "charlie@example.com" },
      ],
      expenses: [
        {
          id: "1",
          description: "Dinner at Restaurant",
          amount: 120,
          paidBy: "1",
          splitBetween: ["1", "2", "3"],
          date: new Date("2025-01-20"),
          category: "Food",
        },
        {
          id: "2",
          description: "Movie Tickets",
          amount: 45,
          paidBy: "2",
          splitBetween: ["1", "2"],
          date: new Date("2025-01-22"),
          category: "Entertainment",
        },
        {
          id: "3",
          description: "Grocery Shopping",
          amount: 85,
          paidBy: "3",
          splitBetween: ["1", "2", "3", "4"],
          date: new Date("2025-01-23"),
          category: "Groceries",
        },
      ],
      groups: [],
      settlements: [],
      addMember: (member) => set((state) => ({ members: [...state.members, member] })),
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
      addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
      addSettlement: (settlement) => set((state) => ({ settlements: [...state.settlements, settlement] })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      getBalances: () => {
        const state = get()
        const balanceMap = new Map<string, number>()

        state.expenses.forEach((expense) => {
          const splitAmount = expense.amount / expense.splitBetween.length
          expense.splitBetween.forEach((memberId) => {
            if (memberId !== expense.paidBy) {
              const key = `${memberId}-${expense.paidBy}`
              const reverseKey = `${expense.paidBy}-${memberId}`

              if (balanceMap.has(reverseKey)) {
                balanceMap.set(reverseKey, balanceMap.get(reverseKey)! - splitAmount)
              } else {
                balanceMap.set(key, (balanceMap.get(key) || 0) + splitAmount)
              }
            }
          })
        })

        const balances: Balance[] = []
        balanceMap.forEach((amount, key) => {
          if (Math.abs(amount) > 0.01) {
            const [from, to] = key.split("-")
            if (amount > 0) {
              balances.push({ from, to, amount })
            } else {
              balances.push({ from: to, to: from, amount: Math.abs(amount) })
            }
          }
        })

        return balances
      },
      getSimplifiedBalances: () => {
        const balances = get().getBalances()
        const netBalances = new Map<string, number>()

        balances.forEach(({ from, to, amount }) => {
          netBalances.set(from, (netBalances.get(from) || 0) - amount)
          netBalances.set(to, (netBalances.get(to) || 0) + amount)
        })

        const creditors: Array<{ id: string; amount: number }> = []
        const debtors: Array<{ id: string; amount: number }> = []

        netBalances.forEach((amount, id) => {
          if (amount > 0.01) {
            creditors.push({ id, amount })
          } else if (amount < -0.01) {
            debtors.push({ id, amount: Math.abs(amount) })
          }
        })

        const simplified: Balance[] = []
        let i = 0
        let j = 0

        while (i < creditors.length && j < debtors.length) {
          const creditor = creditors[i]
          const debtor = debtors[j]
          const amount = Math.min(creditor.amount, debtor.amount)

          simplified.push({
            from: debtor.id,
            to: creditor.id,
            amount,
          })

          creditor.amount -= amount
          debtor.amount -= amount

          if (creditor.amount < 0.01) i++
          if (debtor.amount < 0.01) j++
        }

        return simplified
      },
    }),
    {
      name: "splitwise-storage",
    },
  ),
)
