import { overviewSchema, chaptersSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, thesis } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-2.0-flash-001"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Your job is to take a document and create a structured summary. **Before analyzing each chapter, count the total number of chapters/sections first and return this count immediately. Step 1: **First, read the document and determine the total number of main chapters excluding their subchapters or subsections (`totalChapters`). Return only this value first. Step 2: After returning `totalChapters`, extract the document title. If no title exists, generate one based on its content. Step 3: Next, provide an overview of the entire document in 2-3 paragraphs. Step 4: Identify only the most relevant chapters or subchapters to the thesis and summarize them sequentially (2-3 paragraphs), giving a reason as to why it's relevant and giving 1 example of a structured argument supporting the thesis using the chapter's content and quotes. If no chapters or sections exist, set `totalChapters: 0` and return `chapters: []`. Rank the document's overall relevance to the thesis and its credibility, which is determined by the sources that were used, the known credibility of the authors, and the type of document that was submitted (academic publications are most favourable). For each chapter: Extract key quotes that support the thesis and rank them (1-10) based on how well they support the thesis.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Thesis: "${thesis}"\nEnsure the response includes thesis relevance rankings, key supporting quotes, and chapter context.`,
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: overviewSchema,
    output: "object",
    onFinish: ({ object }) => {
      const res = overviewSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
