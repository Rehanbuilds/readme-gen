import type { ReadmeFormData } from "./types"

/**
 * Generates a professional README.md content based on form data
 */
export function generateReadme(data: ReadmeFormData): string {
  const { projectName, description, techStack, installCommand, usageCommand, license, authorName, githubUsername } =
    data

  // Generate features based on tech stack
  const features = generateFeatures(techStack)

  // Build the README content
  let readme = ""

  // Title
  if (projectName) {
    readme += `# ${projectName}\n\n`
  } else {
    readme += "# Project Name\n\n"
  }

  // Description
  if (description) {
    readme += `${description}\n\n`
  } else {
    readme += "A brief description of your project.\n\n"
  }

  // Features
  if (features.length > 0) {
    readme += "## 🚀 Features\n\n"
    features.forEach((feature) => {
      readme += `- ${feature}\n`
    })
    readme += "\n"
  }

  // Tech Stack
  if (techStack.length > 0) {
    readme += "## 🛠 Tech Stack\n\n"
    techStack.forEach((tech) => {
      readme += `- ${tech}\n`
    })
    readme += "\n"
  }

  // Installation
  readme += "## 📦 Installation\n\n"
  readme += "```bash\n"
  readme += `${installCommand}\n`
  readme += "```\n\n"

  // Usage
  readme += "## ▶️ Usage\n\n"
  readme += "```bash\n"
  readme += `${usageCommand}\n`
  readme += "```\n\n"

  // Contributing
  readme += "## 🤝 Contributing\n\n"
  readme += "Contributions, issues, and feature requests are welcome!\n\n"

  // License
  if (license && license !== "None") {
    readme += "## 📄 License\n\n"
    readme += `This project is licensed under the ${license} License.\n\n`
  }

  // Author
  if (authorName || githubUsername) {
    readme += "## 👤 Author\n\n"
    if (authorName) {
      readme += `**${authorName}**\n\n`
    }
    if (githubUsername) {
      readme += `- GitHub: [@${githubUsername}](https://github.com/${githubUsername})\n`
    }
  }

  return readme
}

/**
 * Generates feature list based on selected tech stack
 */
function generateFeatures(techStack: string[]): string[] {
  const featureMap: Record<string, string> = {
    React: "Built with React for a modern, component-based architecture",
    "Next.js": "Server-side rendering and static site generation with Next.js",
    "Node.js": "Powered by Node.js for scalable backend operations",
    "Tailwind CSS": "Styled with Tailwind CSS for responsive, utility-first design",
    Express: "RESTful API built with Express.js",
    MongoDB: "MongoDB database for flexible, document-based storage",
    PostgreSQL: "PostgreSQL database for reliable, relational data management",
  }

  return techStack.filter((tech) => featureMap[tech]).map((tech) => featureMap[tech])
}
