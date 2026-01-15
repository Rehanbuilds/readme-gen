"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ReadmeFormData } from "@/lib/types"

interface UrlAutofillProps {
  onDataFetched: (data: Partial<ReadmeFormData>) => void
}

export function UrlAutofill({ onDataFetched }: UrlAutofillProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProjectData = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a GitHub repository URL.",
        variant: "destructive",
      })
      return
    }

    // Extract owner and repo from GitHub URL
    const githubPattern = /github\.com\/([^/]+)\/([^/?#]+)/
    const match = url.match(githubPattern)

    if (!match) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      })
      return
    }

    const [, owner, repo] = match
    setIsLoading(true)

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)

      if (!response.ok) {
        throw new Error("Failed to fetch repository data")
      }

      const data = await response.json()

      // Fetch README to extract additional info
      let readmeContent = ""
      try {
        const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: { Accept: "application/vnd.github.raw" },
        })
        if (readmeResponse.ok) {
          readmeContent = await readmeResponse.text()
        }
      } catch (e) {
        // README fetch is optional, continue without it
      }

      // Extract tech stack from topics and language
      const techStack = []
      if (data.language) techStack.push(data.language)
      if (data.topics && data.topics.length > 0) {
        techStack.push(...data.topics.slice(0, 5))
      }

      onDataFetched({
        projectName: data.name || "",
        description: data.description || "",
        repositoryUrl: data.html_url || url,
        githubUsername: owner,
        techStack: techStack,
        demoUrl: data.homepage || "",
      })

      toast({
        title: "Data fetched successfully!",
        description: "Your form has been auto-filled with repository information.",
      })

      setUrl("")
    } catch (error) {
      console.error("Error fetching repository:", error)
      toast({
        title: "Fetch failed",
        description: "Could not fetch repository data. Please check the URL and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Link2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Quick Start with URL</CardTitle>
            <CardDescription>Fetch project info from your GitHub repository</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="https://github.com/username/repository"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchProjectData()
            }
          }}
        />
        <Button onClick={fetchProjectData} disabled={isLoading || !url.trim()} className="w-full rounded-full">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 mr-2" />
              Auto-Fill from URL
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
