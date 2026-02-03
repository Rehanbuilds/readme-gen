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
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found. Make sure the URL is correct and the repository is public.")
        } else if (response.status === 403) {
          throw new Error("Rate limit exceeded. Please try again later.")
        }
        throw new Error("Failed to fetch repository data")
      }

      const data = await response.json()

      let readmeDescription = ""
      try {
        const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json()
          // Decode base64 content
          const content = atob(readmeData.content)
          // Extract first paragraph or heading as additional description
          const lines = content.split("\n").filter((line) => line.trim())
          for (const line of lines) {
            // Skip title, badges, and empty lines
            if (!line.startsWith("#") && !line.startsWith("!") && !line.startsWith("[") && line.length > 20) {
              readmeDescription = line.trim()
              break
            }
          }
        }
      } catch (e) {
        // README fetch is optional
        console.log("[v0] README fetch failed, continuing without it")
      }

      const fullDescription = readmeDescription || data.description || ""

      const techStack: string[] = []
      if (data.language) techStack.push(data.language)
      if (data.topics && data.topics.length > 0) {
        // Filter and clean topics
        const relevantTopics = data.topics
          .filter((topic: string) => !topic.includes("-") || topic.length < 20)
          .slice(0, 5)
        techStack.push(...relevantTopics)
      }

      try {
        const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
        if (languagesResponse.ok) {
          const languages = await languagesResponse.json()
          const topLanguages = Object.keys(languages).slice(0, 3)
          topLanguages.forEach((lang) => {
            if (!techStack.includes(lang)) {
              techStack.push(lang)
            }
          })
        }
      } catch (e) {
        console.log("[v0] Languages fetch failed, continuing without it")
      }

      onDataFetched({
        projectName: data.name || "",
        description: fullDescription,
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
      console.error("[v0] Error fetching repository:", error)
      toast({
        title: "Fetch failed",
        description: error instanceof Error ? error.message : "Could not fetch repository data. Please try again.",
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



