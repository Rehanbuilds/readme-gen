"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DraftManager, type Draft } from "@/lib/draft-manager"
import type { ReadmeFormData } from "@/lib/types"
import { Save, FolderOpen, Trash2, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DraftManagerDialogProps {
  currentData: ReadmeFormData
  onLoad: (data: ReadmeFormData) => void
}

export function DraftManagerDialog({ currentData, onLoad }: DraftManagerDialogProps) {
  const [open, setOpen] = useState(false)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [draftName, setDraftName] = useState("")
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadDrafts()
    }
  }, [open])

  const loadDrafts = () => {
    const allDrafts = DraftManager.getAllDrafts()
    setDrafts(allDrafts.sort((a, b) => b.updatedAt - a.updatedAt))
  }

  const handleSave = () => {
    if (!draftName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your draft.",
        variant: "destructive",
      })
      return
    }

    if (selectedDraftId) {
      DraftManager.updateDraft(selectedDraftId, draftName, currentData)
      toast({
        title: "Draft updated",
        description: `"${draftName}" has been updated successfully.`,
      })
    } else {
      DraftManager.saveDraft(draftName, currentData)
      toast({
        title: "Draft saved",
        description: `"${draftName}" has been saved successfully.`,
      })
    }

    setDraftName("")
    setSelectedDraftId(null)
    loadDrafts()
  }

  const handleLoad = (draft: Draft) => {
    onLoad(draft.data)
    setOpen(false)
    toast({
      title: "Draft loaded",
      description: `"${draft.name}" has been loaded successfully.`,
    })
  }

  const handleDelete = (id: string, name: string) => {
    DraftManager.deleteDraft(id)
    toast({
      title: "Draft deleted",
      description: `"${name}" has been deleted.`,
    })
    loadDrafts()
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full bg-transparent">
          <Save className="h-4 w-4 mr-2" />
          Drafts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Manage Drafts</DialogTitle>
          <DialogDescription>Save your current work or load a previous draft.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Save Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Save Current Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="draft-name">Draft Name</Label>
                <Input
                  id="draft-name"
                  placeholder="My README Draft"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
              </div>
              <Button onClick={handleSave} className="w-full rounded-full">
                <Save className="h-4 w-4 mr-2" />
                {selectedDraftId ? "Update Draft" : "Save as New Draft"}
              </Button>
            </CardContent>
          </Card>

          {/* Load Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saved Drafts</CardTitle>
              <CardDescription>
                {drafts.length === 0 ? "No drafts saved yet" : `${drafts.length} draft(s) saved`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <Card key={draft.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{draft.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span>Updated {formatDate(draft.updatedAt)}</span>
                            </div>
                            {draft.data.projectName && (
                              <p className="text-sm text-muted-foreground mt-1 truncate">
                                {draft.data.projectName}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLoad(draft)}
                              className="rounded-full"
                            >
                              <FolderOpen className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(draft.id, draft.name)}
                              className="rounded-full text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}





