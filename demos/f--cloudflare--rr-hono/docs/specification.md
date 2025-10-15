# Project Specification

## Overview

Full-stack demo application showcasing modern web development on Cloudflare Workers edge network. Built with React Router 7 and Hono, featuring server-side rendering, distributed KV database, and real-time user interactions. Includes persistent navigation with loading indicators, comprehensive error handling with recovery options, toast notifications for user feedback, and polished animations throughout. Todo list management uses Cloudflare KV with optimistic UI updates and undo functionality. Weather data integrates external API with dynamic city selection.

## Entities

### Todo

#### id
Unique identifier for the todo item (string)

#### title
Text content of the todo (string)

#### completed
Completion status of the todo (boolean)

#### createdAt
Timestamp when the todo was created (ISO string)

#### updatedAt
Timestamp when the todo was last modified (ISO string)

### City

#### name
City name (string)

#### country
Country name (string)

#### latitude
Geographic latitude coordinate (number)

#### longitude
Geographic longitude coordinate (number)

### Route

#### path
String representing the URL path for the route

#### component
React component to render for this route

#### meta
Metadata for the route including title and description

## Pages

### Home

Landing page showcasing technology stack, interactive demo cards with hover effects and staggered animations, and roadmap overview. Cards lift and scale on hover with smooth transitions.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todos     Weather                                    [Loading ▓] │
│  ════                                                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                    Full-Stack Demo Application                             │
│              A production-ready showcase of modern web development         │
│                                                                            │
│  Technologies & Architecture                                               │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐          │
│  │ 🚀 Infrastructure │ │ ⚛️ Frontend       │ │ 🔧 Backend & API │          │
│  │ Cloudflare Workers│ │ React 19          │ │ REST API         │          │
│  │ Cloudflare KV     │ │ React Router v7   │ │ Router Actions   │          │
│  │ SSR               │ │ Radix UI          │ │ Toast Notify     │          │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘          │
│                                                                            │
│  Interactive Demos                                                         │
│  ┌─────────────────────────┐    ┌─────────────────────────┐              │
│  │  📝 Todo List            │    │  🌤️ Weather Forecast    │              │
│  │  Full CRUD with KV       │    │  Dynamic city selection │              │
│  │  Optimistic UI updates   │    │  API integration        │              │
│  └─────────────────────────┘    └─────────────────────────┘              │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Todos

Todo management with full CRUD operations, Cloudflare KV persistence, optimistic UI updates, undo deletion with toast notifications, inline editing, animated checkboxes with pop effect, and slide-in animations for new items. Empty state displays when no todos exist. Error boundary catches failures with retry options.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todos     Weather                                    [Loading ▓] │
│           ═════                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Todo List                                                                 │
│                                                                            │
│  [New todo text...........................] [Add]                          │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ☐ Buy groceries                    Created: 2025-10-14  [✏️] [🗑️]    │ │
│  │                                     Updated: 2025-10-14               │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ☑ Finish project                   Created: 2025-10-13  [✏️] [🗑️]    │ │
│  │                                     Updated: 2025-10-14               │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────┐           │
│  │ 🔔 Todo Deleted. Click to undo.                      [Undo] [✕]       │
│  └────────────────────────────────────────────────────────────┘           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘

### Weather

Real-time weather data from Open-Meteo API with dynamic city selection from top 10 world cities, animated weather icon with bounce effect, scale-in animation for weather card, hover lift effect, and comprehensive error handling. Displays current conditions including temperature with trend indicator, wind speed, humidity, sunrise/sunset times, UV index with color-coded severity levels, and precipitation probability. Features 7-day forecast with daily high/low temperatures, weather icons, and rain chances. Error boundary shows retry options on API failures with toast notifications.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todos     Weather                                    [Loading ▓] │
│                     ═══════                                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Weather Information                                                       │
│                                                                            │
│  [London, United Kingdom ▼]                                                │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    London, United Kingdom                             │ │
│  │                           ☀️                                          │ │
│  │                       15.2°C ↗ 2.1°                                   │ │
│  │                       Clear sky                                       │ │
│  │                                                                       │ │
│  │  Wind Speed    Humidity    Sunrise      Sunset      UV Index  Rain   │ │
│  │  12.5 km/h     65%         🌅 6:45 AM   🌇 8:30 PM  3.2-Mod   15%    │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  7-Day Forecast                                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ Today   │ │Tomorrow │ │ Wed     │ │ Thu     │ │ Fri     │            │
│  │   ☀️    │ │   ☁️    │ │   🌧️   │ │   ⛈️    │ │   ☀️    │            │
│  │ 18° 12° │ │ 16° 11° │ │ 14° 10° │ │ 13°  9° │ │ 17° 11° │            │
│  │         │ │ 💧 20%  │ │ 💧 60%  │ │ 💧 80%  │ │         │            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────┐           │
│  │ 🔔 City Changed. Now showing weather for London, UK.    [✕]           │
│  └────────────────────────────────────────────────────────────┘           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```
