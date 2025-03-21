import { useState } from "react";
import { Button } from "./button";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAGE_COMPONENTS } from "../report";

type NavProps = {
  clearPDF: () => void;
  onSelectPage: (Page: keyof typeof PAGE_COMPONENTS) => void;
  selectedPage: keyof typeof PAGE_COMPONENTS;
};

const Navigation: React.FC<NavProps> = ({
  clearPDF,
  onSelectPage,
  selectedPage,
}) => {
  return (
    <nav className="min-w-80 px-2 pt-2 bg-zinc-950 rounded-lg m-2">
      <h2 className="text-2xl font-bold mb-8 text-foreground">Navigation</h2>
      <div className="grid grid-cols-1 gap-1">
        {Object.keys(PAGE_COMPONENTS).map((page) => (
          <button
            key={page}
            className={`text-left ${
              selectedPage === page ? "bg-zinc-800" : "hover:bg-zinc-900"
            } text-foreground rounded-lg py-1 px-2 `}
            onClick={() => onSelectPage(page as keyof typeof PAGE_COMPONENTS)}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="flex justify-center space-x-4 pt-4">
        <Button
          onClick={clearPDF}
          className="bg-primary hover:bg-primary/90 w-full"
        >
          <FileText className="mr-2 h-4 w-4" />
          Try Another PDF
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
