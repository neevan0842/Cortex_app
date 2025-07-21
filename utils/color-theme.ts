import { vars } from "nativewind";

export const themes = {
  light: vars({
    "--color-primary": "#181824", // hsl(222.2 47.4% 11.2%)
    "--color-primary-foreground": "#F8FAFC", // hsl(210 40% 98%)
    "--color-background": "#FFFFFF", // hsl(0 0% 100%)
    "--color-foreground": "#020817", // hsl(222.2 84% 4.9%)
    "--color-muted": "#F1F5F9", // hsl(210 40% 96.1%)
    "--color-muted-foreground": "#64748B", // hsl(215.4 16.3% 46.9%)
    "--color-border": "#E2E8F0", // hsl(214.3 31.8% 91.4%)
    "--color-talk-listening": "#EF4444", // bright red
    "--color-talk-ai": "#22C55E", // vibrant green
  }),
  dark: vars({
    "--color-primary": "#F8FAFC", // hsl(210 40% 98%)
    "--color-primary-foreground": "#181824", // hsl(222.2 47.4% 11.2%)
    "--color-background": "#020817", // hsl(222.2 84% 4.9%)
    "--color-foreground": "#F8FAFC", // hsl(210 40% 98%)
    "--color-muted": "#1E293B", // hsl(217.2 32.6% 17.5%)
    "--color-muted-foreground": "#94A3B8", // hsl(215 20.2% 65.1%)
    "--color-border": "#1E293B", // hsl(217.2 32.6% 17.5%)
    "--color-talk-listening": "#EF4444", // same bright red
    "--color-talk-ai": "#22C55E", // same vibrant green
  }),
};
