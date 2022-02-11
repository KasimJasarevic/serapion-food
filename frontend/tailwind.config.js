module.exports = {
  mode: "aot",
  purge: {
    enabled: true,
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class",
  theme: {
    extend: {
      zIndex: {
        90: "90",
        100: "100",
      },
      colors: {
        "serapion-blue": {
          100: "#def2ff",
          200: "#94c3ff",
          300: "#5a8ed1",
        },
        "serapion-green": "#07e1b8",
        "serapion-yellow": "#dba11c",
        "serapion-purple": "#8182e4",
        "serapion-grey": {
          100: "#a3abbd",
          200: "#3f4756",
        },
        "serapion-white": "#f3faff",
        "serapion-black": {
          100: "#1e2122",
          200: "#14171d",
        },
      },
      backgroundImage: {
        hero: "url('~/src/assets/images/food-raw-3.jpg')",
        login: "url('~/src/assets/images/food-raw-2.jpg')",
      },
      scale: {
        102: "1.02",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
        "spin-slow": "spin 30s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
    fontFamily: {
      "serapion-sans": ["Rubik, sans-serif"],
    },
  },
  variants: {
    extend: {
      backgroundColor: ["responsive", "hover", "focus", "group-focus"],
      ringOpacity: [
        "responsive",
        "dark",
        "focus-within",
        "focus",
        "group-hover",
      ],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
