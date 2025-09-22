import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // n8n-specific colors
        'n8n': {
          primary: "hsl(var(--n8n-primary))",
          'primary-foreground': "hsl(var(--n8n-primary-foreground))",
          canvas: "hsl(var(--n8n-canvas))",
          'canvas-foreground': "hsl(var(--n8n-canvas-foreground))",
          sidebar: "hsl(var(--n8n-sidebar))",
          'sidebar-foreground': "hsl(var(--n8n-sidebar-foreground))",
          header: "hsl(var(--n8n-header))",
          'node-bg': "hsl(var(--n8n-node-bg))",
          'node-border': "hsl(var(--n8n-node-border))",
          success: "hsl(var(--n8n-success))",
          warning: "hsl(var(--n8n-warning))",
          error: "hsl(var(--n8n-error))",
        },
        // Workflow colors
        workflow: {
          bg: "hsl(var(--workflow-bg))",
          grid: "hsl(var(--workflow-grid))",
          node: "hsl(var(--workflow-node))",
          'node-active': "hsl(var(--workflow-node-active))",
          connection: "hsl(var(--workflow-connection))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
