/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'aurora-slow': 'aurora 20s ease infinite',
        'bg-slide': 'bgSlide 10s ease infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'fade-in': 'fadeIn 1s ease-in-out',
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
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
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backgroundSize: {
        '300': '300% 300%',
      },
      colors: {
        primary: "#cca772",
        secondary: "#ff8901",
        third: "black",
        'primary-dark': '#732d91',
        bg_Navbg: '',
        font_footer: "#faf5f580",
      },
      fontFamily: {
        cursive: ['"Great Vibes"', 'cursive'],
        raleway: ['Raleway', 'sans-serif'],
        luxury: ['"Playfair Display"', 'serif'],
      },
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
}
