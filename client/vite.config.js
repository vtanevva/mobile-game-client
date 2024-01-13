import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  define: {
    'process.env.VITE_REACT_APP_API_URL': process.env.VITE_REACT_APP_API_URL,
    'process.env.VITE_REACT_APP_AUTH_TOKEN': process.env.VITE_REACT_APP_AUTH_TOKEN,
  },
};
