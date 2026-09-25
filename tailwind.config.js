/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gourmet: {
          bg: '#FAF6F0',
          surface: '#F4EFE6',
          surfaceHover: '#EBE3D5',
          card: '#FFFFFF',
          border: '#E8DFC8',
          borderStrong: '#D6C8B5',
          primary: '#781D22',
          primaryHover: '#5F161A',
          primaryLight: '#FCEFEF',
          gold: '#E5A83B',
          goldLight: '#FEF6E8',
          olive: '#3B5323',
          oliveLight: '#F2F6EC',
          mustard: '#C27803',
          mustardLight: '#FEF6E8',
          dark: '#1C1917',
          darkMuted: '#44403C',
          muted: '#78716C',
          lightMuted: '#A8A29E',
          whatsapp: '#25D366',
          whatsappDark: '#128C7E',
          whatsappHover: '#1EBE5D'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gourmet-sm': '0 2px 8px -2px rgba(120, 29, 34, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'gourmet-md': '0 6px 16px -4px rgba(120, 29, 34, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
        'gourmet-lg': '0 12px 30px -6px rgba(120, 29, 34, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'gourmet-floating': '0 20px 40px -10px rgba(120, 29, 34, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
