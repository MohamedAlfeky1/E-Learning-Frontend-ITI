## 📁 Folder Tree

```
src/
├── api/                     ← Axios instance & endpoint constants
├── assets/                  ← Static images, graphics, and global SVGs
├── components/
│   ├── ui/                  ← Generic design-system components (e.g., Shadcn)
│   └── features/            ← Domain-specific components
├── layouts/                 ← Page shell wrappers (navbar, sidebar, footer)
├── hooks/                   ← Custom React hooks
├── pages/                   ← One file per route
├── queries/                 ← TanStack Query read hooks (useQuery)
├── mutations/               ← TanStack Query write hooks (useMutation)
├── services/                ← Pure async API functions
├── store/                   ← Client-side global state slices
├── utils/                   ← Pure helper functions
├── lib/                     ← Third-party utility bindings (e.g., Shadcn utils)
├── router/                  ← Route definitions & config
├── config/                  ← Env variables & app constants
├── App.jsx
└── main.jsx
```

---

## 📂 Folder Notes

<br>

<details>
<summary>&nbsp;<b>🧩 &nbsp;components/ui/</b> &nbsp;—&nbsp; Generic design-system components</summary>

<br>

Reusable building blocks with **zero business logic**. These components know nothing about courses, users, or your domain.

**Put here:**

| Component     | Purpose                  |
| ------------- | ------------------------ |
| `Button`      | All clickable actions    |
| `Input`       | Text fields, search bars |
| `Modal`       | Popup dialogs            |
| `Spinner`     | Loading indicators       |
| `Badge`       | Labels and tags          |
| `Card`        | Content containers       |
| `Avatar`      | User profile images      |
| `ProgressBar` | Video watch progress     |

> ⚠️ These components must **never** import from `features/`

<br>

</details>

---

<details>
<summary>&nbsp;<b>🎨 &nbsp;components/features/</b> &nbsp;—&nbsp; Domain-specific components</summary>

<br>

Components tied to a specific feature of the platform. They compose `ui/` components and add domain-aware display logic.

**Put here:**

| Component                 | Feature              |
| ------------------------- | -------------------- |
| `CourseCard`              | Course browsing      |
| `QuizQuestion`            | Quiz taking          |
| `CartSummary`             | Checkout flow        |
| `TeacherVerificationForm` | Onboarding           |
| `AnalyticsChart`          | Admin dashboard      |
| `VideoPlaylist`           | Course player        |
| `VoucherInput`            | Discounts & payments |

> ⚠️ Features can import from `ui/` — but `ui/` must **never** import from `features/`

<br>

</details>

---

<details>
<summary>&nbsp;<b>🖼️ &nbsp;layouts/</b> &nbsp;—&nbsp; Page shell wrappers</summary>

<br>

Layout components provide the persistent shell around pages — navbar, sidebar, footer. Pages only render their own content; the layout handles everything around it.

**Put here:**

| Layout            | Used by                                           |
| ----------------- | ------------------------------------------------- |
| `MainLayout`      | `HomePage`, `CourseDetailsPage`, all public pages |
| `DashboardLayout` | `StudentDashboardPage`, `TeacherDashboardPage`    |
| `AdminLayout`     | All `/admin/*` pages                              |
| `AuthLayout`      | `LoginPage`, `RegisterPage`, `ForgotPasswordPage` |

**How it works with React Router:**

```
router/
  └── routes.js
        ├── <MainLayout>       → wraps public pages
        ├── <DashboardLayout>  → wraps protected student/teacher pages
        ├── <AdminLayout>      → wraps admin-only pages
        └── <AuthLayout>       → wraps login/register pages
```

> ⚠️ Layouts must **never** contain business logic or fetch data — they are pure shells

<br>

</details>

---

<details>
<summary>&nbsp;<b>🪝 &nbsp;hooks/</b> &nbsp;—&nbsp; Custom React hooks</summary>

<br>

Custom hooks that use `useState`, `useEffect`, or other React internals. Reusable logic that belongs to no single component.

**Put here:**

| Hook                | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `useAuth`           | Read current user and role from TanStack Query cache |
| `useDebounce`       | Debounce the course search input                     |
| `usePeerConnection` | Manage one-to-one live video sessions                |
| `useVideoPlayer`    | Control video playback state                         |

> ⚠️ Do **NOT** put data-fetching here — that belongs in `queries/`

<br>

</details>

---

<details>
<summary>&nbsp;<b>📄 &nbsp;pages/</b> &nbsp;—&nbsp; Route-level screen components</summary>

<br>

One file per route. Pages compose feature components and connect queries. They are the entry point for each screen and are always wrapped by a layout.

**Put here:**

| Page                   | Route                |
| ---------------------- | -------------------- |
| `HomePage`             | `/`                  |
| `CourseDetailsPage`    | `/courses/:id`       |
| `StudentDashboardPage` | `/dashboard/student` |
| `TeacherDashboardPage` | `/dashboard/teacher` |
| `AdminAnalyticsPage`   | `/admin/analytics`   |
| `CheckoutPage`         | `/checkout`          |
| `LoginPage`            | `/login`             |
| `RegisterPage`         | `/register`          |

> ⚠️ Pages should be **thin** — no business logic, no direct API calls

<br>

</details>

---

<details>
<summary>&nbsp;<b>🔍 &nbsp;queries/</b> &nbsp;—&nbsp; TanStack Query read hooks</summary>

<br>

All `useQuery` hooks, organised by data domain. This is the **only** place your app reads server data.

**Put here:**

| File                | Fetches                               |
| ------------------- | ------------------------------------- |
| `courseQueries`     | Course listings, details, filters     |
| `categoryQueries`   | Course categories                     |
| `enrollmentQueries` | Student enrollment status             |
| `chatQueries`       | Live session messages                 |
| `analyticsQueries`  | Admin stats and charts                |
| `authQueries`       | Current user profile (`/me` endpoint) |

> 💡 Always export a `queryKey` factory alongside each hook — required for cache invalidation in `mutations/`

> 💡 `authQueries` replaces a global auth store — the current user lives in the TanStack Query cache, not in a separate state manager

<br>

</details>

---

<details>
<summary>&nbsp;<b>✏️ &nbsp;mutations/</b> &nbsp;—&nbsp; TanStack Query write hooks</summary>

<br>

All `useMutation` hooks, organised by data domain. Keeping these separate from `queries/` makes write operations easy to locate and test.

**Put here:**

| File               | Operations                    |
| ------------------ | ----------------------------- |
| `authMutations`    | Login, register, logout       |
| `courseMutations`  | Create course, publish course |
| `cartMutations`    | Add to cart, remove from cart |
| `quizMutations`    | Submit answers, save progress |
| `paymentMutations` | Checkout, apply voucher       |

> 💡 Always call `invalidateQueries` with the key from `queries/` to keep the cache in sync after a write

<br>

</details>

---

<details>
<summary>&nbsp;<b>📡 &nbsp;api/</b> &nbsp;—&nbsp; Axios instance & endpoint constants</summary>

<br>

Centralised API configuration. Contains the Axios base instance and all endpoint path constants. Every service file imports from here.

**Put here:**

| File               | Responsibility                                                       |
| ------------------ | -------------------------------------------------------------------- |
| `axiosInstance.js`  | Base Axios instance (`baseURL: http://localhost:3000/api`)           |
| `endpoints.js`     | All API endpoint path constants (no `/api` prefix — baseURL has it) |

> 💡 `axiosInstance` is pre-configured with the base URL — import it in every service instead of bare `axios`

> ⚠️ Endpoint strings must **not** include the `/api` prefix since `axiosInstance` already sets `baseURL` to `http://localhost:3000/api`

<br>

</details>

---

<details>
<summary>&nbsp;<b>🌐 &nbsp;services/</b> &nbsp;—&nbsp; Pure API layer</summary>

<br>

Pure async functions that call your API. No React, no hooks — just data in, data out. `queries/` and `mutations/` import from here. Each service imports `axiosInstance` and `ENDPOINTS` from `api/`.

**Put here:**

| Service             | Responsibility                |
| ------------------- | ----------------------------- |
| `authService`       | Login, register, refresh token |
| `courseService`     | Course and lesson CRUD        |
| `paymentService`    | Payment & voucher handling    |
| `attendanceService` | QR code scanning for sessions |

> 💡 Services should always use `axiosInstance` from `api/` — never import bare `axios`

<br>

</details>

---

<details>
<summary>&nbsp;<b>🛠️ &nbsp;utils/</b> &nbsp;—&nbsp; Pure helper functions</summary>

<br>

Stateless helpers with no side effects and no React. Each function takes input and returns output — nothing else.

**Put here:**

| Utility                       | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| `formatCurrency`              | Format course prices and teacher revenue   |
| `calculateProgressPercentage` | Compute video watch completion             |
| `formatDate`                  | Format session and availability dates      |
| `validators`                  | Validate passwords, emails, and file sizes |

<br>

</details>

---

<details>
<summary>&nbsp;<b>🎨 &nbsp;assets/</b> &nbsp;—&nbsp; Static files and media</summary>

<br>

Contains images, SVGs, icons, fonts, and any raw assets imported directly into your React components.

<br>

</details>

---

<details>
<summary>&nbsp;<b>📦 &nbsp;lib/</b> &nbsp;—&nbsp; Third-party bindings</summary>

<br>

Generally used for vendor utility files such as <code>utils.js</code> specifically generated for merging Tailwind classes natively used by <b>Shadcn UI</b> (<code>clsx</code>, <code>twMerge</code>).

<br>

</details>

---

<details>
<summary>&nbsp;<b>🗄️ &nbsp;store/</b> &nbsp;—&nbsp; Client-side global state</summary>

<br>

Used for UI-focused global state via tools like <b>Zustand</b> or <b>Redux</b>. 

> ⚠️ Note that API or server-side state is handled entirely via `queries/` and `mutations/` using TanStack Query.

<br>

</details>

---

<details>
<summary>&nbsp;<b>🗺️ &nbsp;router/</b> &nbsp;—&nbsp; Route definitions & config</summary>

<br>

React Router v7 configuration and all route definitions, including layout wrappers and role-based protected routes.

**Put here:**

| File                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `index.jsx`          | Main `createBrowserRouter` setup                   |
| `routes.js`          | Route tree with layout wrappers and role guards    |
| `ProtectedRoute.jsx` | HOC that checks auth before rendering a page       |
| `Loaders.js`         | Data loaders for prefetching via React Router APIs |

<br>

</details>

---

<details>
<summary>&nbsp;<b>⚙️ &nbsp;config/</b> &nbsp;—&nbsp; Environment variables & constants</summary>

<br>

All environment config and app-wide constants live here. This is the **only** file allowed to read `import.meta.env`.

**Put here:**

| File           | Examples                                            |
| -------------- | --------------------------------------------------- |
| `env.js`       | API base URL, PeerJS server config                  |
| `constants.js` | `MAX_VIDEO_SIZE`, `PLATFORM_FEE`, `SESSION_TIMEOUT` |

> ⚠️ `import.meta.env` should appear **only** in `config/env.js` — nowhere else in the codebase

<br>

</details>

---

## 📦 Installed Packages

| Purpose               | Package                 | Version   |
| --------------------- | ----------------------- | --------- |
| Data fetching & state | `@tanstack/react-query` | `^5.95.2` |
| Routing               | `react-router-dom`      | `^7.13.2` |
| HTTP client           | `axios`                 | `^1.13.6` |
| Styling               | `tailwindcss`           | `^4.2.2`  |
| Tailwind Vite plugin  | `@tailwindcss/vite`     | `^4.2.2`  |
| Icons                 | `react-icons`           | `^5.6.0`  |
| UI framework          | `react` / `react-dom`   | `^19.2.4` |
