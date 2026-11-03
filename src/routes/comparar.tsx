import { createFileRoute, Link } from "@tanstack/react-router";
import { PriceBlock, ProductImage, SiteHeader, StatusBadge } from "@/components/catalog/shared";
import { catalog, categoryName, fmtArea, fmtDate, useCatalog, type Product } from "@/lib/catalog";

export const Route = createFileRoute("/comparar")({
  head: () => ({
    meta: [
      { title: "Comparar equipos · FabLab Explorer" },
      { name: "description", content: "Comparación lado a lado de equipos seleccionados del catálogo." },
      { property: "og:title", content: "Comparar equipos · FabLab Explorer" },
      { property: "og:description", content: "Comparación lado a lado de equipos seleccionados del catálogo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Comparar,
});

const ROWS: { label: string; get: (p: Product) => string }[] = [
  { label: "Categoría", get: (p) => categoryName(p.category) },
  { label: "Fabricante", get: (p) => p.manufacturer || "Por verificar" },
  { label: "Área de trabajo", get: (p) => fmtArea(p.workArea) },
  { label: "Dimensiones", get: (p) => p.dimensions || "Por verificar" },
  { label: "Potencia", get: (p) => p.powerLabel || "Por verificar" },
  { label: "Materiales", get: (p) => p.materials.join(", ") || "Por verificar" },
  { label: "Accesorios incluidos", get: (p) => p.accessories.join(", ") || "Por verificar" },
  { label: "Última revisión", get: (p) => fmtDate(p.lastChecked) },
];

function Comparar() {
  const { products, compare } = useCatalog();
  const items = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Hasta 4 equipos</p>
            <h1 className="mt-1 font-display text-5xl font-semibold">Comparar</h1>
          </div>
          {items.length > 0 && <button className="btn btn-outline" onClick={() => catalog.clearCompare()}>Vaciar comparación</button>}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 border border-dashed border-border p-12 text-center">
            <p className="font-display text-2xl">No hay equipos seleccionados</p>
            <p className="mt-2 text-sm text-muted-foreground">Marque «Comparar» en la lista de productos.</p>
            <Link to="/productos" className="btn btn-primary mt-5">Ir a productos</Link>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-40" />
                  {items.map((p) => (
                    <th key={p.id} className="p-3 text-left align-top font-normal">
                      <ProductImage p={p} className="aspect-[4/3] w-full" />
                      <Link to="/productos/$id" params={{ id: p.id }} className="mt-3 block font-display text-xl font-semibold leading-tight hover:underline">{p.name}</Link>
                      <div className="mt-2"><StatusBadge p={p} /></div>
                      <button className="mt-2 text-xs text-muted-foreground underline" onClick={() => catalog.toggleCompare(p.id)}>Quitar</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <th scope="row" className="eyebrow p-3 text-left align-top font-normal text-muted-foreground">Precio</th>
                  {items.map((p) => <td key={p.id} className="p-3 align-top"><PriceBlock p={p} compact /></td>)}
                </tr>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-t border-border">
                    <th scope="row" className="eyebrow p-3 text-left align-top font-normal text-muted-foreground">{r.label}</th>
                    {items.map((p) => <td key={p.id} className="p-3 align-top font-mono text-xs">{r.get(p)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">Los montos en DOP son indicativos según la tasa supuesta. El costo final puede variar por envío, aduana e impuestos.</p>
          </div>
        )}
      </main>
    </>
  );
}
