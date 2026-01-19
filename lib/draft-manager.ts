import type { ReadmeFormData } from "./types"

const DRAFT_STORAGE_KEY = "readme-gen-drafts"

export interface Draft {
  id: string
  name: string
  data: ReadmeFormData
  createdAt: number
  updatedAt: number
}

export class DraftManager {
  static saveDraft(name: string, data: ReadmeFormData): string {
    const drafts = this.getAllDrafts()
    const id = Date.now().toString()
    
    const draft: Draft = {
      id,
      name,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    drafts.push(draft)
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
    return id
  }

  static updateDraft(id: string, name: string, data: ReadmeFormData): void {
    const drafts = this.getAllDrafts()
    const index = drafts.findIndex((d) => d.id === id)
    
    if (index !== -1) {
      drafts[index] = {
        ...drafts[index],
        name,
        data,
        updatedAt: Date.now(),
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
    }
  }

  static getAllDrafts(): Draft[] {
    if (typeof window === "undefined") return []
    
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!stored) return []
    
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  static getDraft(id: string): Draft | null {
    const drafts = this.getAllDrafts()
    return drafts.find((d) => d.id === id) || null
  }

  static deleteDraft(id: string): void {
    const drafts = this.getAllDrafts()
    const filtered = drafts.filter((d) => d.id !== id)
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filtered))
  }

  static autoSave(data: ReadmeFormData): void {
    const AUTO_SAVE_KEY = "readme-gen-autosave"
    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to autosave:", error)
    }
  }

  static loadAutoSave(): ReadmeFormData | null {
    const AUTO_SAVE_KEY = "readme-gen-autosave"
    if (typeof window === "undefined") return null
    
    const stored = localStorage.getItem(AUTO_SAVE_KEY)
    if (!stored) return null
    
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  static clearAutoSave(): void {
    const AUTO_SAVE_KEY = "readme-gen-autosave"
    localStorage.removeItem(AUTO_SAVE_KEY)
  }
}
