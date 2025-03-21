import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths."
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on."
    ),
});

export const overviewSchema = z.object({
  title: z.string().describe("The title of the document."),
  overview: z.string().describe("A brief overview of the document."),
  relevance: z.object({
    value: z
      .number()
      .int()
      .min(1)
      .max(10)
      .describe(
        " A numerical rank (1-10) of the document's overall relevance to the thesis."
      ),
    reason: z
      .string()
      .describe(
        "The reason for the document's relevance rank (maximum 15 words)."
      ),
  }),
  credibility: z.object({
    value: z
      .number()
      .int()
      .min(1)
      .max(10)
      .describe(" A numerical rank (1-10) of the credibility of the sources."),
    reason: z
      .string()
      .describe(
        "The reason for the document's credibility rank (maximum 15 words)."
      ),
  }),
  supportingStatements: z.array(
    z.object({
      statement: z
        .string()
        .describe(
          "Key quote(s) that supports the thesis. In order from most relevant to least."
        ),
      relevance: z
        .number()
        .int()
        .min(1)
        .max(10)
        .describe("The relevance of the quote to the thesis."),
      chapter: z.string().describe("The chapter the quote is from."),
      position: z
        .number()
        .int()
        .describe("The line number in the chapter where the quote is from."),
    })
  ),
  totalChapters: z
    .number()
    .describe(
      "The total number of relevant chapters or sections in the document."
    ),
  relevantChapters: z
    .array(
      z.object({
        title: z.string().describe("The title of the chapter or section."),
        overview: z.string().describe("A brief overview of the chapter."),
        relevance: z.object({
          score: z
            .number()
            .describe(
              "A score of the relevance of the chapter to the thesis (1-10)."
            ),
          reason: z
            .string()
            .describe("Reason for the relevance score (1-2 sentences)."),
        }),
      })
    )
    .describe("An array of relevant chapters."),
});

export const chapterSchema = z.object({
  title: z.string().describe("The title of the chapter."),
  overview: z.string().describe("A brief summary of the chapter."),
});

export type Question = z.infer<typeof questionSchema>;
export type Overview = z.infer<typeof overviewSchema>;
export type Chapter = z.infer<
  typeof overviewSchema.shape.relevantChapters.element
>;

export const questionsSchema = z.array(questionSchema).length(4);
export const chaptersSchema = z.array(chapterSchema);
