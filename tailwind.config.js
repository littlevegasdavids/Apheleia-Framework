/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte}"],
  theme: {
    screens:{
      "tablet": "700px",
      "browser": "1024px"
    },
    extend: {
      fontFamily:{
        'sans': ['New_Cicle']
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui:{
    themes:[
      {
        mytheme: {
          primary: "#ca9138", 
          secondary: "#2c5569", 
          accent: "#060f16",
          "base-100": "#ffffff"
        }
      }
    ]
  }
}
