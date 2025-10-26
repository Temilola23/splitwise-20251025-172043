"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Receipt } from "lucide-react" // Declaring the Receipt variable

export function ExpensesTab() {
  const { expenses, members, deleteExpense } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>Manage and track all your shared expenses</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first shared expense</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedExpenses.map((expense) => {
                const paidByMember = members.find((m) => m.id === expense.paidBy)
                const splitAmount = expense.amount / expense.splitBetween.length
                const splitMembers = members.filter((m) => expense.splitBetween.includes(m.id))

                return (
                  <div
                    key={expense.id}
                    className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {paidByMember?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{expense.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            Paid by {paidByMember?.name} on {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{expense.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Split between:</span>
                          <div className="flex -space-x-2">
                            {splitMembers.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                                  {member.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {splitMembers.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs font-medium">+{splitMembers.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium">${splitAmount.toFixed(2)} each</span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(expense.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
