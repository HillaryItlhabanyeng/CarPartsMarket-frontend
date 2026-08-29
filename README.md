# CarPartMarket Frontend

React + Vite + Tailwind template wired up for the CarPartMarket Spring Boot backend.

## Setup

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies any request to
`/api/*` through to your Spring Boot backend on `http://localhost:8080`
(see `vite.config.js` — change the target port if yours differs).

## What's included

- **Routing** — `react-router-dom`, routes defined in `src/App.jsx`
- **Auth** — `src/context/AuthContext.jsx`, role-based (`buyer` / `seller` / `admin`),
  session persisted to `localStorage`
- **Protected routes** — `src/components/ProtectedRoute.jsx`, optionally restrict by role
- **API layer** — `src/api/` — one file per resource (`authApi`, `orderApi`, `vehicleApi`,
  `transactionApi`), all going through the shared `client.js` fetch wrapper
- **Pages** — `src/pages/` — `HomePage`, `LoginPage`, `RegisterPage`,
  `VehiclePage`, `OrderPage`, `TransactionPage` (list + create + delete, ready to extend)
- **Theme** — beige/white palette, Cormorant Garamond (display) + DM Sans (body),
  tokens defined in `tailwind.config.js`

## Things to double-check against your backend

- **Endpoint paths** — `orderApi.js`, `vehicleApi.js`, `transactionApi.js` currently
  guess at REST conventions (`/order/getAll`, `/order/create`, etc.). Update these to
  match your actual `@RequestMapping`/`@GetMapping` paths in each Controller.
- **Auth response shape** — `AuthContext.login()` expects the login endpoint to return
  an object containing at least `email` and `role`. Adjust `loginRequest` / the shape
  saved to `localStorage` if your `AuthController` returns something different.
- **Register payload shape** — `RegisterPage.jsx` builds a payload matching the
  `Name` embeddable (`firstName`/`lastName`) plus each subclass's extra field
  (`buyingPart`, `sellingPart`, `role`/`permissions`). Adjust field names if your
  Builders expect different JSON keys.
- **IDs** — since you're mid-migration from `Long` to `String` ids, the table `key`s
  fall back between `xId` and `id` — once migration is done you can simplify those.

## Structure

```
src/
  api/            fetch wrappers, one file per resource
  components/     shared components (Navbar, ProtectedRoute)
  context/        AuthContext
  layouts/        MainLayout (Navbar + page content)
  pages/          route-level pages
  App.jsx         route definitions
  main.jsx        entry point, providers
  index.css       Tailwind + design tokens
```
