import type { Config } from "@react-router/dev/config";

export default {
  ssr: true, // Required for prerendering
  prerender: ["/", "/mypage"], // Routes we want to prerender (custom implementation)
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
