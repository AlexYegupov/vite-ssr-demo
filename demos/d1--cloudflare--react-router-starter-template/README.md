# Welcome to React Router + Cloudflare Workers!

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/react-router-starter-template)

![React Router Starter Template Preview](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/bfdc2f85-e5c9-4c92-128b-3a6711249800/public)

<!-- dash-content-start -->

A modern, production-ready template for building full-stack React applications using [React Router](https://reactrouter.com/) and the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/).

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/react-router-starter-template
```

A live public deployment of this template is available at [https://react-router-starter-template.templates.workers.dev](https://react-router-starter-template.templates.workers.dev)

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Typegen

Generate types for your Cloudflare bindings in `wrangler.json`:

```sh
npm run typegen
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

If you don't have a Cloudflare account, [create one here](https://dash.cloudflare.com/sign-up)! Go to your [Workers dashboard](https://dash.cloudflare.com/?to=%2F%3Aaccount%2Fworkers-and-pages) to see your [free custom Cloudflare Workers subdomain](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) on `*.workers.dev`.

Once that's done, you can build your app:

```sh
npm run build
```

And deploy it:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Sourcemaps

This project provides two environment variables to control sourcemaps:

### 1. Controlling Sourcemap Generation

By default, sourcemaps are **not generated** in production builds to reduce bundle size. They are always generated in development mode regardless of settings.

To enable sourcemap generation in production builds, set the `SOURCEMAPS_GENERATE_PROD` environment variable to `"true"` before building:

```sh
# For local builds
SOURCEMAPS_GENERATE_PROD=true npm run build

# For Cloudflare deployments
wrangler secret put SOURCEMAPS_GENERATE_PROD --value "true"
```

### 2. Controlling Sourcemap Access

Even when sourcemaps are generated, they are not accessible in production by default for security reasons. To enable access to existing sourcemaps (e.g., for debugging), set the `SOURCEMAPS_ACCESS_PROD` environment variable to `"true"`:

```sh
wrangler secret put SOURCEMAPS_ACCESS_PROD --value "true"
```

This will allow access to `.map` files in your production environment. Remember to disable access again after debugging:

```sh
wrangler secret delete SOURCEMAPS_ACCESS_PROD
```

### Recommended Configurations

- **Development**: Sourcemaps are always generated and accessible
- **Production (default)**: Sourcemaps are not generated and not accessible
- **Production debugging**: Enable both generation and access during build/deploy

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
