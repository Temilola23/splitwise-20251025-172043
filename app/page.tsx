"use client"

import { useState } from "react"
import { DashboardTab } from "@/components/dashboard-tab"
import { ExpensesTab } from "@/components/expenses-tab"
import { SettleTab } from "@/components/settle-tab"
import { GroupsTab } from "@/components/groups-tab"
import { NavigationMenu } from "@/components/navigation-menu"
import { Wallet } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-balance">Splitwise</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Split bills and manage expenses with friends
                </p>
              </div>
            </div>
            <NavigationMenu activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "expenses" && <ExpensesTab />}
          {activeTab === "settle" && <SettleTab />}
          {activeTab === "groups" && <GroupsTab />}
        </div>
      </div>
    </main>
  )
}
