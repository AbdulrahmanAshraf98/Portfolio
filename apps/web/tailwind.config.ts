import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "sans-serif"],
        signature: ["var(--font-signature)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
