/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./main.jsx",
        "./prelude.jsx",
        "./src/components/LanguageSelector.jsx",
        "./components/MinaDirective.jsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
