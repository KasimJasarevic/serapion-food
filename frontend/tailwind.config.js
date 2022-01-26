module.exports = {
  mode: "aot",
  purge: {
    enabled: false,
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class",
  theme: {
    extend: {
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
        hero: "url('~/src/assets/images/food-raw.jpg')",
        login: "url('~/src/assets/images/food-raw-10.jpg')",
      },
    },
    fontFamily: {
      "serapion-sans": ["Rubik, sans-serif"],
    },
    animation: {
      "bounce-slow": "bounce 3s linear infinite",
      "spin-slow": "spin 30s linear infinite",
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
