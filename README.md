# FabLab Explorer Catalog

Build a polished, client-facing digital product catalog for the FabLab Explorer project. This is a new standalone Lovable project, but it must preserve the established FabLab Explorer identity and purpose: professional exploration of real FabLab machines, especially desktop CNC routers, CO2 laser cutters, and compact CNC machines.

DESIGN DIRECTION:
- Recreate the experience of the supplied reference: an elegant digital editorial catalog / interactive magazine with a realistic open-book spread, page navigation, page-turn interaction, large product photography, and responsive layouts for desktop, tablet, and mobile.
- Premium industrial/editorial aesthetic: graphite/charcoal, warm ivory, restrained champagne-gold accents, crisp typography, generous whitespace, strong product photography. No childish styling, no cartoon machines, no generic floating-card dashboard, no unnecessary slogans or filler copy.
- The catalog should feel credible in a sales presentation to a customer.

FUNCTIONAL REQUIREMENTS:
1. Cover page and category sections: Routers CNC, Cortadoras láser CO2, CNC de escritorio, and Accesorios.
2. Interactive magazine/page navigation with previous/next, page thumbnails or page index, category navigation, and a clear way to exit/return to the catalog contents. On mobile, make it usable without horizontal overflow.
3. Product pages with product name, manufacturer, large image/gallery, concise description, technical specifications, work area, machine dimensions, spindle/laser power where applicable, compatible materials, included accessories, price, currency, shipping/tax notes, source and last-checked date.
4. Product detail view and a side-by-side comparison tool for selected machines.
5. Search and filters by category, work area, power, and price.
6. Product purchase/source links for official manufacturer stores and reputable marketplaces such as Amazon, AliExpress, and eBay. Do not invent listings, prices, seller reputations, specifications, or availability. For initial seed entries, use clearly marked sample/reference records and editable fields if verified listing URLs are not available. Never label a seller as verified without evidence.
7. Display USD and an indicative DOP equivalent, with the exchange-rate assumption visible and editable in a simple settings panel. Make clear that final landed cost can vary with shipping, customs, and taxes. Do not imply a live FX feed unless implemented.
8. Provide a presentation mode with clean full-screen product pages and no editing clutter.
9. Build a maintainable product data structure so the owner can add/edit/remove products, photos, specs, prices, source URLs, and checked dates. Include a simple admin/editor interface with local persistence for this first version; do not add authentication or paid integrations unless needed.
10. Use realistic product photography where possible; prioritize correct machine type and dimensions. For CNC machines, include the desktop 3018 class and make dimensions/work areas clearly distinguishable from 3040/400x400 classes. Do not imply 3D models exist if only photos are provided. Structure the UI so interactive 3D viewers can be added later.

CONTENT AND HONESTY:
- Use Spanish (Dominican/neutral Spanish) throughout.
- Avoid fabricated specs and prices. Clearly distinguish verified manufacturer specifications from fields awaiting confirmation. Seed the interface with a few illustrative entries marked 'Datos por verificar' rather than pretending they are current commercial offers.
- Include links only when an exact destination is known; otherwise show an editable 'Agregar enlace de tienda' field in the editor.
- No unnecessary motivational phrases or decorative marketing slogans.

TECH:
- Responsive full-stack TypeScript app using the default Lovable stack. Focus first on a high-quality working frontend and local editable catalog data. Add accessible keyboard navigation, clear focus states, and graceful empty states.
- Make it look finished, not like a wireframe.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3324d163-df65-455c-a46d-169f567b146d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
