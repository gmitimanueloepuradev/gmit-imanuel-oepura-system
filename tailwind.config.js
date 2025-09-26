/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color definitions using CSS variables
        primary: {
          50: 'rgb(from var(--color-primary) r g b / 0.05)',
          100: 'rgb(from var(--color-primary) r g b / 0.1)',
          200: 'rgb(from var(--color-primary) r g b / 0.2)',
          300: 'rgb(from var(--color-primary) r g b / 0.3)',
          400: 'rgb(from var(--color-primary) r g b / 0.4)',
          500: 'var(--color-primary)',
          600: 'rgb(from var(--color-primary) r g b / 0.8)',
          700: 'rgb(from var(--color-primary) r g b / 0.7)',
          800: 'rgb(from var(--color-primary) r g b / 0.6)',
          900: 'rgb(from var(--color-primary) r g b / 0.5)',
          950: 'rgb(from var(--color-primary) r g b / 0.4)',
        },
        secondary: {
          50: 'rgb(from var(--color-secondary) r g b / 0.05)',
          100: 'rgb(from var(--color-secondary) r g b / 0.1)',
          200: 'rgb(from var(--color-secondary) r g b / 0.2)',
          300: 'rgb(from var(--color-secondary) r g b / 0.3)',
          400: 'rgb(from var(--color-secondary) r g b / 0.4)',
          500: 'var(--color-secondary)',
          600: 'rgb(from var(--color-secondary) r g b / 0.8)',
          700: 'rgb(from var(--color-secondary) r g b / 0.7)',
          800: 'rgb(from var(--color-secondary) r g b / 0.6)',
          900: 'rgb(from var(--color-secondary) r g b / 0.5)',
          950: 'rgb(from var(--color-secondary) r g b / 0.4)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
      },
      backgroundColor: {
        'surface': 'var(--color-surface)',
        'surface-variant': 'var(--color-surface-variant)',
      },
      textColor: {
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
      },
      borderColor: {
        'outline': 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};