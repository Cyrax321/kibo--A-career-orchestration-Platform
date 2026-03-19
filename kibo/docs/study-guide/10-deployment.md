# 10 – Deployment & DevOps (Deep Dive)

## Build System: Vite 5.4

### Why Vite?
- **10-100x faster** than Webpack for dev server startup
- Uses native ES modules during development (no bundling)
- Instant Hot Module Replacement (HMR)
- Rollup-based production bundler (tree-shaking, code splitting)
- Uses SWC instead of Babel (`@vitejs/plugin-react-swc`) for faster compilation

### vite.config.ts:
```typescript
export default defineConfig({
  plugins: [react()],  // @vitejs/plugin-react-swc
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  server: {
    port: 8080,          // Custom dev port
    host: "::"           // Accessible on all interfaces
  }
});
```

## npm Scripts

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start Vite dev server at `localhost:8080` with HMR |
| `npm run build` | Production build → `dist/` directory (minified, tree-shaken) |
| `npm run build:dev` | Development build (source maps, no minification) |
| `npm run lint` | ESLint 9 check on all files |
| `npm run preview` | Serve production build locally for testing |
| `npm test` | Run Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## Production Build Output

```
npm run build

dist/
├── index.html           # Entry point with hashed JS/CSS references
├── assets/
│   ├── index-[hash].js  # Main bundle (React, Router, TanStack)
│   ├── index-[hash].css # Compiled Tailwind CSS
│   ├── Dashboard-[hash].js  # Lazy-loaded chunk
│   ├── Arena-[hash].js      # Lazy-loaded chunk
│   ├── ... (20 lazy chunks, one per page)
│   └── vendor-[hash].js     # Shared vendor code
├── kibo-new.glb         # 3D model (copied from public/)
└── kibo-logo.png        # Logo (copied from public/)
```

**Code Splitting:** Each lazy-loaded page becomes a separate JS chunk, loaded on-demand.

## Deployment Options

### Option 1: Vercel (Recommended)
```json
// vercel.json (119 bytes)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
- SPA rewrite: All routes → `index.html` (React Router handles routing)
- Automatic HTTPS, CDN, edge caching
- `git push` triggers auto-deploy

### Option 2: Netlify
```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Any Static Host
Upload `dist/` to any static file server (S3, Cloudflare Pages, etc.). Must configure SPA fallback.

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           Vercel / Netlify CDN              │
│  ┌──────────────────────────────────────┐   │
│  │  Static Files (dist/)                │   │
│  │  - index.html                        │   │
│  │  - JS chunks (lazy-loaded)           │   │
│  │  - CSS (compiled Tailwind)           │   │
│  │  - 3D model (.glb)                   │   │
│  │  - Images                            │   │
│  └──────────────────────────────────────┘   │
└─────────┬───────────────────────────────────┘
          │ HTTPS REST + WebSocket
          ▼
┌─────────────────────────────────────────────┐
│           Supabase Cloud                    │
│  ┌──────┐ ┌──────┐ ┌────────┐ ┌─────────┐ │
│  │ Auth │ │ REST │ │Realtime│ │ Storage │ │
│  │(JWT) │ │(CRUD)│ │  (WS)  │ │ (Files) │ │
│  └──────┘ └──────┘ └────────┘ └─────────┘ │
│  ┌─────────────────────────────────────┐    │
│  │   PostgreSQL 15 + RLS + Functions   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
          │ HTTP
          ▼
┌──────────────────┐  ┌────────────────────┐
│   Judge0 CE      │  │   Uploadthing      │
│ (Free, Public)   │  │  (File Uploads)    │
└──────────────────┘  └────────────────────┘
```

## Environment Setup Guide

### 1. Clone Repository:
```bash
git clone https://github.com/Cyrax321/kibo-v7.git
cd kibo-v7
```

### 2. Install Dependencies:
```bash
npm ci    # Clean install (uses package-lock.json)
```

### 3. Configure Environment:
```bash
# Create .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 4. Start Development:
```bash
npm run dev   # Starts at localhost:8080
```

### 5. Build for Production:
```bash
npm run build   # Outputs to dist/
npm run preview # Test production build locally
```

## Testing Infrastructure

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 3.2.4 | Test runner (Jest-compatible) |
| **@testing-library/react** | 16.0 | React component testing |
| **@testing-library/jest-dom** | 6.6 | DOM assertion matchers |
| **jsdom** | 20.0.3 | Browser DOM simulation |

**Test directory:** `src/test/` (2 files)
**Config:** `vitest.config.ts` (395 bytes)

## TypeScript Configuration

| File | Purpose |
|------|---------|
| `tsconfig.json` | Base config (extends) |
| `tsconfig.app.json` | App config (strict mode, path aliases) |
| `tsconfig.node.json` | Node/build scripts config |

## CSS Toolchain

```
TailwindCSS → PostCSS (postcss.config.js) → Autoprefixer → Final CSS
```

Plugins: `tailwindcss`, `autoprefixer`, `@tailwindcss/typography`, `tailwindcss-animate`, `tailwind-scrollbar-hide`

## Dev vs Production Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| Build | In-memory (Vite HMR) | dist/ (minified) |
| Source maps | Enabled | Disabled |
| Console logs | Visible | Should be removed |
| Error detail | Full stack traces | Minimal |
| API | Same Supabase project | Same (or separate prod) |
| Port | localhost:8080 | CDN edge |
