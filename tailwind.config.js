
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maramesa: {
          primary: '#0033A0',     // fondo principal
          light: '#009EFF',       // botones o efectos de foco
          dark: '#001E4C',        // encabezados o navbar
          text: '#FFFFFF'         // texto claro sobre fondo oscuro
        }
      }
    }
  },

  plugins: [],
}
