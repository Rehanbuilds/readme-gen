"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { GripVertical, List } from "lucide-react"
import { defaultSections, type Section } from "@/lib/section-types"

interface SectionReorderProps {
  sections: Section[]
  onSectionsChange: (sections: Section[]) => void
}

function SortableItem({ section, onToggle }: { section: Section; onToggle: (id: string, enabled: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="border-2">
      <div className="flex items-center gap-3 p-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <Label htmlFor={`section-${section.id}`} className="flex-1 cursor-pointer font-medium">
          {section.label}
        </Label>
        <Switch
          id={`section-${section.id}`}
          checked={section.enabled}
          onCheckedChange={(checked) => onToggle(section.id, checked)}
        />
      </div>
    </Card>
  )
}

export function SectionReorder({ sections, onSectionsChange }: SectionReorderProps) {
  const [open, setOpen] = useState(false)
  const [localSections, setLocalSections] = useState(sections)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setLocalSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        return newItems.map((item, index) => ({ ...item, order: index }))
      })
    }
  }

  const handleToggle = (id: string, enabled: boolean) => {
    setLocalSections((items) => items.map((item) => (item.id === id ? { ...item, enabled } : item)))
  }

  const handleSave = () => {
    onSectionsChange(localSections)
    setOpen(false)
  }

  const handleReset = () => {
    setLocalSections(defaultSections)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full bg-transparent">
          <List className="h-4 w-4 mr-2" />
          Reorder Sections
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reorder README Sections</DialogTitle>
          <DialogDescription>
            Drag and drop to reorder sections. Toggle switches to show or hide sections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {localSections.map((section) => (
                <SortableItem key={section.id} section={section} onToggle={handleToggle} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleReset} className="flex-1 rounded-full bg-transparent">
            Reset
          </Button>
          <Button onClick={handleSave} className="flex-1 rounded-full">
            Apply Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}





