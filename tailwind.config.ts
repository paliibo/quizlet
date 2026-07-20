import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "flip-in": "flip-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 7s ease-in-out infinite",
        "pop-in": "pop-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        shimmer: "shimmer 1.6s linear infinite",
        "slide-up": "slide-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 4px)",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--ring) / 0.25), 0 12px 40px -12px hsl(var(--primary) / 0.55)",
        raised: "0 1px 2px hsl(var(--shadow) / 0.08), 0 12px 32px -12px hsl(var(--shadow) / 0.28)",
        sunken: "inset 0 1px 2px hsl(var(--shadow) / 0.12)",
      },
      colors: {
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        background: "hsl(var(--background))",
        border: "hsl(var(--border))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        danger: { DEFAULT: "hsl(var(--danger))", foreground: "hsl(var(--danger-foreground))" },
        foreground: "hsl(var(--foreground))",
        input: "hsl(var(--input))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        ring: "hsl(var(--ring))",
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
        surface: { DEFAULT: "hsl(var(--surface))", foreground: "hsl(var(--surface-foreground))" },
        warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "flip-in": {
          from: { opacity: "0", transform: "rotateX(-35deg)" },
          to: { opacity: "1", transform: "rotateX(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "scale(0.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
};

export default config;
