/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        transparent:
          'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==)',
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.number::-webkit-outer-spin-button, .number::-webkit-inner-spin-button':
          {
            display: 'none',
          },
      });
    },
  ],
};
