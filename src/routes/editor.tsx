import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/catalog/shared";
import {
  catalog, CATEGORIES, newProduct, SOURCE_LABELS, useCatalog,
  type CategoryId, type Product, type SourceType,
} from "@/lib/catalog";

export const Route = createFileRoute("/editor")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s.id === "string" ? { id: s.id } : {}),
  head: () => ({
    meta: [
      { title: "Editor del catálogo · FabLab Explorer" },
      { name: "description", content: "Agregue, edite o elimine productos, fotos, especificaciones, precios y fuentes." },
      { property: "og:title", content: "Editor del catálogo · FabLab Explorer" },
      { property: "og:description", content: "Agregue, edite o elimine productos, fotos, especificaciones, precios y fuentes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Editor,
});

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const num = (s: string) => (s.trim() === "" || isNaN(+s) ? null : +s);

function Editor() {
  const { products } = useCatalog();
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: "/editor" });
  const selected = products.find((p) => p.id === id) ?? null;
  const fileRef = useRef<HTMLInputElement>(null);

  const select = (pid?: string) => navigate({ search: pid ? { id: pid } : {} });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fablab-catalogo.json";
    a.click();
  };
  const importJson = async (f: File) => {
    try {
      const data = JSON.parse(await f.text());
      if (!Array.isArray(data)) throw new Error();
      catalog.replaceAll(data);
      toast.success(`${data.length} productos importados`);
    } catch { toast.error("El archivo no tiene un formato válido."); }
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Guardado en este navegador</p>
            <h1 className="mt-1 font-display text-5xl font-semibold">Editor del catálogo</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-outline" onClick={exportJson}>Exportar JSON</button>
            <button className="btn btn-outline" onClick={() => fileRef.current?.click()}>Importar JSON</button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
            <button className="btn btn-outline" onClick={() => { if (confirm("¿Restablecer el catálogo a los registros de referencia? Se perderán los cambios.")) { catalog.reset(); select(); } }}>Restablecer</button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[18rem_1fr]">
          <aside>
            <button className="btn btn-primary w-full" onClick={() => { const p = newProduct(); catalog.upsert(p); select(p.id); }}>+ Nuevo producto</button>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {products.map((p) => (
                <li key={p.id}>
                  <button onClick={() => select(p.id)} className={`w-full px-2 py-2.5 text-left text-sm ${p.id === id ? "bg-accent" : "hover:bg-muted"}`}>
                    <span className="block truncate">{p.name}</span>
                    <span className="eyebrow text-muted-foreground">{CATEGORIES.find((c) => c.id === p.category)?.short}{p.status === "por-verificar" ? " · por verificar" : ""}</span>
                  </button>
                </li>
              ))}
              {!products.length && <li className="py-6 text-center text-sm text-muted-foreground">Catálogo vacío</li>}
            </ul>
          </aside>
          {selected ? <ProductForm key={selected.id} product={selected} onDeleted={() => select()} /> : (
            <div className="flex items-center justify-center border border-dashed border-border p-12 text-center text-muted-foreground">
              Seleccione un producto para editarlo o cree uno nuevo.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-xs text-muted-foreground">
      {label}
      <div className="mt-1 text-foreground">{children}</div>
      {hint && <span className="mt-1 block text-[0.7rem]">{hint}</span>}
    </label>
  );
}

function ProductForm({ product, onDeleted }: { product: Product; onDeleted: () => void }) {
  const [p, setP] = useState(product);
  const [images, setImages] = useState(product.images.join("\n"));
  const [specs, setSpecs] = useState(product.specs.map((s) => `${s.label}: ${s.value}${s.verified ? "" : " ?"}`).join("\n"));
  const [dirty, setDirty] = useState(false);
  useEffect(() => setDirty(true), [p, images, specs]);
  useEffect(() => setDirty(false), []);

  const up = (patch: Partial<Product>) => setP((x) => ({ ...x, ...patch }));

  const save = () => {
    const parsedSpecs = lines(specs).map((l) => {
      const [label, ...rest] = l.split(":");
      let value = rest.join(":").trim();
      const unverified = value.endsWith("?");
      if (unverified) value = value.slice(0, -1).trim();
      return { label: label.trim(), value, verified: !unverified };
    }).filter((s) => s.label);
    const bad = p.sources.find((s) => s.url && !/^https?:\/\//.test(s.url));
    if (bad) { toast.error("Los enlaces deben empezar con http:// o https://"); return; }
    catalog.upsert({ ...p, images: lines(images), specs: parsedSpecs, sources: p.sources.filter((s) => s.url) });
    setDirty(false);
    toast.success("Producto guardado");
  };

  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre"><input className="field" value={p.name} onChange={(e) => up({ name: e.target.value })} /></Field>
        <Field label="Fabricante"><input className="field" value={p.manufacturer} onChange={(e) => up({ manufacturer: e.target.value })} /></Field>
        <Field label="Categoría">
          <select className="field" value={p.category} onChange={(e) => up({ category: e.target.value as CategoryId })}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Estado de los datos" hint="Marque «verificado» solo con evidencia del fabricante o la tienda.">
          <select className="field" value={p.status} onChange={(e) => up({ status: e.target.value as Product["status"] })}>
            <option value="por-verificar">Datos por verificar</option>
            <option value="verificado">Datos verificados</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Descripción"><textarea className="field min-h-24" value={p.description} onChange={(e) => up({ description: e.target.value })} /></Field>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Fotografías (una URL por línea)"><textarea className="field min-h-20 font-mono text-xs" value={images} onChange={(e) => setImages(e.target.value)} /></Field>
        </div>
        <Field label="Nota de imagen"><input className="field" value={p.imageNote} onChange={(e) => up({ imageNote: e.target.value })} /></Field>
        <Field label="Modelo 3D (URL .glb, opcional)" hint="Reservado para un visor 3D futuro.">
          <input className="field font-mono text-xs" value={p.model3dUrl ?? ""} onChange={(e) => up({ model3dUrl: e.target.value || null })} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {(["x", "y", "z"] as const).map((k) => (
          <Field key={k} label={`Área de trabajo ${k.toUpperCase()} (mm)`}>
            <input className="field font-mono" inputMode="numeric" value={p.workArea[k] ?? ""} onChange={(e) => up({ workArea: { ...p.workArea, [k]: num(e.target.value) } })} />
          </Field>
        ))}
        <div className="sm:col-span-3"><Field label="Nota sobre el área"><input className="field" value={p.workAreaNote} onChange={(e) => up({ workAreaNote: e.target.value })} /></Field></div>
        <Field label="Dimensiones del equipo"><input className="field" value={p.dimensions} onChange={(e) => up({ dimensions: e.target.value })} /></Field>
        <Field label="Potencia (W, para filtros)"><input className="field font-mono" inputMode="numeric" value={p.powerW ?? ""} onChange={(e) => up({ powerW: num(e.target.value) })} /></Field>
        <Field label="Potencia (texto)"><input className="field" value={p.powerLabel} onChange={(e) => up({ powerLabel: e.target.value })} /></Field>
        <div className="sm:col-span-3">
          <Field label="Especificaciones (una por línea, «Etiqueta: valor»)" hint="Termine el valor con «?» para marcarlo como pendiente de confirmación.">
            <textarea className="field min-h-28 font-mono text-xs" value={specs} onChange={(e) => setSpecs(e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-3 grid gap-4 sm:grid-cols-2">
          <Field label="Materiales compatibles (separados por coma)"><input className="field" value={p.materials.join(", ")} onChange={(e) => up({ materials: csv(e.target.value) })} /></Field>
          <Field label="Accesorios incluidos (separados por coma)"><input className="field" value={p.accessories.join(", ")} onChange={(e) => up({ accessories: csv(e.target.value) })} /></Field>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Field label="Precio (USD)" hint="Dejar vacío si no hay precio confirmado."><input className="field font-mono" inputMode="decimal" value={p.priceUSD ?? ""} onChange={(e) => up({ priceUSD: num(e.target.value) })} /></Field>
        <Field label="Última revisión"><input type="date" className="field" value={p.lastChecked ?? ""} onChange={(e) => up({ lastChecked: e.target.value || null })} /></Field>
        <Field label="Nota de envío / impuestos"><input className="field" value={p.shippingNote} onChange={(e) => up({ shippingNote: e.target.value })} /></Field>
      </section>

      <section>
        <p className="text-xs text-muted-foreground">Enlaces de tienda y fuentes</p>
        <div className="mt-2 space-y-2">
          {p.sources.map((s, i) => (
            <div key={s.id} className="grid gap-2 sm:grid-cols-[10rem_1fr_2fr_auto]">
              <select className="field" aria-label="Tipo de tienda" value={s.type} onChange={(e) => up({ sources: p.sources.map((x, j) => j === i ? { ...x, type: e.target.value as SourceType } : x) })}>
                {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input className="field" placeholder="Etiqueta (opcional)" value={s.label} onChange={(e) => up({ sources: p.sources.map((x, j) => j === i ? { ...x, label: e.target.value } : x) })} />
              <input className="field font-mono text-xs" placeholder="https://…" value={s.url} onChange={(e) => up({ sources: p.sources.map((x, j) => j === i ? { ...x, url: e.target.value } : x) })} />
              <button type="button" className="btn btn-outline" onClick={() => up({ sources: p.sources.filter((_, j) => j !== i) })}>Quitar</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={() => up({ sources: [...p.sources, { id: crypto.randomUUID(), type: "oficial", label: "", url: "" }] })}>
            + Agregar enlace de tienda
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-border bg-background py-4">
        <button type="submit" className="btn btn-primary">Guardar cambios</button>
        {dirty && <span className="text-xs text-muted-foreground">Cambios sin guardar</span>}
        <button type="button" className="btn ml-auto text-destructive hover:underline" onClick={() => { if (confirm(`¿Eliminar «${product.name}»?`)) { catalog.remove(product.id); onDeleted(); } }}>
          Eliminar producto
        </button>
      </div>
    </form>
  );
}
