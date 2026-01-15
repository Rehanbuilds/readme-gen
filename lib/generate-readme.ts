import type { ReadmeFormData } from "./types"

/**
 * Generates a professional README.md content based on form data
 */
export function generateReadme(data: ReadmeFormData): string {
  const {
    projectName,
    description,
    features,
    techStack,
    prerequisites,
    installCommand,
    usageCommand,
    envVariables,
    demoUrl,
    screenshotUrl,
    contributing,
    roadmap,
    license,
    authorName,
    githubUsername,
    repositoryUrl,
    badges,
  } = data

  let readme = ""

  // Title
  if (projectName) {
    readme += `# ${projectName}\n\n`
  } else {
    readme += "# Project Name\n\n"
  }

  if (badges && repositoryUrl && (badges.build || badges.version || badges.license || badges.downloads)) {
    const repoPath = repositoryUrl.replace("https://github.com/", "")
    if (badges.build) {
      readme += `![Build Status](https://github.com/${repoPath}/workflows/CI/badge.svg) `
    }
    if (badges.version) {
      readme += `![Version](https://img.shields.io/github/package-json/v/${repoPath}) `
    }
    if (badges.license && license !== "None") {
      readme += `![License](https://img.shields.io/badge/license-${license.replace(" ", "%20")}-blue) `
    }
    if (badges.downloads) {
      readme += `![Downloads](https://img.shields.io/github/downloads/${repoPath}/total) `
    }
    readme += "\n\n"
  }

  // Description
  if (description) {
    readme += `${description}\n\n`
  } else {
    readme += "A brief description of your project.\n\n"
  }

  if (demoUrl || screenshotUrl) {
    if (demoUrl) {
      readme += `## 🔗 Demo\n\n`
      readme += `[Live Demo](${demoUrl})\n\n`
    }
    if (screenshotUrl) {
      readme += `## 📸 Screenshot\n\n`
      readme += `![Screenshot](${screenshotUrl})\n\n`
    }
  }

  if (features && features.length > 0) {
    readme += "## ✨ Features\n\n"
    features.forEach((feature) => {
      if (feature.trim()) {
        readme += `- ${feature}\n`
      }
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

  if (prerequisites) {
    readme += "## 📋 Prerequisites\n\n"
    readme += `${prerequisites}\n\n`
  }

  // Installation
  readme += "## 📦 Installation\n\n"
  if (repositoryUrl) {
    readme += "Clone the repository:\n\n"
    readme += "```bash\n"
    readme += `git clone ${repositoryUrl}\n`
    readme += `cd ${projectName || "project-name"}\n`
    readme += "```\n\n"
    readme += "Install dependencies:\n\n"
  }
  readme += "```bash\n"
  readme += `${installCommand}\n`
  readme += "```\n\n"

  if (envVariables && envVariables.length > 0) {
    readme += "## 🔧 Environment Variables\n\n"
    readme += "Create a `.env` file in the root directory and add the following:\n\n"
    readme += "```env\n"
    envVariables.forEach((envVar) => {
      if (envVar.trim()) {
        readme += `${envVar}\n`
      }
    })
    readme += "```\n\n"
  }

  // Usage
  readme += "## ▶️ Usage\n\n"
  readme += "```bash\n"
  readme += `${usageCommand}\n`
  readme += "```\n\n"

  if (roadmap && roadmap.length > 0) {
    readme += "## 🗺️ Roadmap\n\n"
    roadmap.forEach((item) => {
      if (item.trim()) {
        readme += `- [ ] ${item}\n`
      }
    })
    readme += "\n"
  }

  // Contributing
  readme += "## 🤝 Contributing\n\n"
  if (contributing) {
    readme += `${contributing}\n\n`
  } else {
    readme += "Contributions, issues, and feature requests are welcome!\n\n"
    if (repositoryUrl) {
      readme += `Feel free to check the [issues page](${repositoryUrl}/issues).\n\n`
    }
  }

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

  readme += "\n## ⭐ Show your support\n\n"
  readme += "Give a ⭐️ if this project helped you!\n"

  return readme
}
