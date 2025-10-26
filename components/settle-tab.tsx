"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, CheckCircle2, Wallet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function SettleTab() {
  const { members, getBalances, getSimplifiedBalances } = useStore()
  const allBalances = getBalances()
  const simplifiedBalances = getSimplifiedBalances()

  const yourBalances = allBalances.filter((b) => b.from === "1" || b.to === "1")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settle Up</CardTitle>
          <CardDescription>View and manage your settlements</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simplified" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simplified">Simplified</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>

            <TabsContent value="simplified" className="space-y-4">
              {simplifiedBalances.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Settled Up!</h3>
                  <p className="text-muted-foreground">No outstanding balances to settle</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Simplified settlements reduce the number of transactions needed
                    </p>
                    <Badge variant="secondary">{simplifiedBalances.length} transactions needed</Badge>
                  </div>

                  {simplifiedBalances.map((balance, index) => {
                    const fromMember = members.find((m) => m.id === balance.from)
                    const toMember = members.find((m) => m.id === balance.to)
                    const isYouInvolved = balance.from === "1" || balance.to === "1"

                    return (
                      <Card key={index} className={isYouInvolved ? "border-primary" : ""}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-destructive text-destructive-foreground">
                                  {fromMember?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{fromMember?.name}</p>
                                <p className="text-sm text-muted-foreground">{fromMember?.email}</p>
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                              <div className="text-center">
                                <p className="text-2xl font-bold text-primary">${balance.amount.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 flex-1 justify-end">
                              <div className="text-right">
                                <p className="font-semibold">{toMember?.name}</p>
                                <p className="text-sm text-muted-foreground">{toMember?.email}</p>
                              </div>
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {toMember?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>

                          {isYouInvolved && (
                            <div className="mt-4 pt-4 border-t">
                              <Button className="w-full" size="lg">
                                <Wallet className="mr-2 h-4 w-4" />
                                {balance.from === "1" ? `Pay ${toMember?.name}` : `Remind ${fromMember?.name}`}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              {allBalances.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Settled Up!</h3>
                  <p className="text-muted-foreground">No outstanding balances to settle</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Detailed view shows all individual balances between members
                    </p>
                    <Badge variant="secondary">{allBalances.length} total balances</Badge>
                  </div>

                  {allBalances.map((balance, index) => {
                    const fromMember = members.find((m) => m.id === balance.from)
                    const toMember = members.find((m) => m.id === balance.to)
                    const isYouInvolved = balance.from === "1" || balance.to === "1"

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isYouInvolved ? "border-primary bg-primary/5" : "bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-destructive text-destructive-foreground">
                              {fromMember?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{fromMember?.name}</p>
                            <p className="text-sm text-muted-foreground">owes</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-xl font-bold text-primary">${balance.amount.toFixed(2)}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-medium">{toMember?.name}</p>
                            <p className="text-sm text-muted-foreground">receives</p>
                          </div>
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {toMember?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {yourBalances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Settlements</CardTitle>
            <CardDescription>Quick actions for your balances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {yourBalances.map((balance, index) => {
              const isYouOwe = balance.from === "1"
              const otherMember = members.find((m) => m.id === (isYouOwe ? balance.to : balance.from))

              return (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback
                        className={
                          isYouOwe ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
                        }
                      >
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
                  <div className="flex items-center gap-4">
                    <div className={`text-lg font-bold ${isYouOwe ? "text-destructive" : "text-primary"}`}>
                      ${balance.amount.toFixed(2)}
                    </div>
                    <Button size="sm" variant={isYouOwe ? "default" : "outline"}>
                      {isYouOwe ? "Pay Now" : "Send Reminder"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
