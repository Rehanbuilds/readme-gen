"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Copy, Download, Github } from "lucide-react"
import { generateReadme } from "@/lib/generate-readme"
import type { ReadmeFormData } from "@/lib/types"

export default function ReadmeGenPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<ReadmeFormData>({
    projectName: "",
    description: "",
    techStack: [],
    installCommand: "npm install",
    usageCommand: "npm run dev",
    license: "MIT",
    authorName: "",
    githubUsername: "",
  })

  const [readme, setReadme] = useState("")

  // Generate README in real-time
  useEffect(() => {
    const generatedReadme = generateReadme(formData)
    setReadme(generatedReadme)
  }, [formData])

  const handleTechStackChange = (tech: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      techStack: checked ? [...prev.techStack, tech] : prev.techStack.filter((t) => t !== tech),
    }))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readme)
      toast({
        title: "Copied to clipboard!",
        description: "README content has been copied successfully.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const downloadReadme = () => {
    const blob = new Blob([readme], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "README.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Your README.md file is being downloaded.",
    })
  }

  const techOptions = ["React", "Next.js", "Node.js", "Tailwind CSS", "Express", "MongoDB", "PostgreSQL"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">README Gen</h1>
              <p className="text-sm text-muted-foreground mt-1">Instantly generate professional README.md files</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Fill in your project information to generate a README</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium text-foreground">
                  Project Name
                </label>
                <Input
                  id="projectName"
                  placeholder="my-awesome-project"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your project..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Tech Stack</label>
                <div className="grid grid-cols-2 gap-3">
                  {techOptions.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={formData.techStack.includes(tech)}
                        onCheckedChange={(checked) => handleTechStackChange(tech, checked as boolean)}
                      />
                      <label htmlFor={tech} className="text-sm text-foreground cursor-pointer">
                        {tech}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Installation Command */}
              <div className="space-y-2">
                <label htmlFor="installCommand" className="text-sm font-medium text-foreground">
                  Installation Command
                </label>
                <Input
                  id="installCommand"
                  value={formData.installCommand}
                  onChange={(e) => setFormData({ ...formData, installCommand: e.target.value })}
                />
              </div>

              {/* Usage Command */}
              <div className="space-y-2">
                <label htmlFor="usageCommand" className="text-sm font-medium text-foreground">
                  Usage Command
                </label>
                <Input
                  id="usageCommand"
                  value={formData.usageCommand}
                  onChange={(e) => setFormData({ ...formData, usageCommand: e.target.value })}
                />
              </div>

              {/* License */}
              <div className="space-y-2">
                <label htmlFor="license" className="text-sm font-medium text-foreground">
                  License
                </label>
                <Select
                  value={formData.license}
                  onValueChange={(value) => setFormData({ ...formData, license: value })}
                >
                  <SelectTrigger id="license">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MIT">MIT</SelectItem>
                    <SelectItem value="Apache 2.0">Apache 2.0</SelectItem>
                    <SelectItem value="GPL">GPL</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Author Name */}
              <div className="space-y-2">
                <label htmlFor="authorName" className="text-sm font-medium text-foreground">
                  Author Name
                </label>
                <Input
                  id="authorName"
                  placeholder="John Doe"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                />
              </div>

              {/* GitHub Username */}
              <div className="space-y-2">
                <label htmlFor="githubUsername" className="text-sm font-medium text-foreground">
                  GitHub Username
                </label>
                <Input
                  id="githubUsername"
                  placeholder="johndoe"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Live README.md preview</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadReadme} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4 font-mono text-sm leading-relaxed overflow-auto max-h-[calc(100vh-16rem)]">
                  <pre className="whitespace-pre-wrap text-foreground">{readme}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <p>
              Built by <span className="font-medium text-foreground">Rehan Matloob</span>
            </p>
            <p>Open Source • MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
