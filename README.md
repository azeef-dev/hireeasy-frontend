# HireEasy — Frontend

React + Vite + Tailwind CSS v4 frontend for **HireEasy**, a local service-booking
marketplace. Talks to the Express/MongoDB backend.

## Stack

- React 19 + Vite
- Tailwind CSS v4 + **HeroUI v3** (`@heroui/react`) - used for the dropdown menus (category
  filter, status filter, profile menu)
- **react-hot-toast** for all notifications
- **react-loading-skeleton** for loading states
- React Router v7 for routing
- Poppins font throughout

## Setup

```bash
npm install
```

`.env` is already pointed at the deployed backend:

```
VITE_API_URL=https://hireeasy-backend.vercel.app/api
```

Change it (or copy `.env.example`) if you want to point at a different backend, e.g.
`http://localhost:5000/api` for local development.

## Run

```bash
npm run dev        # http://localhost:5173
npm run build       # production build -> dist/
npm run preview     # preview the production build locally
```

## Pages / routes

| Route | Who | What |
|---|---|---|
| `/` | everyone | Hero, search, category filter, provider grid |
| `/providers/:id` | everyone | Provider profile, reviews, booking modal |
| `/login`, `/register` | guests | Auth. Register lets you sign up as a customer or a provider |
| `/dashboard` | customer | My bookings, status filter, leave a review once completed |
| `/provider/dashboard` | provider | Incoming bookings, accept/reject, advance status, edit profile |
| `/admin/dashboard` | admin/superadmin | Verify providers, moderate all bookings, (super admin only) create new Admins |

## Design notes

- Palette: deep indigo (`#2B2F79`) + warm marigold accent (`#FFB020`) on a cool
  off-white background, with teal/coral reserved strictly for positive/negative status.
- Booking & provider cards use a perforated "service ticket" motif - a nod to the
  product being a real, trackable job rather than a generic listing.
- Booking status is shown as a connected step tracker (not just a colored pill),
  since the workflow really is a sequence: pending -> accepted -> in-progress -> completed.

## AI tools used

Frontend scaffolded with Claude (Anthropic).
