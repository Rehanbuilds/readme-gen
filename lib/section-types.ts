export type SectionType =
  | "badges"
  | "description"
  | "demo"
  | "features"
  | "techStack"
  | "prerequisites"
  | "installation"
  | "envVariables"
  | "usage"
  | "roadmap"
  | "contributing"
  | "license"
  | "author"

export interface Section {
  id: SectionType
  label: string
  enabled: boolean
  order: number
}

export const defaultSections: Section[] = [
  { id: "badges", label: "Badges", enabled: true, order: 0 },
  { id: "description", label: "Description", enabled: true, order: 1 },
  { id: "demo", label: "Demo & Screenshots", enabled: true, order: 2 },
  { id: "features", label: "Features", enabled: true, order: 3 },
  { id: "techStack", label: "Tech Stack", enabled: true, order: 4 },
  { id: "prerequisites", label: "Prerequisites", enabled: true, order: 5 },
  { id: "installation", label: "Installation", enabled: true, order: 6 },
  { id: "envVariables", label: "Environment Variables", enabled: true, order: 7 },
  { id: "usage", label: "Usage", enabled: true, order: 8 },
  { id: "roadmap", label: "Roadmap", enabled: true, order: 9 },
  { id: "contributing", label: "Contributing", enabled: true, order: 10 },
  { id: "license", label: "License", enabled: true, order: 11 },
  { id: "author", label: "Author", enabled: true, order: 12 },
]
