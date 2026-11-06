import { heroui } from "@heroui/theme";

export default heroui({
  themes: {
    dark: {
      extend: "dark",
      colors: {
        background: {
          DEFAULT: "#13151b",
        },
        foreground: {
          DEFAULT: "#f1f3f7",
        },
        content1: {
          DEFAULT: "#1a1d26",
          foreground: "#f1f3f7",
        },
        content2: {
          DEFAULT: "#222632",
          foreground: "#f1f3f7",
        },
        content3: {
          DEFAULT: "#2b303f",
          foreground: "#f1f3f7",
        },
        default: {
          50: "#181a22",
          100: "#222632",
          200: "#2d3342",
          300: "#394154",
          400: "#5a6479",
          500: "#8692a8",
          600: "#adb8cb",
          700: "#cfd6e2",
          800: "#e6eaf1",
          900: "#f5f6f9",
          DEFAULT: "#2d3342",
          foreground: "#f1f3f7",
        },
        divider: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
});
