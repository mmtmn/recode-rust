/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#0B0F1A",
        mist: "#E9EEF5",
        ember: "#FF6B35",
        ocean: "#2E86AB",
        moss: "#2A9D8F",
        dawn: "#F4D35E",
        cloud: "#F7F9FC"
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 107, 53, 0.25)"
      }
    }
  },
  plugins: []
};
