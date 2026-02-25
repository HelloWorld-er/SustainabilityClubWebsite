This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Emission Factors API

The calculator calls `POST /api/footprint` with the selected inputs. The API uses emission factors stored in `data/emission-factors.json` and returns per-category and total CO2e results.

The statement shown in the UI is sourced from the same file, and the API responds with:
- `current` totals and category breakdown
- `simulated` totals and category breakdown
- `meta` including `updatedAt`, `statement`, and `sources`

### Automatic Refresh

`src/lib/emissionFactors.js` can refresh factors using the source list in `data/emission-factors.sources.json`. Provide direct CSV or JSON endpoints for eGRID and IPCC-derived values, then set `enabled: true` for each source. When the cached data is older than 30 days, the API attempts to refresh and writes the updated factors back to `data/emission-factors.json` (when the runtime allows file writes).
