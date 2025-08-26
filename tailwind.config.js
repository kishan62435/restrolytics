/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--color-background))",
          foreground: "hsl(var(--color-foreground))",
          navbar: {
            DEFAULT: "hsl(var(--color-navbar))",
            foreground: "hsl(var(--color-navbar-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--color-card))",
            foreground: "hsl(var(--color-card-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--color-popover))",
            foreground: "hsl(var(--color-popover-foreground))",
          },
          primary: {
            DEFAULT: "hsl(var(--color-primary))",
            foreground: "hsl(var(--color-primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--color-secondary))",
            foreground: "hsl(var(--color-secondary-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--color-muted))",
            foreground: "hsl(var(--color-muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--color-accent))",
            foreground: "hsl(var(--color-accent-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--color-destructive))",
            foreground: "hsl(var(--color-destructive-foreground))",
          },
          border: "hsl(var(--color-border))",
          input: "hsl(var(--color-input))",
          ring: "hsl(var(--color-ring))",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 2px)",
        },
      },
    },
    plugins: [],
  };