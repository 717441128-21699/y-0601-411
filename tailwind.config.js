/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        rose: {
          gold: {
            50: "#FDF8F3",
            100: "#F9EDE2",
            200: "#F0D5BC",
            300: "#E6B98F",
            400: "#D4A574",
            500: "#C4956A",
            600: "#A87D56",
            700: "#8B6545",
            800: "#6E4E35",
            900: "#4D3624",
          },
        },
        blush: {
          50: "#FFF9F8",
          100: "#F8E2DE",
          200: "#F0C9C3",
          300: "#E4A79E",
          400: "#D68A7E",
          500: "#C26B5D",
        },
        burgundy: {
          50: "#F5E8EA",
          100: "#E9CED3",
          500: "#722F37",
          600: "#5C252C",
          700: "#471C21",
        },
        fog: {
          50: "#F5F7F9",
          100: "#E8EDF1",
          300: "#A8B5C4",
          500: "#6B7C8F",
        },
        ivory: {
          50: "#FFFBF7",
          100: "#FFF5EC",
        },
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "'Playfair Display'", "serif"],
        sans: ["'PingFang SC'", "'HarmonyOS Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(212, 165, 116, 0.15)",
        cardHover: "0 8px 30px -6px rgba(212, 165, 116, 0.25)",
        soft: "0 2px 12px -2px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
