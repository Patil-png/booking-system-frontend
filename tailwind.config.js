/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '2rem',
        xl: '4rem',
        '2xl': '5rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      hideCalendarBelow: { max: '704px' },
      hideBookingSectionBelow: { max: '699px' },
    },
    extend: {
      colors: {
        primary: "#cca772",
        secondary: "#ff8901",
        third: "black",
        'secondary-gold': '#d4af37',
        'accent-red': '#8b0000',
        'bg-tile-dark': '#2e2e4a',
        'hero-overlay-start': 'rgba(26, 26, 46, 0.9)',
        'hero-overlay-end': 'rgba(26, 26, 46, 0.4)',
        font_footer: "#faf5f580",
        bg_Navbg: '',
        'primary-dark': '#0f0e17',
        'secondary-dark': '#232946',
        'accent-gold': '#ff8906',
        'text-light': '#fffffe',
        'text-muted': '#a7a9be',
        'danger-red': '#e53170',
        'overlay-dark': 'rgba(15, 14, 23, 0.85)',
        'overlay-gradient-start': 'rgba(15, 14, 23, 0.95)',
        'overlay-gradient-end': 'rgba(15, 14, 23, 0.4)',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        raleway: ['Raleway', 'sans-serif'],
        luxury: ['"Playfair Display"', 'serif'],
        heading: ['"Montserrat"', 'sans-serif'],
        body: ['"Open Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.7)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.4)',
        'soft-xl': '0 20px 40px rgba(0, 0, 0, 0.6)',
        'button-gold': '0 0 25px rgba(255, 137, 6, 0.6)',
        'button-red': '0 0 25px rgba(229, 49, 112, 0.6)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundSize: {
        '300': '300% 300%',
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { width: '6rem', opacity: '0.7' },
          '50%': { width: '8rem', opacity: '1' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '25%': { transform: 'translateY(0)', opacity: '1' },
          '75%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        bgSlide: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'line-expand': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'subtle-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        pulseLine: 'pulseLine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scrollDown: 'scrollDown 2s infinite',
        bounceSlow: 'bounceSlow 3s infinite ease-in-out',
        auroraSlow: 'aurora 20s ease infinite',
        bgSlide: 'bgSlide 10s ease infinite',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        fadeIn: 'fadeIn 1s ease-in-out',
        'fade-in': 'fade-in 1s ease-out forwards',
        'scale-in': 'scale-in 0.8s ease-out forwards',
        'line-expand': 'line-expand 0.6s ease-out forwards',
        'subtle-pulse': 'subtle-pulse 3s infinite ease-in-out',
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

// /** @type {import('tailwindcss').Config} */
// const plugin = require("tailwindcss/plugin");

// module.exports = {
//   darkMode: ["class"],
//   content: [
//     "./index.html",
//     "./pages/**/*.{js,jsx}",
//     "./components/**/*.{js,jsx}",
//     "./app/**/*.{js,jsx}",
//     "./src/**/*.{js,jsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: {
//         DEFAULT: '1rem',
//         sm: '2rem',
//         lg: '2rem',
//         xl: '4rem',
//         '2xl': '5rem',
//       },
//       screens: {
//         '2xl': '1400px',
//       },
//     },
//     screens: {
//       xs: '320px',
//       sm: '640px',
//       md: '768px',
//       lg: '1024px',
//       xl: '1280px',
//       '2xl': '1536px',
//       hideCalendarBelow: { max: '704px' },
//       hideBookingSectionBelow: { max: '699px' },
//     },
//     extend: {
//       colors: {
//         primary: "#cca772",
//         secondary: "#ff8901",
//         third: "black",
//         'secondary-gold': '#d4af37',
//         'accent-red': '#8b0000',
//         'bg-tile-dark': '#2e2e4a',
//         'hero-overlay-start': 'rgba(26, 26, 46, 0.9)',
//         'hero-overlay-end': 'rgba(26, 26, 46, 0.4)',
//         font_footer: "#faf5f580",
//         bg_Navbg: '',
//         'primary-dark': '#0f0e17',
//         'secondary-dark': '#232946',
//         'accent-gold': '#ff8906',
//         'text-light': '#fffffe',
//         'text-muted': '#a7a9be',
//         'danger-red': '#e53170',
//         'overlay-dark': 'rgba(15, 14, 23, 0.85)',
//         'overlay-gradient-start': 'rgba(15, 14, 23, 0.95)',
//         'overlay-gradient-end': 'rgba(15, 14, 23, 0.4)',

//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         primary: {
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))',
//         },
//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//         sidebar: {
//           DEFAULT: 'hsl(var(--sidebar-background))',
//           foreground: 'hsl(var(--sidebar-foreground))',
//           primary: 'hsl(var(--sidebar-primary))',
//           'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
//           accent: 'hsl(var(--sidebar-accent))',
//           'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
//           border: 'hsl(var(--sidebar-border))',
//           ring: 'hsl(var(--sidebar-ring))',
//         },
//       },
//       fontFamily: {
//         serif: ['"Playfair Display"', 'serif'],
//         sans: ['Inter', 'sans-serif'],
//         cursive: ['"Great Vibes"', 'cursive'],
//         raleway: ['Raleway', 'sans-serif'],
//         luxury: ['"Playfair Display"', 'serif'],
//         heading: ['"Montserrat"', 'sans-serif'],
//         body: ['"Open Sans"', 'sans-serif'],
//         display: ['"Playfair Display"', 'serif'],
//       },
//       boxShadow: {
//         '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.7)',
//         'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.4)',
//         'soft-xl': '0 20px 40px rgba(0, 0, 0, 0.6)',
//         'button-gold': '0 0 25px rgba(255, 137, 6, 0.6)',
//         'button-red': '0 0 25px rgba(229, 49, 112, 0.6)',
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       backgroundSize: {
//         '300': '300% 300%',
//       },
//       keyframes: {
//         pulseLine: {
//           '0%, 100%': { width: '6rem', opacity: '0.7' },
//           '50%': { width: '8rem', opacity: '1' },
//         },
//         scrollDown: {
//           '0%': { transform: 'translateY(-10px)', opacity: '0' },
//           '25%': { transform: 'translateY(0)', opacity: '1' },
//           '75%': { transform: 'translateY(0)', opacity: '1' },
//           '100%': { transform: 'translateY(10px)', opacity: '0' },
//         },
//         bounceSlow: {
//           '0%, 100%': { transform: 'translateY(-5%)' },
//           '50%': { transform: 'translateY(0)' },
//         },
//         aurora: {
//           '0%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//           '100%': { backgroundPosition: '0% 50%' },
//         },
//         bgSlide: {
//           '0%, 100%': { backgroundPosition: '0% 50%' },
//           '50%': { backgroundPosition: '100% 50%' },
//         },
//         slideInLeft: {
//           '0%': { transform: 'translateX(-100%)', opacity: 0 },
//           '100%': { transform: 'translateX(0)', opacity: 1 },
//         },
//         'fade-in-up': {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         'fade-in': {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         'scale-in': {
//           '0%': { transform: 'scale(0.9)', opacity: '0' },
//           '100%': { transform: 'scale(1)', opacity: '1' },
//         },
//         'line-expand': {
//           '0%': { width: '0' },
//           '100%': { width: '100%' },
//         },
//         'subtle-pulse': {
//           '0%, 100%': { transform: 'scale(1)', opacity: '1' },
//           '50%': { transform: 'scale(1.02)', opacity: '0.9' },
//         },
//         'accordion-down': {
//           from: { height: '0' },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: '0' },
//         },
//       },
//       animation: {
//         pulseLine: 'pulseLine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         scrollDown: 'scrollDown 2s infinite',
//         bounceSlow: 'bounceSlow 3s infinite ease-in-out',
//         auroraSlow: 'aurora 20s ease infinite',
//         bgSlide: 'bgSlide 10s ease infinite',
//         slideInLeft: 'slideInLeft 0.5s ease-out',
//         fadeIn: 'fadeIn 1s ease-in-out',
//         'fade-in': 'fade-in 1s ease-out forwards',
//         'scale-in': 'scale-in 0.8s ease-out forwards',
//         'line-expand': 'line-expand 0.6s ease-out forwards',
//         'subtle-pulse': 'subtle-pulse 3s infinite ease-in-out',
//         'fade-in-up': 'fade-in-up 1s ease-out forwards',
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [
//     require("tailwindcss-animate"),
//   ],
// };


