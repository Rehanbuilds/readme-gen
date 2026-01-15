import { streamObject } from "ai"
import { z } from "zod"

const projectAnalysisSchema = z.object({
  projectName: z.string().describe("The name of the project"),
  description: z.string().describe("A comprehensive description of what the project does"),
  features: z.array(z.string()).describe("List of key features and capabilities"),
  techStack: z.array(z.string()).describe("Technologies used in the project"),
  prerequisites: z.string().optional().describe("Requirements needed to run the project"),
})

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    if (!input || input.trim().length === 0) {
      return Response.json({ error: "Input is required" }, { status: 400 })
    }

    const result = streamObject({
      model: "openai/gpt-4o-mini",
      schema: projectAnalysisSchema,
      prompt: `Analyze the following product/project information and extract structured details for a README:

${input}

If this looks like a URL, try to infer what the project might be about based on the domain/path. Be creative but professional.
Generate a compelling description, identify likely features, and suggest appropriate tech stack.
Keep everything concise and professional for a README file.`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Error analyzing project:", error)
    return Response.json({ error: "Failed to analyze project. Please try again." }, { status: 500 })
  }
}
