"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ReadmeFormData } from "@/lib/types"

interface AIQuickStartProps {
  onAnalysisComplete: (data: Partial<ReadmeFormData>) => void
}

export function AIQuickStart({ onAnalysisComplete }: AIQuickStartProps) {
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const analyzeProject = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a product URL or description.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze project")
      }

      const { analysis } = await response.json()

      onAnalysisComplete({
        projectName: analysis.projectName || "",
        description: analysis.description || "",
        features: analysis.features || [],
        techStack: analysis.techStack || [],
        prerequisites: analysis.prerequisites || "",
      })

      toast({
        title: "Analysis complete!",
        description: "Your form has been auto-filled with AI suggestions.",
      })

      setInput("")
    } catch (error) {
      console.error("[v0] Error during analysis:", error)
      toast({
        title: "Analysis failed",
        description: "Please try again or fill the form manually.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Quick Start with AI</CardTitle>
            <CardDescription>Let AI analyze your project and auto-fill the form</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your product URL or describe your project...&#10;Example: https://github.com/username/project&#10;Or: A task management app built with React and Node.js"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isAnalyzing}
        />
        <Button onClick={analyzeProject} disabled={isAnalyzing || !input.trim()} className="w-full rounded-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Auto-Fill with AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
