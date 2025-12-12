// API Configuration
// const API_URL = "http://localhost:3000" // Local dev
// const API_URL = "https://etuition-dev.vercel.app" // Staging
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default API_URL;
