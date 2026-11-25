export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { paper: "#F7FAF8", ink: "#14211B", pine: "#1F5B45", marigold: "#F2B705", line: "#D9E2DC" },
      fontFamily: { sans: ['"Bricolage Grotesque"', "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
