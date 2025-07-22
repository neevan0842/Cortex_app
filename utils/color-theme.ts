import { vars } from "nativewind";

export const themes = {
  light: vars({
    "--color-primary": "oklch(0.205 0 0)", // primary
    "--color-primary-foreground": "oklch(0.985 0 0)", // primary-foreground
    "--color-background": "oklch(1 0 0)", // background
    "--color-foreground": "oklch(0.145 0 0)", // foreground
    "--color-muted": "oklch(0.97 0 0)", // muted
    "--color-muted-foreground": "oklch(0.556 0 0)", // muted-foreground
    "--color-border": "oklch(0.922 0 0)", // border
    "--color-talk-listening": "oklch(0.577 0.245 27.325)", // destructive (bright red)
    "--color-talk-ai": "oklch(0.646 0.222 41.116)", // chart-1 (vibrant green)
  }),
  dark: vars({
    "--color-primary": "oklch(0.922 0 0)", // primary
    "--color-primary-foreground": "oklch(0.205 0 0)", // primary-foreground
    "--color-background": "oklch(0.145 0 0)", // background
    "--color-foreground": "oklch(0.985 0 0)", // foreground
    "--color-muted": "oklch(0.269 0 0)", // muted
    "--color-muted-foreground": "oklch(0.708 0 0)", // muted-foreground
    "--color-border": "oklch(1 0 0 / 10%)", // border
    "--color-talk-listening": "oklch(0.704 0.191 22.216)", // destructive (bright red)
    "--color-talk-ai": "oklch(0.488 0.243 264.376)", // chart-1 (vibrant green)
  }),
};
