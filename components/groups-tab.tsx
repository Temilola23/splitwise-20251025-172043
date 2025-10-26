"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, UsersIcon, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddGroupDialog } from "@/components/add-group-dialog"
import { AddMemberDialog } from "@/components/add-member-dialog"

export function GroupsTab() {
  const { groups, members } = useStore()
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Members Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Members</CardTitle>
                <CardDescription>People you split expenses with</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddMemberDialogOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                  {member.id === "1" && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">You</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Groups Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Groups</CardTitle>
                <CardDescription>Organize expenses by groups</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddGroupDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-sm font-semibold mb-2">No groups yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create groups to organize your expenses</p>
                <Button size="sm" onClick={() => setIsAddGroupDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Group
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => {
                  const groupMembers = members.filter((m) => group.members.includes(m.id))

                  return (
                    <div key={group.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(group.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <UsersIcon className="h-4 w-4 text-primary" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {groupMembers.slice(0, 4).map((member) => (
                            <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {groupMembers.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs font-medium">+{groupMembers.length - 4}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {groupMembers.length} {groupMembers.length === 1 ? "member" : "members"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddGroupDialog open={isAddGroupDialogOpen} onOpenChange={setIsAddGroupDialogOpen} />
      <AddMemberDialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen} />
    </div>
  )
}
