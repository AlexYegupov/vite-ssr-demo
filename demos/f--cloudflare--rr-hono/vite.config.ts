import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import path from "path";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import purgeCSS from "vite-plugin-purgecss";
import purgeCSSv5 from "vite-plugin-purgecss-updated-v5";

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      cssModules: true,
      targets: browserslistToTargets(browserslist(">= 0.25%")),
      drafts: {
        customMedia: true,
        nesting: true,
      },
      minify: true,
      cssVariables: {
        preserve: [
          "--radix-*",
          "--accent-*",
          "--color-*",
          "--background-*",
          "--gray-*",
          "--sky-*",
        ],
      },
    },
    modules: {
      // Generate scoped class names in both dev and prod
      generateScopedName: "[name]__[local]___[hash:base64:5]",
      // Ensure consistent class name generation
      localsConvention: "camelCaseOnly",
    },
    // Enable CSS sourcemaps in development
    devSourcemap: true,
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      experimental: { remoteBindings: true },
    }),
    reactRouter(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        icon: true,
      },
      include: "**/*.svg",
    }),

    purgeCSS({
      safelist: {
        standard: [
          /^.*/, // Preserve all CSS variables
          /^radix-.*/, // Preserve Radix UI classes
          /^:?dark$/, // Preserve dark mode classes
          /^:?light$/, // Preserve light mode classes
          /^\[data-theme=".*"\]$/, // Preserve theme attributes
        ],
        deep: [
          /^.*/, // !!
          /^radix-.*/,
        ], // Deep preserve Radix classes
        variables: [
          /^--.*/, // !!
          /^--radix/, // Preserve Radix variables
          /^--accent-.*$/, // Preserve accent variables
          /^--gray-/, // Preserve gray variables
          /^--color-background-/, // Preserve color-background variable
          /^--sky-/, // Preserve sky variables
          /^--color.*$/, // Preserve color variables
          /^--background.*$/, // Preserve background variables
        ],
      },
      // content: [
      //   "./index.html",
      //   "./app/**/*.{js,jsx,ts,tsx}",
      //   "./workers/**/*.{js,ts}",
      // ],
    }),

    // content: [
    //   "./index.html",
    //   "./app/**/*.{js,jsx,ts,tsx}",
    //   "./workers/**/*.{js,ts}",
    // ],
    //   safelist: {
    //     standard: [
    //       /^--.*/,
    //       /^radix-.*/,
    //       /^:?dark$/,
    //       /^:?light$/,
    //       /^[data-theme=".*"]$/,
    //     ],
    //     deep: [/^radix-.*/],
    //     // variables: [
    //     //   /^--radix/,
    //     //   /^--accent-.*$/,
    //     //   /^--gray-/,
    //     //   /^--sky-/,
    //     //   /^--color.*$/,
    //     // ],
    //   },
    // }),
    // {
    // content: [
    //   "./index.html",
    //   "./app/**/*.{js,jsx,ts,tsx}",
    //   "./workers/**/*.{js,ts}",
    // ],
    // defaultExtractor: (content) => {
    //   // const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
    //   // const innerMatches =
    //   //   content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
    //   // const classMatches = content.match(/className={styles\.(\w+)}/g) || [];

    //   // return [
    //   //   ...broadMatches,
    //   //   ...innerMatches,
    //   //   ...classMatches.map((match) => {
    //   //     return match.replace(/className={styles\.(\w+)}/, "$1");
    //   //   }),
    //   // ];
    //   return ["testclass"];
    // },
    // // safelist: {
    // //   standard: [/^:?\w+-/, /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!cursor-move).+-move$/, /^router-link(|-exact)-active$/],
    // //   deep: [/^modal-/, /^tooltip-/, /^popover-/, /^notification-/]
    // // }
    //   }
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./app") },
      { find: "@public", replacement: path.resolve(__dirname, "./public") },
    ],
  },
  build: {
    cssMinify: "lightningcss",
    cssCodeSplit: true,
    // rollupOptions: {
    //   output: {
    //     manualChunks: (id) => {
    //       if (id.includes("node_modules")) {
    //         return "vendor";
    //       }
    //       if (id.includes("routes/")) {
    //         const fileName = id.split("/").pop()?.split(".")[0];
    //         if (fileName) return `route-${fileName}`;
    //       }
    //     },
    //     chunkFileNames: "assets/[name]-[hash].js",
    //     entryFileNames: "assets/[name]-[hash].js",
    //     assetFileNames: "assets/[name]-[hash][extname]",
    //   },
    // },
    // rollupOptions: {
    //   output: {
    //     manualChunks: (id) => {
    //       // Split Radix UI into its own chunk
    //       if (id.includes("@radix-ui/themes")) {
    //         return "radix-themes";
    //       }
    //       if (id.includes("@radix-ui/react-")) {
    //         return "radix-components";
    //       }
    //       // Split other vendor code
    //       if (id.includes("node_modules")) {
    //         return "vendor";
    //       }
    //       // Split route-specific code
    //       if (id.includes("routes/")) {
    //         const fileName = id.split("/").pop()?.split(".")[0];
    //         if (fileName) return `route-${fileName}`;
    //       }
    //     },
    //     chunkFileNames: "assets/[name]-[hash].js",
    //     entryFileNames: "assets/[name]-[hash].js",
    //     assetFileNames: "assets/[name]-[hash][extname]",
    //   },
    // },
  },
});
