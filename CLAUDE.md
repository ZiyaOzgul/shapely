# Shapely — Claude Code Guide

## Project Overview
Shapely is an AI-powered mobile app that transforms user-written text into platform-optimized, context-aware content. Users pick a destination (e.g. LinkedIn post, cover letter, Instagram caption) and the app rewrites their input in the appropriate tone and style using OpenAI GPT-4o.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 55 |
| Navigation | Expo Router (file-based) |
| Language | TypeScript (strict mode) |
| Auth/DB | Firebase Auth + Firestore |
| AI | OpenAI GPT-4o via REST |
| Subscriptions | React Native Adapty (pending) |
| Scaling | react-native-size-matters |
| Icons | @expo/vector-icons |

## Project Structure
```
app/
  (auth)/           # login, register, forgot-password
  (tabs)/           # index (generator), history, profile
  _layout.tsx       # root layout — font loading + auth gate
components/         # reusable UI components
constants/
  colors.ts         # Lucid + Etheric color palettes
  typography.ts     # Manrope font family + size scale
  theme.ts          # unified theme object (uses size-matters)
hooks/              # custom React hooks
lib/
  firebase.ts       # Firebase auth + Firestore exports
services/
  ai.ts             # OpenAI GPT-4o API calls
types/              # TypeScript interfaces and types
```

## Design System — Universal Scheme (Lucid Light + Etheric Dark)

The app supports both light and dark mode. Never hardcode colors.

### Theme Usage
Always use the `useTheme()` hook to access design tokens:
- `theme.colors` — all color values (auto-switches based on system preference)
- `theme.spacing` — scaled spacing values
- `theme.radius` — scaled border radius values
- `theme.typography` — font families and scaled sizes
- `theme.gradients.primary` — `['#5865F2', '#571BC1']` brand gradient

### Light Mode (Lucid)
| Token | Value |
|---|---|
| Background | #F8F9FA |
| Surface | #FFFFFF |
| Text Primary | #191C1D |
| Text Secondary | #434656 |
| Glass | rgba(255,255,255,0.7) / blur 10px |

### Dark Mode (Etheric)
| Token | Value |
|---|---|
| Background | #0B1326 |
| Surface | #131B2E |
| Text Primary | #FFFFFF |
| Text Secondary | #A1A1AA |
| Glass | rgba(255,255,255,0.05) / blur 20px |

### Shared
- **Brand Gradient:** 135deg, `#5865F2 → #571BC1` — CTAs and active states
- **Typography:** Manrope (all weights) — sizes from `theme.typography`
- **Corner Radius:** sm=8, md=12, lg=16, xl=24, pill=100 — via `moderateScale()`
- **Press interaction:** `scale(0.95)`
- Never use `LightTheme` or `DarkTheme` directly — always `useTheme()` hook

## Responsive Scaling
Use `react-native-size-matters` for every size value — no raw pixels.

```ts
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Horizontal: width, fontSize, paddingHorizontal
scale(16)

// Vertical: height, paddingVertical, marginVertical
verticalScale(24)

// Components, border radius
moderateScale(12)
```

## AI Integration
All AI calls go through `services/ai.ts`. The service signature:

```ts
transform(userText: string, destination: Destination, tone: Tone): Promise<string>
```

- Each destination has its own GPT system prompt optimised for that context's tone, length, and style.
- Use streaming responses where possible for better UX.
- Always handle API errors gracefully with user-friendly messages.
- API keys go in environment variables — never in client code.

### Destinations
**Professional:** LinkedIn Post, CV Summary, Cover Letter, Job Description, Performance Review, Executive Summary, Business Proposal, Press Release

**Communication:** Formal Email, Casual Email, Cold Outreach, Follow-up Message, Apology Message, Thank You Note

**Social & Content:** Instagram Caption, Twitter/X Post, YouTube Description, Blog Introduction, Newsletter Intro, Product Description

**Personal:** Personal Statement, Dating Profile Bio, Wedding Speech, Recommendation Letter

**Academic:** Research Abstract, Essay Introduction, Thesis Statement

## Internationalization
All user-facing strings must go through the i18n translation layer (i18next + react-i18next or expo-localization). No hardcoded strings in components — ever.

## Firebase
- **Auth:** Email/Password
- **Firestore collections:**
  - `users/{uid}` — user profile and preferences
  - `users/{uid}/history` — transformation history records

## Code Conventions

### Components & Hooks
- Functional components with hooks only
- `StyleSheet.create` at the bottom of every file — no inline styles for complex components
- Component files: `PascalCase.tsx`
- Hook files: `camelCase.ts` — prefix with `use` (e.g. `useAuth`, `useTransform`)
- Utility files: `camelCase.ts`

### Imports
Order: React → React Native → Expo → third-party → internal (`@/` alias)

### TypeScript
- Strict mode — never use `any`
- Always define proper interfaces in `types/`

### Error Handling
Every `async` function must have `try/catch` with proper error handling — no exceptions.

## Do Not
- Hardcode colors, spacing, or font sizes — always use `Theme`
- Use raw pixel values without `react-native-size-matters`
- Put API keys in client code — use environment variables
- Skip error handling on async operations
- Use inline styles for complex components — always `StyleSheet.create`
- Write test files
- Install packages without first verifying Expo SDK 55 compatibility
