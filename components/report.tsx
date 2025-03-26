import { Chapter, Overview } from "@/lib/schemas";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import Navigation from "./ui/navigation";
import { ReportOverview } from "./ui/overview";
import { Statements } from "./ui/statements";
import { RelevantChapters } from "./ui/relevantChapters";
import { ThemeButton } from "./ui/themeButton";
type OverviewProps = {
  overview: Overview;
  clearPDF: () => void;
};

export const PAGE_COMPONENTS = {
  overview: {
    page: ReportOverview,
    title: "Overview",
  },
  statements: {
    page: Statements,
    title: "Supporting Statements",
  },
  relevantChapters: {
    page: RelevantChapters,
    title: "Relevant Chapters",
  },
};
export default function Report({ overview, clearPDF }: OverviewProps) {
  const [selectedPage, setSelectedPage] =
    useState<keyof typeof PAGE_COMPONENTS>("overview");

  const PageComponent = PAGE_COMPONENTS[selectedPage].page || ReportOverview;
  return (
    <div className=" bg-background text-foreground w-full h-lvh sm:p-10 pp-1">
      <div className="container mx-auto max-w-6xl h-full">
        <div className="flex h-full">
          <div className="h-full dark:bg-zinc-900 bg-zinc-100 sm:rounded-lg relative w-full">
            <div className="w-full border-b dark:border-b-zinc-600 border-b-zinc-300 pt-2 pb-2 px-4 absolute dark:bg-zinc-900/50 bg-zinc-200 backdrop-blur-lg rounded-t-lg ">
              <h1 className="text-sm whitespace-nowrap overflow-hidden overflow-ellipsis text-foreground">
                {overview.title}
              </h1>
            </div>
            <div className="h-full pt-9 flex">
              {/* <Navigation
                clearPDF={clearPDF}
                onSelectPage={setSelectedPage}
                selectedPage={selectedPage}
              /> */}
              <div className="overflow-y-scroll px-4 h-full pb-2 pt-4 chapter-scrollbar">
                <PageComponent overview={overview} />
                <div className="flex ">
                  <Button
                    onClick={clearPDF}
                    className="bg-primary hover:bg-primary/90 ml-auto mr-12"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Try Another PDF
                  </Button>

                  <ThemeButton className="mr-auto h-9 w-9 rounded-lg " />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
