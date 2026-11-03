import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PriceBlock, ProductImage, SiteHeader, StatusBadge } from "@/components/catalog/shared";
import { catalog, CATEGORIES, categoryName, fmtArea, useCatalog, type CategoryId } from "@/lib/catalog";

export const Route = createFileRoute("/productos/")({
  head: () => ({
    meta: [
      { title: "Productos · FabLab Explorer" },
      { name: "description", content: "Busque y filtre equipos por categoría, área de trabajo, potencia y precio." },
      { property: "og:title", content: "Productos · FabLab Explorer" },
      { property: "og:description", content: "Busque y filtre equipos por categoría, área de trabajo, potencia y precio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Productos,
});

function Productos() {
  const { products, compare } = useCatalog();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId | "">("");
  const [minX, setMinX] = useState(0);
  const [minPower, setMinPower] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");

  const list = useMemo(() => products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (q && !`${p.name} ${p.manufacturer} ${p.description} ${p.materials.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (minX && Math.min(p.workArea.x ?? 0, p.workArea.y ?? 0) < minX) return false;
    if (minPower && (p.powerW ?? 0) < minPower) return false;
    const mp = parseFloat(maxPrice);
    if (mp > 0 && (p.priceUSD == null || p.priceUSD > mp)) return false;
    return true;
  }), [products, q, cat, minX, minPower, maxPrice]);

  const reset = () => { setQ(""); setCat(""); setMinX(0); setMinPower(0); setMaxPrice(""); };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <p className="eyebrow text-muted-foreground">Catálogo</p>
        <h1 className="mt-1 font-display text-5xl font-semibold">Productos</h1>

        <section aria-label="Filtros" className="mt-8 grid gap-3 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-5">
          <label className="text-xs text-muted-foreground lg:col-span-1">Buscar
            <input className="field mt-1" placeholder="Nombre, fabricante, material" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="text-xs text-muted-foreground">Categoría
            <select className="field mt-1" value={cat} onChange={(e) => setCat(e.target.value as CategoryId | "")}>
              <option value="">Todas</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-xs text-muted-foreground">Área de trabajo mínima (lado menor)
            <select className="field mt-1" value={minX} onChange={(e) => setMinX(+e.target.value)}>
              <option value={0}>Cualquiera</option>
              <option value={180}>≥ 180 mm (clase 3018)</option>
              <option value={300}>≥ 300 mm (clase 3040)</option>
              <option value={400}>≥ 400 mm (clase 4040)</option>
              <option value={600}>≥ 600 mm</option>
            </select>
          </label>
          <label className="text-xs text-muted-foreground">Potencia mínima
            <select className="field mt-1" value={minPower} onChange={(e) => setMinPower(+e.target.value)}>
              <option value={0}>Cualquiera</option>
              <option value={40}>≥ 40 W</option>
              <option value={60}>≥ 60 W</option>
              <option value={300}>≥ 300 W</option>
              <option value={800}>≥ 800 W</option>
              <option value={1500}>≥ 1,5 kW</option>
            </select>
          </label>
          <label className="text-xs text-muted-foreground">Precio máximo (USD)
            <input className="field mt-1 font-mono" inputMode="decimal" placeholder="Sin límite" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </label>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>{list.length} de {products.length} productos · los filtros de área, potencia y precio excluyen registros sin ese dato.</p>
          {compare.length > 0 && <Link to="/comparar" className="btn btn-primary">Comparar seleccionados ({compare.length})</Link>}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 border border-dashed border-border p-12 text-center">
            <p className="font-display text-2xl">Ningún producto coincide con los filtros</p>
            <button className="btn btn-outline mt-4" onClick={reset}>Limpiar filtros</button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              const sel = compare.includes(p.id);
              return (
                <li key={p.id} className="flex flex-col border border-border bg-card">
                  <Link to="/productos/$id" params={{ id: p.id }} className="block overflow-hidden">
                    <ProductImage p={p} className="aspect-[4/3] w-full transition-transform duration-500 hover:scale-[1.03]" />
                  </Link>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="eyebrow text-muted-foreground">{categoryName(p.category)}</span>
                      <StatusBadge p={p} />
                    </div>
                    <Link to="/productos/$id" params={{ id: p.id }} className="font-display text-2xl font-semibold leading-tight hover:underline">{p.name}</Link>
                    <p className="font-mono text-xs text-muted-foreground">{fmtArea(p.workArea)} · {p.powerLabel || "Potencia por verificar"}</p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                      <PriceBlock p={p} compact />
                      <label className="flex cursor-pointer items-center gap-2 text-xs">
                        <input type="checkbox" checked={sel} className="accent-[var(--color-gold)]"
                          onChange={() => { if (!catalog.toggleCompare(p.id)) toast("Puede comparar hasta 4 equipos a la vez."); }} />
                        Comparar
                      </label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
