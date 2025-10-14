# Full-Stack Demo Application

> A production-ready showcase of modern web development practices on Cloudflare's edge network

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/react-router-hono-fullstack-template)

## 🎯 Overview

This is a professional demo application showcasing modern full-stack development with edge computing. Built entirely on [Cloudflare Workers](https://workers.cloudflare.com/), it demonstrates server-side rendering, distributed database operations, and real-time user interactions—all running at the edge for maximum performance.

**Live Demo Features:**
- 📝 **Todo List**: Full CRUD operations with Cloudflare KV persistence, optimistic UI updates, and undo functionality
- 🌤️ **Weather Forecast**: Real-time weather data with dynamic city selection and API integration

## ✨ Key Technologies

### Infrastructure
- **Cloudflare Workers** - Edge computing platform
- **Cloudflare KV** - Distributed key-value database
- **Server-Side Rendering (SSR)** - Fast initial page loads

### Frontend
- **React 19** - Latest React with concurrent features
- **React Router v7** (Remix) - File-based routing with SSR support
- **Radix UI** - Accessible, unstyled component primitives
- **Radix Themes** - Beautiful, themeable design system
- **CSS Modules** - Scoped styling without CSS-in-JS overhead

### Backend & API
- **Hono** - Lightweight web framework for Cloudflare Workers
- **REST API** - RESTful endpoints with proper HTTP methods
- **React Router Actions** - Type-safe form handling and mutations
- **Async Toast Notifications** - Non-blocking user feedback
- **KV Import/Export Scripts** - Database management utilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Cloudflare account (for deployment)
- Wrangler CLI (installed automatically with dependencies)

### Installation

```bash
# Install dependencies
npm install

# Generate TypeScript types for Cloudflare Workers
npm run cf-typegen

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
# Development with hot reload
npm run dev

# Preview with Wrangler (local KV)
npm run preview_wrangler_local_preview_kv

# Preview with Wrangler (remote KV)
npm run preview_wrangler_remote_preview_kv

# Type checking
npm run typecheck

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy

# View production logs
npm run logs
```

### Database Management

```bash
# Import todos to KV database
npm run import_kv

# Export todos from KV database
npm run export_kv
```

## 📁 Project Structure

```
├── app/
│   ├── routes/          # React Router routes
│   │   ├── home.tsx     # Landing page
│   │   ├── todos.tsx    # Todo list with KV persistence
│   │   └── weather.tsx  # Weather forecast
│   ├── components/      # Reusable React components
│   ├── context/         # React context providers
│   └── root.tsx         # Root layout component
├── workers/
│   └── app.ts           # Cloudflare Worker entry point
├── scripts/
│   ├── import_kv.js     # KV database import utility
│   └── export_kv.js     # KV database export utility
└── public/              # Static assets
```

## 🏗️ Architecture Highlights

### Edge-First Design
- All rendering happens at Cloudflare's edge locations
- Sub-50ms response times globally
- No cold starts, instant scaling

### Optimistic UI Updates
- Immediate feedback for user actions
- Background synchronization with KV database
- Graceful error handling with rollback

### Type Safety
- End-to-end TypeScript
- React Router type generation
- Cloudflare Workers type definitions

### Performance Optimizations
- CSS purging for minimal bundle size
- Efficient KV operations with batching
- Proper HTTP caching headers

## 🛠️ Configuration

### Environment Variables

Create a `.dev.vars` file for local development:

```env
VALUE_FROM_CLOUDFLARE=your_value_here
```

### Cloudflare KV Setup

The application requires a KV namespace. Configure in `wrangler.jsonc`:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "TODOS_KV",
      "id": "your_kv_namespace_id"
    }
  ]
}
```

## 🎨 Design Philosophy

- **No Tailwind CSS** - Pure CSS Modules for better performance and maintainability
- **Radix UI** - Accessible components without styling opinions
- **CSS Variables** - Consistent theming and dark mode support
- **Semantic HTML** - Proper markup for accessibility and SEO

## 📈 Roadmap

### UI/UX Enhancements
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] Advanced animations

### Performance
- [ ] Server-side caching
- [ ] Client API caching (SWR/TanStack Query)
- [ ] Pagination & infinite scroll

### Architecture
- [ ] Zustand state management
- [ ] Zod schema validation
- [ ] Headless CMS integration

### DevOps
- [ ] Git-based CI/CD pipeline
- [ ] Staging environment
- [ ] Automated testing

## 📚 Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [React Router v7 Docs](https://reactrouter.com/)
- [Hono Documentation](https://hono.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: This is a demo application built to showcase modern web development practices. Feel free to use it as a reference or starting point for your own projects.
