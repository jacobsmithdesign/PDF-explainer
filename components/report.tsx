import { Chapter, Overview } from "@/lib/schemas";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import Navigation from "./ui/navigation";
import { ReportOverview } from "./ui/overview";
import { Statements } from "./ui/statements";
import { RelevantChapters } from "./ui/relevantChapters";
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
          <div className="h-full bg-zinc-900 sm:rounded-lg relative w-full">
            <div className="w-full border-b border-b-zinc-600 pt-2 pb-2 px-4 absolute bg-zinc-900/50 backdrop-blur-lg rounded-t-lg">
              <h1 className="md:text-md text-xs">{overview.title}</h1>
            </div>
            <div className="h-full pt-12 flex">
              {/* <Navigation
                clearPDF={clearPDF}
                onSelectPage={setSelectedPage}
                selectedPage={selectedPage}
              /> */}
              <div className="overflow-y-scroll px-4 h-full pb-8 pt-4 chapter-scrollbar">
                <PageComponent overview={overview} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
