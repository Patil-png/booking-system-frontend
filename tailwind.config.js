/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ Responsive breakpoints
      screens: {
        'hideCalendarBelow': { 'max': '704px' },
        'hideBookingSectionBelow': { 'max': '699px' },
      },

      // ✅ Colors (merged)
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
        'primary-dark': '#0f0e17',       // Very dark almost black for main background
        'secondary-dark': '#232946',     // Dark blue-purple for section backgrounds/tiles
        'accent-gold': '#ff8906',        // Vibrant, modern orange-gold for primary accents
        'text-light': '#fffffe',         // Bright off-white for main text
        'text-muted': '#a7a9be',         // Softer gray-blue for secondary text
        'danger-red': '#e53170',         // A pop of magenta-red for attention/buttons
        'overlay-dark': 'rgba(15, 14, 23, 0.85)', // Darker overlay for hero
        'overlay-gradient-start': 'rgba(15, 14, 23, 0.95)', // Stronger gradient start
        'overlay-gradient-end': 'rgba(15, 14, 23, 0.4)',   // Softer gradient end
  
      },

      // ✅ Fonts (merged)
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        raleway: ['Raleway', 'sans-serif'],
        luxury: ['"Playfair Display"', 'serif'],
        heading: ['"Montserrat"', 'sans-serif'], // Modern, bold sans-serif for headings
        body: ['"Open Sans"', 'sans-serif'],     // Clean, readable sans-serif for body
        display: ['"Playfair Display"', 'serif'], 
      },

      // ✅ Box shadows
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.7)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.4)', // Softer, more modern shadow
        'soft-xl': '0 20px 40px rgba(0, 0, 0, 0.6)', // Larger, more pronounced shadow
        'button-gold': '0 0 25px rgba(255, 137, 6, 0.6)',
        'button-red': '0 0 25px rgba(229, 49, 112, 0.6)',
      },

      // ✅ Keyframes (merged without duplicates)
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
      },

      // ✅ Animations (merged)
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
      },

      // ✅ Background sizing
      backgroundSize: {
        '300': '300% 300%',
      },

      // ✅ Container config
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '2rem',
          xl: '4rem',
          '2xl': '5rem',
        },
      },
    },
  },
  plugins: [],
};

