"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, DollarSign, Receipt, Wallet, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationMenuProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: DollarSign },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "settle", label: "Settle Up", icon: Wallet },
  { id: "groups", label: "Groups", icon: Users },
]

export function NavigationMenu({ activeTab, onTabChange }: NavigationMenuProps) {
  const [open, setOpen] = useState(false)

  const handleTabChange = (tab: string) => {
    onTabChange(tab)
    setOpen(false)
  }

  const activeItem = menuItems.find((item) => item.id === activeTab)
  const ActiveIcon = activeItem?.icon || DollarSign

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Menu className="h-5 w-5" />
          <ActiveIcon className="h-4 w-4" />
          <span className="font-medium">{activeItem?.label || "Menu"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "justify-start gap-3 h-12 text-base",
                  activeTab === item.id && "bg-primary text-primary-foreground",
                )}
                onClick={() => handleTabChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
