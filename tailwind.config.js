const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    height: (theme) => ({
      auto: "auto",
      ...theme("spacing"),
      full: "100%",
      screen: "calc(var(--vh) * 100)",
    }),
    minHeight: (theme) => ({
      0: "0",
      ...theme("spacing"),
      full: "100%",
      screen: "calc(var(--vh) * 100)",
    }),

    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            img: { borderRadius: "0.5rem" },
          },
        },
      }),

      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-garamond)", ...defaultTheme.fontFamily.serif],
        brand: ["var(--font-garamond)", ...defaultTheme.fontFamily.serif],
        accent: ["var(--font-flood)", ...defaultTheme.fontFamily.sans],
        subheading: ["var(--font-aileron)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "tfm-primary": {
          200: "#99a7b4",
          300: "#6678af",
          400: "#334e69",
          500: "#2c3639",
          900: "#2b2c2f",
        },
        "tfm-secondary": {
          200: "#e5c1b5",
          300: "#d9a391",
          400: "#cc846c",
          500: "#BF6547",
          900: "#995139",
        },
        tfm: {
          primary: "#2c3639",
          secondary: "#a75c32",
          sand: "#3f4e4f",
          yellow: "#966844",
          gray: "#dcd7c9",
          bg: "#f6f5f1",
        },
        "warm-gray": colors.stone,
        teal: colors.teal,
        cyan: colors.cyan,
        amber: colors.amber,
        rose: colors.rose,
      },
      height: {
        100: "32rem",
        108: "36rem",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
