module.exports = {
  mode: "aot",
  purge: ["./src/**/*.{ts,html}"],
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
      },
    },
    fontFamily: {
      "serapion-sans": ["Rubik, sans-serif"],
    },
  },
  variants: {
    extend: {
      backgroundColor: ["responsive", "hover", "focus", "group-focus"],
    },
  },
  plugins: [],
};
