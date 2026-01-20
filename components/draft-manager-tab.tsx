"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DraftManager, type Draft } from "@/lib/draft-manager"
import type { ReadmeFormData } from "@/lib/types"
import { Save, Trash2, Clock, FolderOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DraftManagerTabProps {
  currentData: ReadmeFormData
  onLoad: (data: ReadmeFormData) => void
}

export function DraftManagerTab({ currentData, onLoad }: DraftManagerTabProps) {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [draftName, setDraftName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadDrafts()
  }, [])

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

    const draftId = DraftManager.saveDraft(draftName, currentData)
    toast({
      title: "Draft saved",
      description: `"${draftName}" has been saved successfully.`,
    })
    setDraftName("")
    loadDrafts()
  }

  const handleLoad = (draft: Draft) => {
    onLoad(draft.data)
    toast({
      title: "Draft loaded",
      description: `"${draft.name}" has been loaded.`,
    })
  }

  const handleDelete = (draftId: string) => {
    DraftManager.deleteDraft(draftId)
    toast({
      title: "Draft deleted",
      description: "Draft has been removed.",
    })
    loadDrafts()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Save Current Draft */}
      <Card>
        <CardHeader>
          <CardTitle>Save Current Draft</CardTitle>
          <CardDescription>Save your current README configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="draft-name">Draft Name</Label>
            <Input
              id="draft-name"
              placeholder="My awesome README draft"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} className="w-full rounded-full">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </CardContent>
      </Card>

      {/* Saved Drafts */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Drafts</CardTitle>
          <CardDescription>
            {drafts.length === 0 ? "No saved drafts yet" : `${drafts.length} saved draft${drafts.length > 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {drafts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No drafts saved yet</p>
                  <p className="text-sm">Save your current form to get started</p>
                </div>
              ) : (
                drafts.map((draft) => (
                  <Card key={draft.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{draft.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="truncate">{formatDate(draft.updatedAt)}</span>
                          </div>
                          {draft.data.projectName && (
                            <p className="text-sm text-muted-foreground mt-1">Project: {draft.data.projectName}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoad(draft)}
                            className="rounded-full bg-transparent"
                          >
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(draft.id)}
                            className="rounded-full bg-transparent text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
