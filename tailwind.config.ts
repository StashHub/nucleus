import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "var(--purple)",
          100: "var(--purple-100)",
          200: "var(--purple-200)",
          300: "var(--purple-300)",
          400: "var(--purple-400)",
          600: "var(--purple-600)",
        },
        backgroundMain: "var(--background-main)",
        primaryText: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        neutral: {
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
        },
        negative: {
          100: "var(--negative-100)",
          200: "var(--negative-200)",
          600: "var(--negative-600)",
        },
        success: {
          50: "var(--success-50)",
          100: "var(--success-100)",
          300: "var(--success-300)",
          600: "var(--success-600)",
          700: "var(--success-700)",
          800: "var(--success-800)",
          900: "var(--success-900)",
        },
        notice: {
          50: "var(--notice-50)",
          100: "var(--notice-100)",
          300: "var(--notice-300)",
          600: "var(--notice-600)",
        },
        info: {
          DEFAULT: "var(--info-500)",
          50: "var(--info-50)",
          100: "var(--info-100)",
          300: "var(--info-300)",
          500: "var(--info-500)",
          600: "var(--info-600)",
          700: "var(--info-700)",
          800: "var(--info-800)",
        },
      },
      screens: {
        mbl: "374px",
        sm: "480px",
        md: "768px",
        tbl: "1024px",
        xl: "1240px",
        xxl: "1440px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        checkmark: "url(/assets/checkmark.svg)",
      },
      variants: {
        fill: ["hover", "focus"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
