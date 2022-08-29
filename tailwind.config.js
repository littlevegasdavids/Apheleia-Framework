/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte}"],
  theme: {
    screens:{
      "tablet": "700px",
      "browser": "1024px"
    },
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui:{
    themes:['pastel']
  }
}
