import { Overview } from "@/lib/schemas";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { RadialScore, Score, ScoreCard } from "../ui/score-card";
import { Button } from "./button";
type OverviewProps = {
  overview: Overview;
  clearPDF: () => void;
};

type RankCardProps = {
  rank: number;
  title: string;
  reason: string;
};

type QuoteCardProps = {
  relevance: number;
  quote: string;
  chapter: string;
  position: number;
};
const RankCard: React.FC<RankCardProps> = ({ rank, title, reason }) => {
  return (
    <ScoreCard className="border-0" score={rank}>
      <CardContent>
        <RadialScore score={rank} className="mx-auto w-24 h-24 mb-8 mt-12" />
        <CardTitle className="text-center mb-2">{title}</CardTitle>
        <CardDescription>
          <p className="text-center md:text-sm text-xs dark:text-zinc-300 text-zinc-800">
            {reason}
          </p>
        </CardDescription>
      </CardContent>
    </ScoreCard>
  );
};

const QuoteCard: React.FC<QuoteCardProps> = ({
  relevance,
  quote,
  chapter,
  position,
}) => {
  return (
    <Card
      className={`mb-2 dark:bg-zinc-800 bg-zinc-200 ${
        relevance > 8 && "bg-green-500/10 border-green-500/50"
      } `}
    >
      <CardContent className="dark:text-zinc-300 py-3 text-foreground">
        <CardDescription className="italic mb-4 sm:text-md text-sm text-foreground">
          &quot;{quote}&quot;
        </CardDescription>
        <CardFooter className="w-full flex justify-between p-0 items-end">
          <div className="flex flex-col text-xs sm:text-sm">
            <p className="mr-4 ">Chapter: {chapter}</p>
            <p className=" mr-4 ">Line: {position}</p>
          </div>
          <div className="flex text-xs sm:text-sm">
            <p className="mr-2">Relevance: </p>{" "}
            <Score score={relevance}>{relevance}</Score>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};
export const ReportOverview: React.FC<{ overview: Overview }> = ({
  overview,
}) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 mx-auto mb-8">
        <RankCard
          rank={overview.relevance.value}
          title="Relevance"
          reason={overview.relevance.reason}
        />
        <RankCard
          rank={overview.credibility.value}
          title="Credibility"
          reason={overview.credibility.reason}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground mb-4">Overview</h3>
        <p className="dark:text-zinc-300 text-zinc-700 sm:text-lg text-md text-foreground">
          {overview.overview}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">
          Supporting Statements
        </h3>
        <p className="mb-4 text-sm text-zinc-500">
          {overview.supportingStatements.length > 0
            ? "Disclaimer: Thesis Supporter uses a LLM to identify the most relevant statements to your thesis. Some statements may not be fully reflective of the context or entirely accurate. Please independantly verify all statements before use."
            : "There are no statements in this document that support your thesis. The document you submitted is either to irrelevant to your thesis or lacks credibility."}
        </p>
        {overview.supportingStatements.map((statement, index) => (
          <QuoteCard
            key={index}
            relevance={statement.relevance}
            quote={statement.statement}
            chapter={statement.chapter}
            position={statement.position}
          ></QuoteCard>
        ))}
      </div>
    </div>
  );
};
