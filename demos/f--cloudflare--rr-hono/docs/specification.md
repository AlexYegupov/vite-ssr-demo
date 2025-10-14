# Project Specification

## Overview

React Router demo application showcasing client-side routing with multiple pages and global tab navigation. Built with React Router 7, deployed on Cloudflare Workers with SSR support. Features a persistent navigation bar with tabs that appears on all pages for seamless navigation between sections. Includes todo list management with KV storage and weather data display using external API.

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

Main landing page with overview cards for navigating to different sections.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todos     Weather                                                │
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

### Todos

Todo list management page with CRUD operations stored in Cloudflare KV.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todos     Weather                                                │
│           ═════                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Todo List                                                                 │
│                                                                            │
│  [New todo text...........................] [Add]                          │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ☐ Buy groceries                    Created: 2025-10-14  [Edit] [Del] │ │
│  │                                     Updated: 2025-10-14               │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ ☑ Finish project                   Created: 2025-10-13  [Edit] [Del] │ │
│  │                                     Updated: 2025-10-14               │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Weather

Weather data display page showing current conditions and hourly forecast for selected city.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Home     Todos     Weather                                                │
│                     ═══════                                                │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Weather Data                                                              │
│                                                                            │
│  [Select city.....................] [Search]                               │
│                                                                            │
│  Current Weather - London, United Kingdom                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  Temperature: 15.2°C                                                  │ │
│  │  Wind Speed: 12.5 km/h                                                │ │
│  │  Conditions: Partly Cloudy                                            │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  Hourly Forecast                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  Time        Temp    Humidity    Wind                                 │ │
│  │  ────────    ────    ────────    ────                                 │ │
│  │  14:00       15.2°C  65%         12.5 km/h                            │ │
│  │  15:00       15.8°C  63%         13.1 km/h                            │ │
│  │  16:00       15.5°C  64%         12.8 km/h                            │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```
