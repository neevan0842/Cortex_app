import { clsx, type ClassValue } from "clsx";
import { vars } from "nativewind";
import { twMerge } from "tailwind-merge";

export const themes = {
  light: vars({
    // --- Updated Light Theme Colors ---
    "--color-primary": "#343434", // oklch(0.205 0 0)
    "--color-primary-foreground": "#FAFAFA", // oklch(0.985 0 0)
    "--color-background": "#FFFFFF", // oklch(1 0 0)
    "--color-foreground": "#252525", // oklch(0.145 0 0)
    "--color-muted": "#F7F7F7", // oklch(0.97 0 0)
    "--color-muted-foreground": "#8E8E8E", // oklch(0.556 0 0)
    "--color-border": "#EBEBEB", // oklch(0.922 0 0)

    // --- Custom App-Specific Colors (Preserved) ---
    "--color-talk-listening": "#EF4444", // bright red
    "--color-talk-ai": "#22C55E", // vibrant green
  }),
  dark: vars({
    // --- Updated Dark Theme Colors ---
    "--color-primary": "#EBEBEB", // oklch(0.922 0 0)
    "--color-primary-foreground": "#343434", // oklch(0.205 0 0)
    "--color-background": "#252525", // oklch(0.145 0 0)
    "--color-foreground": "#FAFAFA", // oklch(0.985 0 0)
    "--color-muted": "#454545", // oklch(0.269 0 0)
    "--color-muted-foreground": "#B5B5B5", // oklch(0.708 0 0)
    "--color-border": "#383838", // oklch(1 0 0 / 10%) - Approx.

    // --- Custom App-Specific Colors (Preserved) ---
    "--color-talk-listening": "#EF4444", // same bright red
    "--color-talk-ai": "#22C55E", // same vibrant green
  }),
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
