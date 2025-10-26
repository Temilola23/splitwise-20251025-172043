"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowDown, ArrowUp, TrendingUp, Receipt } from "lucide-react"
import { useMemo } from "react"

export function DashboardTab() {
  const { members, expenses, getBalances } = useStore()
  const balances = getBalances()

  const stats = useMemo(() => {
    const youOwe = balances.filter((b) => b.from === "1").reduce((sum, b) => sum + b.amount, 0)
    const owedToYou = balances.filter((b) => b.to === "1").reduce((sum, b) => sum + b.amount, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

    return { youOwe, owedToYou, totalExpenses, netBalance: owedToYou - youOwe }
  }, [balances, expenses])

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }, [expenses])

  const yourBalances = useMemo(() => {
    return balances.filter((b) => b.from === "1" || b.to === "1")
  }, [balances])

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Owe</CardTitle>
            <ArrowUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${stats.youOwe.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total amount you owe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owed to You</CardTitle>
            <ArrowDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${stats.owedToYou.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total amount owed to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netBalance >= 0 ? "text-primary" : "text-destructive"}`}>
              ${Math.abs(stats.netBalance).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.netBalance >= 0 ? "You're owed more" : "You owe more"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Your Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Your Balances</CardTitle>
          <CardDescription>Overview of who owes whom</CardDescription>
        </CardHeader>
        <CardContent>
          {yourBalances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>All settled up! No outstanding balances.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {yourBalances.map((balance, index) => {
                const isYouOwe = balance.from === "1"
                const otherMember = members.find((m) => m.id === (isYouOwe ? balance.to : balance.from))

                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {otherMember?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {isYouOwe ? "You owe" : "Owes you"} {otherMember?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{otherMember?.email}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${isYouOwe ? "text-destructive" : "text-primary"}`}>
                      ${balance.amount.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No expenses yet. Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => {
                const paidByMember = members.find((m) => m.id === expense.paidBy)
                const splitAmount = expense.amount / expense.splitBetween.length

                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {paidByMember?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid by {paidByMember?.name} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${splitAmount.toFixed(2)} per person</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
