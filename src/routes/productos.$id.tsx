import { createFileRoute, Link } from "@tanstack/react-router";
import { Gallery, PriceBlock, SiteHeader, SourceLinks, SpecList, StatusBadge } from "@/components/catalog/shared";
import { catalog, categoryName, fmtArea, fmtDate, useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/productos/$id")({
  head: () => ({
    meta: [
      { title: "Ficha de producto · FabLab Explorer" },
      { name: "description", content: "Especificaciones, materiales, precio indicativo y fuentes del equipo." },
      { property: "og:title", content: "Ficha de producto · FabLab Explorer" },
      { property: "og:description", content: "Especificaciones, materiales, precio indicativo y fuentes del equipo." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { products, compare } = useCatalog();
  const p = products.find((x) => x.id === id);

  if (!p) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="font-display text-3xl">Producto no encontrado</p>
          <p className="mt-2 text-sm text-muted-foreground">Puede haber sido eliminado en el editor.</p>
          <Link to="/productos" className="btn btn-outline mt-6">Volver a productos</Link>
        </main>
      </>
    );
  }

  const rows = [
    { label: "Fabricante", value: p.manufacturer || "Por verificar" },
    { label: "Área de trabajo", value: fmtArea(p.workArea) },
    { label: "Dimensiones del equipo", value: p.dimensions || "Por verificar" },
    { label: p.category === "laser" ? "Potencia láser" : "Potencia del husillo", value: p.powerLabel || "Por verificar" },
    ...p.specs,
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <nav className="eyebrow text-muted-foreground" aria-label="Ruta">
          <Link to="/productos" className="hover:text-foreground">Productos</Link> / {categoryName(p.category)}
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Gallery p={p} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge p={p} />
              <span className="eyebrow text-muted-foreground">Revisado: {fmtDate(p.lastChecked)}</span>
            </div>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-none">{p.name}</h1>
            <p className="mt-2 text-muted-foreground">{p.manufacturer}</p>
            <p className="mt-6 leading-relaxed">{p.description || "Descripción pendiente."}</p>

            <div className="mt-8"><PriceBlock p={p} /></div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="btn btn-outline" onClick={() => catalog.toggleCompare(p.id)}>
                {compare.includes(p.id) ? "Quitar de comparación" : "Agregar a comparación"}
              </button>
              <Link to="/editor" search={{ id: p.id }} className="btn btn-outline">Editar ficha</Link>
            </div>

            <h2 className="eyebrow mt-10 text-muted-foreground">Especificaciones técnicas</h2>
            <div className="mt-3"><SpecList rows={rows} /></div>
            {p.workAreaNote && <p className="mt-2 text-xs text-muted-foreground">{p.workAreaNote}</p>}
            {rows.some((r) => "verified" in r && r.verified === false && !/verificar/i.test(r.value)) &&
              <p className="mt-1 text-xs text-warning-foreground">* Dato pendiente de confirmación con el fabricante.</p>}

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="eyebrow text-muted-foreground">Materiales compatibles</h2>
                <p className="mt-3 text-sm">{p.materials.join(", ") || "Por verificar"}</p>
              </div>
              <div>
                <h2 className="eyebrow text-muted-foreground">Accesorios incluidos</h2>
                <p className="mt-3 text-sm">{p.accessories.join(", ") || "Por verificar"}</p>
              </div>
            </div>

            <h2 className="eyebrow mt-10 text-muted-foreground">Dónde comprar / fuentes</h2>
            <div className="mt-3"><SourceLinks p={p} /></div>
          </div>
        </div>
      </main>
    </>
  );
}
