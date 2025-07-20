import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: ["class", "class"],
  lightMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand colors - Black & Gold theme
        primary: "#dfdf1e", // golden yellow
        surface: "#1a1a1a", // grainy charcoal surface
        background: "#0d0d0d", // deeper black background
        foreground: "#ffffff", // white text on dark
        accent: "#dfdf1e", // same as primary
        muted: "#3a3a39", // dark gray for subtle elements

        // Legacy color names maintained for compatibility
        greenNeon: "#dfdf1e", // Updated to gold
        blueNew: "#dfdf1e", // Updated to gold
        blackBg: "#1a1a1a", // Updated to surface color
        secondaryBg: "#2a2a28", // Dark gray for secondary backgrounds
        secondary: "#2a2a2a", // Surface2 gray

        // Status colors
        success: "#10b981",
        warning: "#ef4444",
        error: "#ef4444",
        confirmation: "#34D399",

        // Form and UI elements
        inputColor: "#2a2a28",
        input: "#2a2a28",
        dropdown: "#2a2a28",
        switch: "#3a3a39",
        toggle: "#3a3a39",
        modal: "#1a1a1a",
        tbbg: "#0a0a0a",
        bor: "#232323",

        // Sidebar system
        sidebar: {
          DEFAULT: "#1a1a1a", // Use surface color
          foreground: "#ffffff",
          primary: "#dfdf1e",
          "primary-foreground": "#0d0d0d", // Use background color
          accent: "#dfdf1e",
          "accent-foreground": "#0d0d0d", // Use background color
          border: "#3a3a39",
          ring: "#dfdf1e",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        karla: "var(--font-karla)",
        figtree: "var(--font-figtree)",
        libre: "var(--font-libre)",
        tenor: "var(--font-tenor)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ addComponents, theme }: any) {
      const colors = theme("colors");

      const buttons = {
        ".btn": {
          padding: ".8rem 1rem",
          borderRadius: ".375rem",
          fontWeight: "600",
          fontSize: "0.855rem",
          transition: "background-color 0.3s ease, opacity 0.3s ease",
          "&.btn-primary": {
            backgroundColor: colors.primary,
            color: colors.surface,
            "&:hover": {
              opacity: 0.8,
            },
          },
          "&.btn-secondary": {
            backgroundColor: colors.secondary,
            color: colors.foreground,
            "&:hover": {
              opacity: 0.8,
            },
          },
          "&.btn-warning": {
            backgroundColor: colors.warning,
            color: colors.foreground,
            "&:hover": {
              opacity: 0.8,
            },
          },
          "&.btn-confirmation": {
            backgroundColor: colors.confirmation,
            color: colors.surface,
            "&:hover": {
              opacity: 0.8,
            },
          },
          "&.btn-outlined": {
            backgroundColor: "transparent",
            border: `1px solid ${colors.primary}`,
            color: colors.primary,
            "&:hover": {
              backgroundColor: colors.primary,
              color: colors.surface,
            },
          },
          "&.btn-outlined-warning": {
            backgroundColor: "transparent",
            border: `1px solid ${colors.warning}`,
            color: colors.warning,
            "&:hover": {
              backgroundColor: colors.warning,
              color: colors.foreground,
            },
          },
          "&.btn-outlined-secondary": {
            backgroundColor: "transparent",
            border: `1px solid ${colors.secondary}`,
            color: colors.foreground,
            "&:hover": {
              backgroundColor: colors.secondary,
              color: colors.foreground,
            },
          },
          "&.btn-outlined-confirmation": {
            backgroundColor: "transparent",
            border: `1px solid ${colors.confirmation}`,
            color: colors.confirmation,
            "&:hover": {
              backgroundColor: colors.confirmation,
              color: colors.surface,
            },
          },
        },
      };

      const inputs = {
        ".input": {
          padding: ".4rem .5rem",
          borderRadius: ".375rem",
          border: "1px solid #3a3a39",
          backgroundColor: colors.input,
          fontSize: ".875rem",
          width: "100%",
          outline: "none",
          display: "block",
          color: colors.foreground,
          "&::placeholder": {
            color: "#6b6b6a",
            opacity: "1",
            transition: "color 0.3s ease",
          },
          "&:focus::placeholder": {
            color: "#8a8a89",
          },
          "&:focus": {
            outline: "none",
            borderColor: colors.primary,
          },
          "&.input-primary": {
            backgroundColor: colors.input,
            borderColor: "#3a3a39",
            "&:focus": {
              backgroundColor: colors.input,
              borderColor: colors.primary,
            },
            "&:disabled": {
              backgroundColor: colors.input,
              opacity: "0.4",
              borderColor: "#3a3a39",
            },
            "&::placeholder": {
              color: "#6b6b6a",
              opacity: "0.8",
              transition: "color 0.3s ease",
            },
          },
          "&.input-secondary": {
            backgroundColor: colors.secondary,
            "&:focus": {
              backgroundColor: colors.secondary,
              borderColor: colors.primary,
            },
          },
          "&.input-warning": {
            backgroundColor: colors.input,
            borderColor: colors.warning,
            "&:focus": {
              backgroundColor: colors.input,
              borderColor: colors.warning,
            },
          },
        },
      };

      const textareas = {
        ".textarea": {
          padding: ".4rem .5rem",
          borderRadius: ".375rem",
          border: "1px solid #3a3a39",
          backgroundColor: colors.input,
          fontSize: ".875rem",
          width: "100%",
          outline: "none",
          display: "block",
          color: colors.foreground,
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: "1.5",
          minHeight: "2.5rem",
          "&::placeholder": {
            color: "#6b6b6a",
            opacity: "1",
            transition: "color 0.3s ease",
          },
          "&:focus::placeholder": {
            color: "#8a8a89",
          },
          "&:focus": {
            outline: "none",
            borderColor: colors.primary,
          },
          "&.textarea-primary": {
            backgroundColor: colors.input,
            borderColor: "#3a3a39",
            "&:focus": {
              backgroundColor: colors.input,
              borderColor: colors.primary,
            },
            "&:disabled": {
              backgroundColor: colors.input,
              opacity: "0.4",
              borderColor: "#3a3a39",
            },
            "&::placeholder": {
              color: "#6b6b6a",
              opacity: "0.8",
              transition: "color 0.3s ease",
            },
          },
          "&.textarea-secondary": {
            backgroundColor: colors.secondary,
            "&:focus": {
              backgroundColor: colors.secondary,
              borderColor: colors.primary,
            },
          },
          "&.textarea-warning": {
            backgroundColor: colors.input,
            borderColor: colors.warning,
            "&:focus": {
              backgroundColor: colors.input,
              borderColor: colors.warning,
            },
          },
        },
      };

      const switches = {
        ".switch": {
          minWidth: "2.1rem",
          width: "2.1rem",
          height: "1.1rem",
          borderRadius: "9999px",
          backgroundColor: "#3a3a39",
          position: "relative",
          transition: "background-color 0.3s ease",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#3a3a39",
          borderWidth: "1px",
          borderStyle: "solid",
          "&.switch-primary": {
            backgroundColor: "#3a3a39",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "0.125rem",
            left: "0.125rem",
            width: "0.75rem",
            height: "0.75rem",
            borderRadius: "9999px",
            backgroundColor: colors.foreground,
            transition: "transform 0.2s ease-in-out",
          },
          "&.checked": {
            backgroundColor: colors.primary,
          },
          "&.checked::after": {
            transform: "translateX(1rem)",
            backgroundColor: colors.surface,
          },
        },
      };

      const checkboxes = {
        ".checkbox": {
          width: "1rem",
          height: "1rem",
          borderRadius: ".25rem",
          border: "1px solid",
          transition: "background-color 0.3s ease",
          "&.checkbox-primary": {
            borderColor: colors.primary,
            "&:checked": {
              backgroundColor: colors.primary,
            },
          },
          "&.checkbox-warning": {
            borderColor: colors.warning,
            "&:checked": {
              backgroundColor: colors.warning,
            },
          },
          "&.checkbox-confirmation": {
            borderColor: colors.confirmation,
            "&:checked": {
              backgroundColor: colors.confirmation,
            },
          },
        },
      };

      addComponents(buttons);
      addComponents(inputs);
      addComponents(switches);
      addComponents(checkboxes);
      addComponents(textareas);
    },
  ],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
