export interface ReadmeFormData {
  projectName: string
  description: string
  features: string[]
  techStack: string[]
  prerequisites: string
  installCommand: string
  usageCommand: string
  envVariables: string[]
  demoUrl: string
  screenshotUrl: string
  contributing: string
  roadmap: string[]
  license: string
  authorName: string
  githubUsername: string
  repositoryUrl: string
  badges: {
    build: boolean
    version: boolean
    license: boolean
    downloads: boolean
  }
}
