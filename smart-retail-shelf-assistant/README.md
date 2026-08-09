# AisleX — Frontend

*Smarter Shelves. Smarter Shopping.*

Frontend-only build for AisleX. Two AI pipelines are represented in the UI
with mock data, sitting behind a mock authentication layer:

- **AisleX Vision** (Computer Vision) — shelf image upload, detection, and
  product classification (bounding boxes + confidence scores).
- **AisleX AI** (Generative AI) — a chat-style shopping assistant that
  answers questions and recommends alternative products.

No backend, CNN, LLM, or auth server is implemented here — every API call
is mocked with a simulated network delay (auth and history use
`localStorage`) so the UI feels real while you build the backend
separately. All prices are in Indian Rupees (₹).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`). Sign
up with any name/email/password — accounts are stored locally in your
browser, so each browser starts with an empty user list.

```bash
npm run build   # production build → dist/
npm run lint    # oxlint
```

## Project structure

```
src/
  components/   Sidebar, Navbar, ProductCard, UploadArea, ShelfViewer,
                DetectionBox, ChatInterface, RecommendationCard, StatsCard,
                AuthLayout, ProtectedRoute…
  pages/        Dashboard, ShelfAnalysis, ProductClassification,
                AIAssistant, History, Settings, Login, SignUp, Profile
  services/     authService.js, visionService.js, llmService.js,
                historyService.js, productService.js
  hooks/        useAuth.jsx (auth context/provider)
  mock/         mockProducts.js, mockDetections.js, mockChatResponses.js
```

## Connecting your real backend

All backend calls are isolated in `src/services/`. Each function currently
awaits a fixed delay and returns mock/local data — replace the body of a
function with a real `fetch`/`axios` call and keep the same return shape,
and no other file needs to change.

| File | Function | Replace with |
|---|---|---|
| `services/authService.js` | `login()`, `signUp()`, `logout()`, `getCurrentUser()` | Real auth endpoints (JWT/session-based); swap `localStorage` for your token storage |
| `services/visionService.js` | `analyzeShelfImage(file)` | POST the image to your CNN/YOLO inference endpoint; return `{ imageWidth, imageHeight, detections: [{ id, productId, box: [x,y,w,h] (0–1 normalized), confidence }] }` |
| `services/llmService.js` | `sendMessageToLLM(message, history)` | POST to your LLM/GenAI endpoint; return `{ text, productIds: [] }` |
| `services/historyService.js` | `saveShelfRun()`, `saveQuery()`, `getShelfHistory()`, `getQueryHistory()`, `getHistoryStats()` | Real per-user history endpoints backed by a database |
| `services/productService.js` | `getAllProducts()`, `getProductById(id)`, `getDashboardStats()` | Connect to your product database/API |

Bounding boxes use normalized `[x, y, width, height]` values (0–1) relative
to the image, so they render correctly regardless of the image's actual
pixel dimensions or how it's scaled on screen.

## Authentication & protected routes

`hooks/useAuth.jsx` exposes an `AuthProvider` + `useAuth()` hook backed by
`authService.js`. `/login` and `/signup` are public; every other route is
wrapped in `components/ProtectedRoute.jsx`, which redirects unauthenticated
visitors to `/login` and sends them back to where they were headed after
they log in. Shelf-analysis runs and AI queries are saved per user email
via `historyService.js`, so each account sees only its own history.

## Notes

- Built with React + Vite + Tailwind CSS v4 + lucide-react + react-router-dom.
- Product photos in the mock data are placeholder stock images from Unsplash —
  swap `mock/mockProducts.js` for your real catalog whenever convenient.
- Reference dataset for the CV component: SKU-110K (eg4000/SKU110K_CVPR19) on GitHub.
- This is a demo auth layer only — passwords are stored in plaintext in
  `localStorage` for convenience. Never ship this as-is; replace it with
  real authentication before going to production.
