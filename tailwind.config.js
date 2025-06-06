/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        //sans: ["DM Sans", "sans-serif"], // Default modern font
        lexend: ["Lexend", "sans-serif"], // Lexend Font
        inter: ["Inter", "sans-serif"], // Inter Font
        poppins: ["Poppins", "sans-serif"], // Poppins Font
        roboto: ["Roboto", "sans-serif"], //Roboto Font
        dmsans: ["DM Sans", "sans-serif"], // DM Sans Font
        bebas: ["Bebas Neue", "sans-serif"], // Bebas Neue Font
      },
    },
  },
  plugins: [],
};
