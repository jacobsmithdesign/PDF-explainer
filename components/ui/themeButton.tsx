"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import MyThemeContext from "@/app/context/themeContext";
import { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const ThemeButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const themeCtx: { isDarkTheme?: boolean; toggleThemeHandler: () => void } =
      useContext(MyThemeContext);
    function toggleThemeHandler(): void {
      themeCtx.toggleThemeHandler();
    }

    return (
      <button
        ref={ref}
        name="Theme handler"
        className={cn("transition-all duration-300", className)}
        onClick={() => {
          toggleThemeHandler();
        }}
      >
        <div
          className={cn(
            `w-10 h-10 dark:bg-indigo-950/60 dark:outline-indigo-400/50 bg-amber-50 outline-orange-300 outline outline-1 rounded-xl items-center justify-center flex transition-all duration-150 md:hover:shadow-md md:hover:scale-110 relative`,
            className
          )}
        >
          <Sun
            className={`${themeCtx} text-amber-500 w-7 h-7 opacity-100 dark:opacity-0 transition-all duration-150 absolute`}
          />
          <Moon
            className={`${themeCtx} text-indigo-400 w-6 h-6 dark:opacity-100 opacity-0 transition-all duration-150`}
          />
        </div>
      </button>
    );
  }
);
ThemeButton.displayName = "Theme Button";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
