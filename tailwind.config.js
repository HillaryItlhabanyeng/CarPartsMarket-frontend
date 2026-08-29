/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Beige / white palette for CarPartMarket
        cream: '#FAF7F2',      // page background
        beige: '#E8DFD1',      // panels, cards
        'beige-dark': '#D6C7AE', // borders, dividers
        clay: '#A97C50',       // primary accent (buttons, links)
        'clay-dark': '#8A6440', // hover state
        ink: '#2B2620',        // primary text
        'ink-soft': '#6B6259', // secondary text
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '0.5rem',
      },
    },
  },
  plugins: [],
}
