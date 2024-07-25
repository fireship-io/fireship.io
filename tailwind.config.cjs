const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html", "./app/**/*.svelte",
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["sofia-pro", "sans-serif"],
      display: ["cubano", "sans-serif"],
      body: ["sofia-pro", "sans-serif"],
      code: ["attribute-mono", "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",

      gray1: "#f8f8f8",
      gray2: "#dbe1e8",
      gray3: "#b2becd",
      gray4: "#6c7983",
      gray5: "#454e56",
      gray6: "#2a2e35",
      gray7: "#12181b",
      eirbyellow: "#FFE428",
      yellow1: "#fce41c",
      yellow2: "#f8ed86",
      link: "#0000ee",
      blue: colors.blue,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      orange: colors.orange,
      red: colors.red,
      yellow: colors.yellow,
    },
    extend: {
      boxShadow: {
        "3xl": "0 5px 20px rgb(0 0 0 / 30%)",
        "4xl": "0 5px 20px rgb(0 0 0 / 90%)",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              "font-weight": "normal",
              "font-size": "2.5rem",
            },
            h2: {
              "font-weight": "normal",
              "font-size": "2rem",
            },
            h3: {
              "font-weight": "normal",
              "font-size": "1.75rem",
            },
            h4: {
              "font-weight": "normal",
              "font-size": "1.5rem",
            },
            h5: {
              "font-weight": "normal",
              "font-size": "1.25rem",
            },
          },
        },
      },
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("flowbite/plugin")
  ],
};
