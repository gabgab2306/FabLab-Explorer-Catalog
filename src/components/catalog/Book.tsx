import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CATEGORIES, categoryName, fmtArea, fmtDate, useCatalog, type CategoryId, type Product,
} from "@/lib/catalog";
import { PriceBlock, ProductImage, StatusBadge } from "./shared";

type Page =
  | { kind: "cover" }
  | { kind: "contents" }
  | { kind: "section"; cat: CategoryId; n: number }
  | { kind: "product"; p: Product }
  | { kind: "empty"; cat: CategoryId }
  | { kind: "back" };

function usePages(products: Product[]) {
  return useMemo(() => {
    const pages: Page[] = [{ kind: "cover" }, { kind: "contents" }];
    CATEGORIES.forEach((c, i) => {
      pages.push({ kind: "section", cat: c.id, n: i + 1 });
      const items = products.filter((p) => p.category === c.id);
      if (!items.length) pages.push({ kind: "empty", cat: c.id });
      items.forEach((p) => pages.push({ kind: "product", p }));
    });
    pages.push({ kind: "back" });
    return pages;
  }, [products]);
}

function pageLabel(pg: Page) {
  switch (pg.kind) {
    case "cover": return "Portada";
    case "contents": return "Contenido";
    case "section": return categoryName(pg.cat);
    case "product": return pg.p.name;
    case "empty": return "Sin productos";
    case "back": return "Contraportada";
  }
}

export function Book({ presentation = false }: { presentation?: boolean }) {
  const { products } = useCatalog();
  const pages = usePages(products);
  const isMobile = useIsMobile();
  const single = isMobile || presentation;
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [showIndex, setShowIndex] = useState(false);

  // Desktop spreads: [0] alone, then [1,2], [3,4] ...
  const spreadStart = single ? page : page === 0 ? 0 : page % 2 === 1 ? page : page - 1;
  const visible = single || spreadStart === 0 ? [spreadStart] : [spreadStart, spreadStart + 1].filter((i) => i < pages.length);
  const step = single ? 1 : 2;

  const go = useCallback((target: number) => {
    const t = Math.max(0, Math.min(pages.length - 1, target));
    setDir(t >= page ? "next" : "prev");
    setPage(t);
    setShowIndex(false);
  }, [page, pages.length]);

  const next = () => go(spreadStart === 0 && !single ? 1 : spreadStart + step);
  const prev = () => go(single ? page - 1 : spreadStart - 2 < 1 ? 0 : spreadStart - 2);
  const atEnd = visible[visible.length - 1] >= pages.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input,textarea,select,[role=dialog]")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(pages.length - 1);
      else if (e.key === "Escape" && !presentation) go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const sectionStart = (cat: CategoryId) => pages.findIndex((p) => p.kind === "section" && p.cat === cat);

  const renderPage = (i: number, side: "left" | "right" | "single") => (
    <div key={i} className={`relative flex min-w-0 flex-1 flex-col overflow-hidden bg-paper text-foreground ${
      single ? "" : "aspect-[3/4]"} ${side === "left" ? "spine-left" : side === "right" ? "spine-right" : ""}`}>
      <PageContent pg={pages[i]} index={i} total={pages.length} goSection={(c) => go(sectionStart(c))} go={go}
        pages={pages} presentation={presentation} />
    </div>
  );

  return (
    <div className={`flex flex-col bg-desk text-desk-foreground ${presentation ? "min-h-screen" : "min-h-[calc(100vh-57px)]"}`}>
      {/* toolbar */}
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 px-4 pt-4 md:px-8">
        {presentation ? (
          <Link to="/" className="btn btn-desk">← Salir de presentación</Link>
        ) : (
          <button className="btn btn-desk" onClick={() => go(1)}>Contenido</button>
        )}
        <div className="flex flex-wrap gap-1" role="navigation" aria-label="Categorías">
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => go(sectionStart(c.id))}
              className="rounded px-2.5 py-1.5 text-xs text-desk-foreground/70 hover:text-gold">{c.short}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {presentation && <FullscreenButton />}
          <button className="btn btn-desk" aria-expanded={showIndex} onClick={() => setShowIndex((s) => !s)}>Índice de páginas</button>
        </div>
      </div>

      {showIndex && (
        <div className="mx-auto mt-3 w-full max-w-7xl px-4 md:px-8">
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {pages.map((pg, i) => (
              <li key={i}>
                <button onClick={() => go(i)} className={`w-full border px-2 py-2 text-left text-xs ${visible.includes(i) ? "border-gold text-gold" : "border-desk-foreground/20 hover:border-gold"}`}>
                  <span className="font-mono opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-0.5 block truncate">{pageLabel(pg)}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* book */}
      <div className="flex flex-1 items-center justify-center px-3 py-6 md:px-8">
        <div className="flex w-full max-w-7xl items-center gap-2 md:gap-4">
          <button onClick={prev} disabled={visible[0] === 0} aria-label="Página anterior"
            className="btn btn-desk hidden size-11 shrink-0 rounded-full p-0 md:inline-flex">←</button>
          <div key={visible.join("-")}
            className={`mx-auto flex w-full shadow-book ${dir === "next" ? "turn-next" : "turn-prev"} ${
              single ? (presentation ? "max-w-3xl" : "max-w-xl") : visible.length === 1 ? "max-w-[30rem]" : "max-w-6xl"}`}
            aria-live="polite">
            {visible.length === 1 ? renderPage(visible[0], "single")
              : <>{renderPage(visible[0]!, "left")}<div className="w-px bg-border" />{renderPage(visible[1]!, "right")}</>}
          </div>
          <button onClick={next} disabled={atEnd} aria-label="Página siguiente"
            className="btn btn-desk hidden size-11 shrink-0 rounded-full p-0 md:inline-flex">→</button>
        </div>
      </div>

      {/* bottom controls + thumbnails */}
      <div className="border-t border-desk-foreground/10">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-8">
          <button onClick={prev} disabled={visible[0] === 0} className="btn btn-desk md:hidden" aria-label="Página anterior">←</button>
          <p className="font-mono text-xs text-desk-foreground/60 whitespace-nowrap">
            {visible.map((v) => v + 1).join("–")} / {pages.length}
          </p>
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1">
            {pages.map((pg, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Ir a página ${i + 1}: ${pageLabel(pg)}`}
                className={`h-10 w-7 shrink-0 overflow-hidden border ${visible.includes(i) ? "border-gold" : "border-desk-foreground/20 opacity-60 hover:opacity-100"}`}>
                <Thumb pg={pg} />
              </button>
            ))}
          </div>
          <button onClick={next} disabled={atEnd} className="btn btn-desk md:hidden" aria-label="Página siguiente">→</button>
        </div>
      </div>
    </div>
  );
}

function Thumb({ pg }: { pg: Page }) {
  if (pg.kind === "product" && pg.p.images[0]) return <img src={pg.p.images[0]} alt="" className="size-full object-cover" />;
  if (pg.kind === "cover" || pg.kind === "back") return <div className="size-full bg-primary" />;
  if (pg.kind === "section") return <div className="flex size-full items-center justify-center bg-paper font-display text-xs text-foreground">{pg.n}</div>;
  return <div className="size-full bg-paper" />;
}

function FullscreenButton() {
  const [fs, setFs] = useState(false);
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);
  return (
    <button className="btn btn-desk" onClick={() => (fs ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())}>
      {fs ? "Salir de pantalla completa" : "Pantalla completa"}
    </button>
  );
}

function Folio({ index, label }: { index: number; label: string }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border px-6 py-3 eyebrow text-muted-foreground md:px-8">
      <span>FabLab Explorer · {label}</span>
      <span>{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}

function PageContent({ pg, index, total, goSection, go, pages, presentation }: {
  pg: Page; index: number; total: number; goSection: (c: CategoryId) => void; go: (i: number) => void; pages: Page[]; presentation: boolean;
}): ReactNode {
  if (pg.kind === "cover") {
    const hero = pages.find((p): p is { kind: "product"; p: Product } => p.kind === "product" && !!p.p.images[0]);
    return (
      <div className="relative flex min-h-[32rem] flex-1 flex-col bg-primary text-primary-foreground">
        {hero && <img src={hero.p.images[0]} alt="" className="absolute inset-0 size-full object-cover opacity-35" />}
        <div className="relative flex flex-1 flex-col p-8 md:p-10">
          <p className="eyebrow text-gold">Catálogo de equipos · Edición {new Date().getFullYear()}</p>
          <h1 className="mt-auto font-display text-6xl font-semibold leading-[0.9] md:text-7xl">FabLab<br />Explorer</h1>
          <div className="mt-6 h-px w-16 bg-gold" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-80">Routers CNC, cortadoras láser CO2, CNC de escritorio y accesorios.</p>
          <p className="eyebrow mt-8 opacity-60">{total} páginas</p>
        </div>
      </div>
    );
  }
  if (pg.kind === "back") {
    return (
      <div className="flex min-h-[32rem] flex-1 flex-col justify-end bg-primary p-8 text-primary-foreground md:p-10">
        <p className="font-display text-3xl">FabLab Explorer</p>
        <p className="mt-3 max-w-sm text-xs leading-relaxed opacity-70">
          Precios en USD con equivalente indicativo en DOP según una tasa supuesta. El costo final puede variar por envío,
          aduana e impuestos. Los registros marcados «Datos por verificar» son referencias pendientes de confirmación.
        </p>
      </div>
    );
  }
  if (pg.kind === "contents") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 p-6 md:p-10">
          <p className="eyebrow text-muted-foreground">Contenido</p>
          <h2 className="mt-2 font-display text-4xl font-semibold">Índice</h2>
          <ol className="mt-8 space-y-1">
            {CATEGORIES.map((c, i) => {
              const start = pages.findIndex((p) => p.kind === "section" && p.cat === c.id);
              const count = pages.filter((p) => p.kind === "product" && p.p.category === c.id).length;
              return (
                <li key={c.id}>
                  <button onClick={() => goSection(c.id)} className="group flex w-full items-baseline gap-3 border-b border-border py-3 text-left hover:border-gold">
                    <span className="font-mono text-xs text-gold">0{i + 1}</span>
                    <span className="font-display text-2xl group-hover:text-foreground">{c.name}</span>
                    <span className="ml-auto whitespace-nowrap font-mono text-xs text-muted-foreground">{count} · p. {start + 1}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {!presentation && (
            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/productos" className="btn btn-outline">Buscar y filtrar</Link>
              <Link to="/comparar" className="btn btn-outline">Comparar equipos</Link>
            </div>
          )}
        </div>
        <Folio index={index} label="Contenido" />
      </div>
    );
  }
  if (pg.kind === "section") {
    const c = CATEGORIES.find((x) => x.id === pg.cat)!;
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col p-6 md:p-10">
          <p className="font-display text-[7rem] leading-none text-gold/60 md:text-[9rem]">0{pg.n}</p>
          <h2 className="mt-auto font-display text-5xl font-semibold leading-none">{c.name}</h2>
          <div className="mt-5 h-px w-12 bg-gold" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
        </div>
        <Folio index={index} label={c.short} />
      </div>
    );
  }
  if (pg.kind === "empty") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
          <p className="eyebrow text-muted-foreground">{categoryName(pg.cat)}</p>
          <p className="mt-3 font-display text-2xl">Sin productos en esta sección</p>
          {!presentation && <Link to="/editor" className="btn btn-outline mt-5">Agregar producto</Link>}
        </div>
        <Folio index={index} label={categoryName(pg.cat)} />
      </div>
    );
  }
  const p = pg.p;
  return (
    <div className="flex flex-1 flex-col">
      <ProductImage p={p} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow text-muted-foreground">{p.manufacturer || "Fabricante por confirmar"}</p>
            <StatusBadge p={p} />
          </div>
          <h3 className="mt-2 font-display text-3xl font-semibold leading-tight">{p.name}</h3>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-y border-border py-3 text-xs">
          <div><dt className="eyebrow text-muted-foreground">Área de trabajo</dt><dd className="mt-0.5 font-mono">{fmtArea(p.workArea)}</dd></div>
          <div><dt className="eyebrow text-muted-foreground">Potencia</dt><dd className="mt-0.5 font-mono">{p.powerLabel || "Por verificar"}</dd></div>
          <div className="col-span-2"><dt className="eyebrow text-muted-foreground">Materiales</dt><dd className="mt-0.5">{p.materials.join(" · ") || "Por verificar"}</dd></div>
        </dl>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <PriceBlock p={p} compact />
          {!presentation && (
            <Link to="/productos/$id" params={{ id: p.id }} className="btn btn-primary">Ficha completa</Link>
          )}
        </div>
        <p className="text-[0.68rem] text-muted-foreground">Revisado: {fmtDate(p.lastChecked)}</p>
      </div>
      <Folio index={index} label={categoryName(p.category)} />
    </div>
  );
}
