"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { overviewSchema, questionsSchema } from "@/lib/schemas";
import { set, z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import NextLink from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { VercelIcon, GitIcon } from "@/components/icons";
import Report from "@/components/report";

export default function ChatWithFiles() {
  const [files, setFiles] = useState<File[]>([]);
  const [thesis, setThesis] = useState<string>("");
  const [questions, setQuestions] = useState<z.infer<typeof questionsSchema>>(
    []
  );
  const [overview, setOverview] = useState<z.infer<
    typeof overviewSchema
  > | null>();
  const [totalChapters, setTotalChapters] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [quizTitle, setQuizTitle] = useState<string>();

  const {
    submit: submitQuiz,
    object: partialQuestions,
    isLoading: isLoadingQuiz,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? []);
      console.log(questions);
    },
  });

  const {
    submit: submitOverview,
    object: partialOverview,
    isLoading: isLoadingOverview,
  } = experimental_useObject({
    api: "/api/generate-overview",
    schema: overviewSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to fetch document overview. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }) => {
      setOverview(object ?? null);
      object?.supportingStatements.sort((a, b) => b.relevance - a.relevance);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker."
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );
    console.log(validFiles);

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      }))
    );
    submitOverview({ files: encodedFiles, thesis: thesis });
    // submitQuiz({ files: encodedFiles });
    // const generatedQuizTitle = await generateQuizTitle(encodedFiles[0].name);
    // setQuizTitle(generatedQuizTitle);
  };

  const clearPDF = () => {
    setFiles([]);
    setQuestions([]);
    setOverview(null);
  };

  const questionProgress = partialQuestions
    ? (partialQuestions.length / 4) * 100
    : 0;

  const totalOverviewSteps = 5;
  const completedOverviewSteps =
    (partialOverview?.title ? 1 : 0) +
    (partialOverview?.overview ? 1 : 0) +
    (partialOverview?.relevance ? 1 : 0) +
    (partialOverview?.supportingStatements ? 1 : 0) +
    (partialOverview?.relevantChapters ? 1 : 0);
  const overviewProgress = partialOverview
    ? (completedOverviewSteps / totalOverviewSteps) * 100
    : 0;

  const totalStages = 2;

  if (overview) {
    return (
      <div className="w-full flex flex-col flex-initial justify-center">
        <Report overview={overview} clearPDF={clearPDF} />
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        console.log(e.dataTransfer.files);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(PDFs only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-6xl h-full sm:h-fit mt-12 border-0">
        <CardHeader className="text-center space-y-6">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Thesis Supporter
            </CardTitle>
            <CardDescription className="text-base">
              Describe your thesis then upload a PDF file and Thesis Supporter
              will summarize it for you, and generate a report based on its
              suitability for your research.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitWithFiles} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your thesis here"
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              className="w-full p-2 bg-transparent border-b border-muted-foreground/50 focus:border-primary focus:ring-0"
            />
            <div
              className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {files.length > 0 ? (
                  <span className="font-medium text-foreground">
                    {files[0].name}
                  </span>
                ) : (
                  <span>Drop your PDF here or click to browse.</span>
                )}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={files.length === 0}
            >
              {isLoadingOverview ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Overview...</span>
                </span>
              ) : (
                "Generate Overview"
              )}
            </Button>
          </form>
        </CardContent>
        {isLoadingOverview && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(overviewProgress)}%</span>
              </div>
              <Progress value={overviewProgress} className="h-2" />
            </div>
            <div className="w-full space-y-2">
              <div className="grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isLoadingOverview
                      ? "bg-yellow-500/50 animate-pulse"
                      : "bg-muted"
                  }`}
                />
                <span className="text-muted-foreground text-center col-span-4 sm:col-span-2">
                  {partialOverview
                    ? `Generating overview section ${completedOverviewSteps} of ${totalOverviewSteps}`
                    : "Analyzing PDF content"}
                </span>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      <motion.div
        className="flex flex-row gap-4 items-center justify-between fixed bottom-6 text-xs "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <NextLink
          target="_blank"
          href="https://github.com/vercel-labs/ai-sdk-preview-pdf-support"
          className="flex flex-row gap-2 items-center border px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          <GitIcon />
          View Source Code
        </NextLink>

        <NextLink
          target="_blank"
          href="https://vercel.com/templates/next.js/ai-quiz-generator"
          className="flex flex-row gap-2 items-center bg-zinc-900 px-2 py-1.5 rounded-md text-zinc-50 hover:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-50"
        >
          <VercelIcon size={14} />
          Deploy with Vercel
        </NextLink>
      </motion.div>
    </div>
  );
}
