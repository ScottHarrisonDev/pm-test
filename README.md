# PM Test

An Astro project which interacts with the Shopify Storefront API.

## Details

- The homepage displays the 3 most recently created products

- The Products page displays all of the products in Shopify

- The Product page fetches and displays a single product whilst also triggering a product_view datalayer event (in production this could fire to GA or Elevar for example)

- All of these pages make use of semantic HTML and Astro components

- The src/utilities/* files contain utility methods which are all covered by Jest tests which can be run with `npm run test`

- Styling utilises Tailwind

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run test`            | Run Jest tests                                   |