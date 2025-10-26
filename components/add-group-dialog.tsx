"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddGroupDialog({ open, onOpenChange }: AddGroupDialogProps) {
  const { members, addGroup } = useStore()
  const [name, setName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>(["1"])
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter a group name")
      return
    }

    if (selectedMembers.length < 2) {
      setError("Please select at least 2 members")
      return
    }

    addGroup({
      id: Date.now().toString(),
      name: name.trim(),
      members: selectedMembers,
      createdAt: new Date(),
    })

    // Reset form
    setName("")
    setSelectedMembers(["1"])
    onOpenChange(false)
  }

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>Create a group to organize your shared expenses</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="e.g., Roommates, Trip to Paris"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Members</Label>
              <div className="space-y-2 border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-member-${member.id}`}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <label
                      htmlFor={`group-member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {member.name}
                      {member.id === "1" && <span className="text-muted-foreground ml-1">(You)</span>}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{selectedMembers.length} members selected</p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
