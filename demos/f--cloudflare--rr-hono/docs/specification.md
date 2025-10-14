# Project Specification

## Overview

React Router demo application showcasing client-side routing with multiple pages and global tab navigation. Built with React Router 7, deployed on Cloudflare Workers with SSR support. Features a persistent navigation bar with tabs that appears on all pages for seamless navigation between sections.

## Entities

### Route

#### path
String representing the URL path for the route

#### component
React component to render for this route

#### meta
Metadata for the route including title and description

## Pages

### Home

Main landing page with overview cards for navigating to different sections.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todo List     Weather                                            │
│  ════                                                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                          Welcome to the App                                │
│                                                                            │
│          Use the navigation tabs above to explore different sections       │
│                                                                            │
│     ┌─────────────────────────┐    ┌─────────────────────────┐           │
│     │  📝 Todo List            │    │  🌤️ Weather             │           │
│     │                          │    │                          │           │
│     │  Manage your daily tasks │    │  Check weather forecasts │           │
│     │  and stay organized      │    │  for cities worldwide    │           │
│     └─────────────────────────┘    └─────────────────────────┘           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### My Page

Custom page demonstrating routing functionality.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ React Router App     Home   My Page                                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                              My Page                                       │
│                              ───────                                       │
│                                                                            │
│     Welcome to your custom page!                                           │
│                                                                            │
│     This is a new page with the /mypage route.                           │
│                                                                            │
│     You can navigate between pages using the main menu above.             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```
