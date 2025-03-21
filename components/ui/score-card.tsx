import * as React from "react";

import { cn } from "@/lib/utils";

const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle = ({ score, colour }: { score: number; colour: string }) => {
  const r = 45;
  const normalizedScore = score / 10;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - score) * circ) / 100;

  return (
    <circle
      r={r}
      cx={50}
      cy={50}
      fill="transparent"
      stroke={colour}
      strokeWidth={"10"}
      strokeDasharray={circ}
      strokeDashoffset={score ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  );
};

const Text = ({ score, colour }: { score: number; colour: string }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fill={colour}
      className={`text-2xl font-bold text-center`}
    >
      {score.toFixed(0)}
    </text>
  );
};

const RadialScore = React.forwardRef<
  SVGSVGElement,
  React.HTMLAttributes<SVGSVGElement> & { score: number }
>(({ className, score, ...props }, ref) => {
  const scoreNormalised = score * 10;
  const pct = cleanPercentage(scoreNormalised);

  const colour =
    score < 5
      ? "#ef4444"
      : score < 7
      ? "#eab308"
      : score < 9
      ? "#84cc16"
      : "#22c55e";
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("text-primary w-full h-full", className)}
      {...props}
    >
      <g transform={`rotate(90 50 50)`}>
        <Circle colour="#52525b" score={100} />
        <Circle colour={colour} score={pct} />
      </g>
      <Text score={score} colour={colour} />
    </svg>
  );
});
RadialScore.displayName = "RadialScore";

const ScoreCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { score: number }
>(({ className, score, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
      score < 5
        ? "bg-red-500/10 border-red-500/20"
        : score < 7
        ? "bg-yellow-500/10 border-yellow-500/20"
        : score < 9
        ? "bg-lime-500/10 border-lime-500/20"
        : "bg-green-500/10 border-green-500/20"
    )}
    {...props}
  />
));
ScoreCard.displayName = "ScoreCard";

const ScoreCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
ScoreCardHeader.displayName = "ScoreCardHeader";

const ScoreCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ScoreCardTitle.displayName = "ScoreCardTitle";

const ScoreCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ScoreCardDescription.displayName = "ScoreCardDescription";

const ScoreCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
ScoreCardContent.displayName = "ScoreCardContent";

const Score = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { score: number }
>(({ className, score, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "",
      className,
      score < 5
        ? "text-red-500"
        : score < 7
        ? "text-yellow-500"
        : score < 9
        ? "text-lime-500"
        : "text-green-500"
    )}
    {...props}
  />
));
Score.displayName = "Score";

export {
  ScoreCard,
  ScoreCardContent,
  ScoreCardDescription,
  ScoreCardHeader,
  ScoreCardTitle,
  RadialScore,
  Score,
};
