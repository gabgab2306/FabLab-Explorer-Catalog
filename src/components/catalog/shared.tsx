import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  catalog, fmtMoney, SOURCE_LABELS, toDOP, useCatalog, type Product,
} from "@/lib/catalog";

export function SiteHeader() {
  const { compare } = useCatalog();
  const nav = [
    { to: "/", label: "Revista" },
    { to: "/productos", label: "Productos" },
    { to: "/comparar", label: `Comparar${compare.length ? ` (${compare.length})` : ""}` },
    { to: "/editor", label: "Editor" },
  ] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">FabLab Explorer</span>
          <span className="eyebrow hidden text-muted-foreground sm:inline">Catálogo</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm" aria-label="Principal">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
              activeProps={{ className: "rounded px-2.5 py-1.5 text-foreground underline decoration-gold decoration-2 underline-offset-8" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <RateSettings />
          <Link to="/presentacion" className="btn btn-primary">Presentación</Link>
        </div>
      </div>
    </header>
  );
}

export function RateSettings({ tone = "light" }: { tone?: "light" | "desk" }) {
  const { settings } = useCatalog();
  const [val, setVal] = useState(String(settings.rateDOP));
  return (
    <Popover onOpenChange={(o) => o && setVal(String(settings.rateDOP))}>
      <PopoverTrigger className={`btn ${tone === "desk" ? "btn-desk" : "btn-outline"}`} aria-label="Ajustar tasa de cambio">
        <span className="font-mono text-xs">1 USD = {settings.rateDOP} DOP</span>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-popover">
        <form onSubmit={(e) => { e.preventDefault(); const n = parseFloat(val); if (n > 0) catalog.setSettings({ rateDOP: n }); }}
          className="space-y-3">
          <p className="eyebrow text-muted-foreground">Tasa de cambio supuesta</p>
          <label className="block text-sm">
            DOP por 1 USD
            <input className="field mt-1 font-mono" inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} />
          </label>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Valor introducido manualmente, sin conexión a una cotización en vivo. Los montos en DOP son indicativos;
            el costo final puede variar por envío, aduana e impuestos.
          </p>
          <button className="btn btn-primary w-full" type="submit">Guardar tasa</button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export function StatusBadge({ p }: { p: Product }) {
  return p.status === "verificado" ? (
    <span className="eyebrow inline-flex items-center gap-1.5 rounded-sm border border-success/40 px-2 py-0.5 text-success">
      <span className="size-1.5 rounded-full bg-success" /> Datos verificados
    </span>
  ) : (
    <span className="eyebrow inline-flex items-center gap-1.5 rounded-sm bg-warning px-2 py-0.5 text-warning-foreground">
      <span className="size-1.5 rounded-full bg-warning-foreground" /> Datos por verificar
    </span>
  );
}

export function PriceBlock({ p, compact }: { p: Product; compact?: boolean }) {
  const { settings } = useCatalog();
  if (p.priceUSD == null) {
    return (
      <div>
        <p className={`font-display ${compact ? "text-xl" : "text-3xl"} text-muted-foreground`}>Precio por confirmar</p>
        {!compact && <p className="mt-1 text-xs text-muted-foreground">{p.shippingNote}</p>}
      </div>
    );
  }
  return (
    <div>
      <p className={`font-display ${compact ? "text-2xl" : "text-4xl"} font-semibold`}>{fmtMoney(p.priceUSD, "USD")}</p>
      <p className="font-mono text-xs text-muted-foreground">
        ≈ {fmtMoney(toDOP(p.priceUSD, settings.rateDOP), "DOP")} · tasa supuesta {settings.rateDOP}
      </p>
      {!compact && <p className="mt-1 text-xs text-muted-foreground">{p.shippingNote} El costo final puede variar por envío, aduana e impuestos.</p>}
    </div>
  );
}

export function SourceLinks({ p }: { p: Product }) {
  const valid = p.sources.filter((s) => /^https?:\/\//.test(s.url));
  if (!valid.length) return <p className="text-sm text-muted-foreground">Sin enlaces de tienda registrados.</p>;
  return (
    <ul className="space-y-1.5">
      {valid.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 border-b border-border py-1.5 text-sm hover:border-gold">
            <span><span className="eyebrow mr-2 text-muted-foreground">{SOURCE_LABELS[s.type]}</span>{s.label || new URL(s.url).hostname}</span>
            <span aria-hidden className="text-gold group-hover:translate-x-0.5">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ProductImage({ p, className = "", eager }: { p: Product; className?: string; eager?: boolean }) {
  const src = p.images[0];
  if (!src) return <div className={`flex items-center justify-center bg-muted eyebrow text-muted-foreground ${className}`}>Sin fotografía</div>;
  return <img src={src} alt={p.name} width={1024} height={1024} loading={eager ? "eager" : "lazy"} className={`object-cover ${className}`} />;
}

export function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  if (!p.images.length) return <ProductImage p={p} className="aspect-square w-full" />;
  return (
    <div>
      <div className="relative overflow-hidden bg-muted">
        <img src={p.images[i]} alt={`${p.name}, imagen ${i + 1}`} width={1024} height={1024} className="aspect-square w-full object-cover" />
        {/* Slot reserved for a future interactive 3D viewer (p.model3dUrl). Only shown when a model exists. */}
        {p.model3dUrl && <span className="eyebrow absolute right-3 top-3 bg-paper px-2 py-1">Modelo 3D disponible</span>}
      </div>
      {p.images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {p.images.map((src, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Ver imagen ${idx + 1}`}
              className={`size-16 shrink-0 overflow-hidden border-2 ${idx === i ? "border-gold" : "border-transparent"}`}>
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {p.imageNote && <p className="mt-2 text-xs italic text-muted-foreground">{p.imageNote}</p>}
    </div>
  );
}

export function SpecList({ rows }: { rows: { label: string; value: string; verified?: boolean }[] }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2 text-sm">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="font-mono text-[0.8rem]">
            {r.value || "Por verificar"}
            {r.verified === false && r.value && !/verificar/i.test(r.value) && <span className="ml-2 text-warning-foreground" title="Pendiente de confirmación">*</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
