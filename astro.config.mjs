import react from "@astrojs/react";

export default {
  integrations: [react()],
  vite: {
    ssr: {
      external: ["react", "react-dom"],
    },
  },
};
