"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Copy, Download, Github, Plus, X, FileText, Sparkles, Zap, Clock } from "lucide-react"
import { generateReadme } from "@/lib/generate-readme"
import type { ReadmeFormData } from "@/lib/types"
import { UrlAutofill } from "@/components/url-autofill"

export default function ReadmeGenPage() {
  const { toast } = useToast()
  const [showGenerator, setShowGenerator] = useState(false)
  const [formData, setFormData] = useState<ReadmeFormData>({
    projectName: "",
    description: "",
    features: [],
    techStack: [],
    prerequisites: "",
    installCommand: "npm install",
    usageCommand: "npm run dev",
    envVariables: [],
    demoUrl: "",
    screenshotUrl: "",
    contributing: "",
    roadmap: [],
    license: "MIT",
    authorName: "",
    githubUsername: "",
    repositoryUrl: "",
    badges: {
      build: false,
      version: false,
      license: false,
      downloads: false,
    },
  })

  const [readme, setReadme] = useState("")
  const [featureInput, setFeatureInput] = useState("")
  const [envInput, setEnvInput] = useState("")
  const [roadmapInput, setRoadmapInput] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)

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

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addEnvVariable = () => {
    if (envInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        envVariables: [...prev.envVariables, envInput.trim()],
      }))
      setEnvInput("")
    }
  }

  const removeEnvVariable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      envVariables: prev.envVariables.filter((_, i) => i !== index),
    }))
  }

  const addRoadmapItem = () => {
    if (roadmapInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        roadmap: [...prev.roadmap, roadmapInput.trim()],
      }))
      setRoadmapInput("")
    }
  }

  const removeRoadmapItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      roadmap: prev.roadmap.filter((_, i) => i !== index),
    }))
  }

  const handleDataFetch = (fetchedData: Partial<ReadmeFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...fetchedData,
      features: [...prev.features, ...(fetchedData.features || [])],
      techStack: [...prev.techStack, ...(fetchedData.techStack || [])],
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

  const techOptions = [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Python",
    "Django",
    "Flask",
    "Vue.js",
    "Angular",
    "Svelte",
    "Go",
    "Rust",
    "Java",
    "Spring Boot",
    "Docker",
    "Kubernetes",
  ]

  if (!showGenerator) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-2 md:px-4">
          <div className="bg-card/80 backdrop-blur-lg border border-border rounded-full px-3 md:px-6 py-2 md:py-4 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 md:gap-2">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                <span className="text-base md:text-xl font-bold text-foreground whitespace-nowrap">README Gen</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-transparent text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
                asChild
              >
                <a
                  href="https://github.com/Rehanbuilds/readme-gen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 md:gap-2"
                >
                  <Github className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Star on</span> GitHub
                </a>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 px-4 flex-grow">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Free & Open Source
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
              Generate Professional READMEs in <span className="text-primary">Seconds</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
              Stop writing boilerplate. Create beautiful, comprehensive README.md files for your projects with our
              intuitive generator.
            </p>

            <Button
              size="lg"
              className="rounded-full text-base md:text-lg px-6 md:px-8 py-4 h-auto"
              onClick={() => setShowGenerator(true)}
            >
              Generate README
            </Button>
          </div>

          {/* Decorative gradient blur */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50" />
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Why README Gen?</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Documentation matters. Make yours shine with minimal effort.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <Card className="border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Generate complete, professional README files in under a minute. No more staring at blank markdown
                    files.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card className="border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Best Practices</CardTitle>
                  <CardDescription>
                    Follow industry standards with proper sections, badges, and formatting that make your project look
                    professional.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="border-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Save Time</CardTitle>
                  <CardDescription>
                    Focus on building great software, not writing documentation. Let README Gen handle the boilerplate
                    for you.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Additional Benefits */}
            <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Customizable Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Add badges, screenshots, roadmaps, and more. Tailor every section to your project's needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See your README come to life in real-time as you fill in the details. What you see is what you get.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">One-Click Export</h3>
                  <p className="text-sm text-muted-foreground">
                    Download your README.md or copy it directly to your clipboard. Ready to commit in seconds.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">No Sign Up Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Start generating immediately. No accounts, no tracking, no hassle. Just great READMEs.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12 md:mt-16">
              <Button
                size="lg"
                className="rounded-full text-base md:text-lg px-6 md:px-8 py-4 h-auto"
                onClick={() => setShowGenerator(true)}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-8 px-4 mt-auto">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground text-center">
                © README Gen Built by Rehan, free and open sourced
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://x.com/MRehan_5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter/X"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/Rehanbuilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://rehanbuilds.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Website"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-2 md:px-4">
        <div className="bg-card/80 backdrop-blur-lg border border-border rounded-full px-3 md:px-6 py-2 md:py-4 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setShowGenerator(false)}
              className="flex items-center gap-1.5 md:gap-2 hover:opacity-80 transition-opacity"
            >
              <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
              <span className="text-base md:text-xl font-bold text-foreground whitespace-nowrap">README Gen</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-transparent text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
              asChild
            >
              <a
                href="https://github.com/Rehanbuilds/readme-gen"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 md:gap-2"
              >
                <Github className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Star on</span> GitHub
              </a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 md:pt-28 pb-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px]">
          {/* Form Section - Left Side */}
          <div className="space-y-6">
            {/* Url Autofill section */}
            <UrlAutofill onDataFetched={handleDataFetch} />

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Fill in your project information to generate a README</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="my-awesome-project"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repositoryUrl">Repository URL</Label>
                  <Input
                    id="repositoryUrl"
                    placeholder="https://github.com/username/repo"
                    value={formData.repositoryUrl}
                    onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your project..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Badges</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="badge-build"
                        checked={formData.badges.build}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            badges: { ...formData.badges, build: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="badge-build" className="text-sm cursor-pointer font-normal">
                        Build Status
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="badge-version"
                        checked={formData.badges.version}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            badges: { ...formData.badges, version: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="badge-version" className="text-sm cursor-pointer font-normal">
                        Version
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="badge-license"
                        checked={formData.badges.license}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            badges: { ...formData.badges, license: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="badge-license" className="text-sm cursor-pointer font-normal">
                        License
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="badge-downloads"
                        checked={formData.badges.downloads}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            badges: { ...formData.badges, downloads: checked as boolean },
                          })
                        }
                      />
                      <Label htmlFor="badge-downloads" className="text-sm cursor-pointer font-normal">
                        Downloads
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Demo URL (optional)</Label>
                  <Input
                    id="demoUrl"
                    placeholder="https://your-demo.com"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshotUrl">Screenshot URL (optional)</Label>
                  <Input
                    id="screenshotUrl"
                    placeholder="https://your-screenshot.png"
                    value={formData.screenshotUrl}
                    onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature..."
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" size="icon" onClick={addFeature} className="rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md">
                          <span className="flex-1">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => removeFeature(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="space-y-3">
                  <Label>Tech Stack</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {techOptions.map((tech) => (
                      <div key={tech} className="flex items-center space-x-2">
                        <Checkbox
                          id={tech}
                          checked={formData.techStack.includes(tech)}
                          onCheckedChange={(checked) => handleTechStackChange(tech, checked as boolean)}
                        />
                        <Label htmlFor={tech} className="text-sm cursor-pointer font-normal">
                          {tech}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites (optional)</Label>
                  <Textarea
                    id="prerequisites"
                    placeholder="e.g., Node.js v18+, npm or yarn"
                    rows={2}
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  />
                </div>

                {/* Installation Command */}
                <div className="space-y-2">
                  <Label htmlFor="installCommand">Installation Command</Label>
                  <Input
                    id="installCommand"
                    value={formData.installCommand}
                    onChange={(e) => setFormData({ ...formData, installCommand: e.target.value })}
                  />
                </div>

                {/* Usage Command */}
                <div className="space-y-2">
                  <Label htmlFor="usageCommand">Usage Command</Label>
                  <Input
                    id="usageCommand"
                    value={formData.usageCommand}
                    onChange={(e) => setFormData({ ...formData, usageCommand: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Environment Variables (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., DATABASE_URL=your_database_url"
                      value={envInput}
                      onChange={(e) => setEnvInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEnvVariable())}
                    />
                    <Button type="button" size="icon" onClick={addEnvVariable} className="rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.envVariables.length > 0 && (
                    <div className="space-y-2">
                      {formData.envVariables.map((envVar, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md font-mono"
                        >
                          <span className="flex-1">{envVar}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => removeEnvVariable(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Roadmap (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a future feature or milestone..."
                      value={roadmapInput}
                      onChange={(e) => setRoadmapInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRoadmapItem())}
                    />
                    <Button type="button" size="icon" onClick={addRoadmapItem} className="rounded-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.roadmap.length > 0 && (
                    <div className="space-y-2">
                      {formData.roadmap.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md">
                          <span className="flex-1">{item}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => removeRoadmapItem(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contributing">Contributing Guidelines (optional)</Label>
                  <Textarea
                    id="contributing"
                    placeholder="Add custom contributing guidelines..."
                    rows={3}
                    value={formData.contributing}
                    onChange={(e) => setFormData({ ...formData, contributing: e.target.value })}
                  />
                </div>

                <Separator />

                {/* License */}
                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
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
                      <SelectItem value="BSD">BSD</SelectItem>
                      <SelectItem value="ISC">ISC</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Author Name */}
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    placeholder="John Doe"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  />
                </div>

                {/* GitHub Username */}
                <div className="space-y-2">
                  <Label htmlFor="githubUsername">GitHub Username</Label>
                  <Input
                    id="githubUsername"
                    placeholder="johndoe"
                    value={formData.githubUsername}
                    onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                  />
                </div>

                {/* Clear Form Button */}
                <Separator />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full bg-transparent"
                  onClick={() => {
                    setFormData({
                      projectName: "",
                      description: "",
                      features: [],
                      techStack: [],
                      prerequisites: "",
                      installCommand: "npm install",
                      usageCommand: "npm run dev",
                      envVariables: [],
                      demoUrl: "",
                      screenshotUrl: "",
                      contributing: "",
                      roadmap: [],
                      license: "MIT",
                      authorName: "",
                      githubUsername: "",
                      repositoryUrl: "",
                      badges: {
                        build: false,
                        version: false,
                        license: false,
                        downloads: false,
                      },
                    })
                    setFeatureInput("")
                    setEnvInput("")
                    setRoadmapInput("")
                    toast({
                      title: "Form cleared",
                      description: "All fields have been reset to default values.",
                    })
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Form
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Live README.md preview</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="rounded-full bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadReadme}
                      className="rounded-full bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 max-h-[600px] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">{readme}</pre>
                </div>
              </CardContent>
            </Card>

            {/* How to Add to Your Repository */}
            <Card>
              <CardHeader>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <CardTitle>How to Add to Your Repository</CardTitle>
                  <span className="text-muted-foreground">{showInstructions ? "−" : "+"}</span>
                </button>
              </CardHeader>
              {showInstructions && (
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. GitHub Web Interface</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to your repository, click "Add file" → "Create new file", name it{" "}
                      <code className="bg-muted px-1 py-0.5 rounded">README.md</code>, paste the content, and commit.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">2. Command Line</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs font-mono">
                        # Copy the README content to clipboard first
                        <br />$ pbpaste {"> README.md # macOS"}
                        <br />$ git add README.md
                        <br />$ git commit -m "Add README"
                        <br />$ git push
                      </code>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">3. Simple Copy & Paste</h4>
                    <p className="text-sm text-muted-foreground">
                      Create a new file named <code className="bg-muted px-1 py-0.5 rounded">README.md</code> in your
                      project root, paste the content, and save.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
