import { createFileRoute } from "@tanstack/react-router";
import { Book } from "@/components/catalog/Book";

export const Route = createFileRoute("/presentacion")({
  head: () => ({
    meta: [
      { title: "Modo presentación · FabLab Explorer" },
      { name: "description", content: "Presentación a pantalla completa del catálogo FabLab Explorer." },
      { property: "og:title", content: "Modo presentación · FabLab Explorer" },
      { property: "og:description", content: "Presentación a pantalla completa del catálogo FabLab Explorer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <main><Book presentation /></main>,
});
