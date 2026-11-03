import { createFileRoute } from "@tanstack/react-router";
import { Book } from "@/components/catalog/Book";
import { SiteHeader } from "@/components/catalog/shared";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FabLab Explorer · Catálogo de equipos" },
      { name: "description", content: "Catálogo interactivo de routers CNC, cortadoras láser CO2, CNC de escritorio y accesorios." },
      { property: "og:title", content: "FabLab Explorer · Catálogo de equipos" },
      { property: "og:description", content: "Catálogo interactivo de routers CNC, cortadoras láser CO2, CNC de escritorio y accesorios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main><Book /></main>
    </>
  ),
});
