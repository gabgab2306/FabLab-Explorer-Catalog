import { useSyncExternalStore } from "react";
import img3018 from "@/assets/cnc-3018.jpg";
import img3040 from "@/assets/cnc-3040.svg";
import img4040 from "@/assets/cnc-4040.jpg";
import imgLaser from "@/assets/laser-co2.jpg";
import imgMills from "@/assets/endmills.jpg";

export type CategoryId = "routers" | "laser" | "escritorio" | "accesorios";

export const CATEGORIES: { id: CategoryId; name: string; short: string; blurb: string }[] = [
  { id: "routers", name: "Routers CNC", short: "Routers", blurb: "Equipos de pórtico para madera, plásticos y aluminio en formatos 400 mm o mayores." },
  { id: "laser", name: "Cortadoras láser CO2", short: "Láser CO2", blurb: "Corte y grabado de acrílico, MDF, madera, cuero y textiles con tubo CO2." },
  { id: "escritorio", name: "CNC de escritorio", short: "Escritorio", blurb: "Clase 3018 y similares: formato compacto para prototipos, PCB y piezas pequeñas." },
  { id: "accesorios", name: "Accesorios", short: "Accesorios", blurb: "Fresas, sujeción, extracción y consumibles para el taller." },
];

export type SourceType = "oficial" | "amazon" | "aliexpress" | "ebay" | "otro";
export const SOURCE_LABELS: Record<SourceType, string> = {
  oficial: "Tienda oficial",
  amazon: "Amazon",
  aliexpress: "AliExpress",
  ebay: "eBay",
  otro: "Otro distribuidor",
};

export interface Source { id: string; type: SourceType; label: string; url: string }
export interface Spec { label: string; value: string; verified: boolean }

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  category: CategoryId;
  images: string[];
  imageNote: string;
  description: string;
  workArea: { x: number | null; y: number | null; z: number | null };
  workAreaNote: string;
  dimensions: string;
  powerW: number | null;
  powerLabel: string;
  specs: Spec[];
  materials: string[];
  accessories: string[];
  priceUSD: number | null;
  shippingNote: string;
  sources: Source[];
  lastChecked: string | null;
  status: "verificado" | "por-verificar";
  /** Reserved for a future interactive 3D viewer (GLB/GLTF URL). */
  model3dUrl: string | null;
}

export interface Settings { rateDOP: number; rateNote: string }
export interface CatalogState { products: Product[]; settings: Settings; compare: string[] }

const PENDING = "Por verificar";
const ILLUSTRATIVE = "Imagen ilustrativa de la clase de equipo; no corresponde a un listado específico.";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "cnc-3018-clase",
    name: "CNC de escritorio clase 3018",
    manufacturer: "Varios fabricantes (registro de referencia)",
    category: "escritorio",
    images: [img3018],
    imageNote: ILLUSTRATIVE,
    description: "Formato compacto de tres ejes. La denominación «3018» se refiere al área nominal de trabajo de 300 × 180 mm. Útil para grabado, PCB y piezas pequeñas en madera y plásticos.",
    workArea: { x: 300, y: 180, z: 45 },
    workAreaNote: "Área nominal de la clase 3018; el valor real varía según el modelo.",
    dimensions: PENDING,
    powerW: null,
    powerLabel: PENDING,
    specs: [
      { label: "Ejes", value: "3 (X, Y, Z)", verified: false },
      { label: "Controlador", value: PENDING, verified: false },
      { label: "Pinza / portaherramientas", value: PENDING, verified: false },
    ],
    materials: ["Madera", "MDF", "Acrílico", "Placas PCB"],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  },
  {
    id: "router-3040-clase",
    name: "Router CNC clase 3040",
    manufacturer: "Varios fabricantes (registro de referencia)",
    category: "routers",
    images: [img3040],
    imageNote: ILLUSTRATIVE,
    description: "Pórtico de formato rectangular, con un área nominal de 300 × 400 mm. No confundir con la clase 4040 (400 × 400 mm).",
    workArea: { x: 300, y: 400, z: null },
    workAreaNote: "Área nominal de la clase 3040; confirmar recorrido Z con el fabricante.",
    dimensions: PENDING,
    powerW: null,
    powerLabel: PENDING,
    specs: [
      { label: "Ejes", value: PENDING, verified: false },
      { label: "Tipo de husillo", value: PENDING, verified: false },
    ],
    materials: ["Madera", "MDF", "Acrílico", "Aluminio (según husillo)"],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  },
  {
    id: "router-4040-clase",
    name: "Router CNC clase 4040",
    manufacturer: "Varios fabricantes (registro de referencia)",
    category: "routers",
    images: [img4040],
    imageNote: ILLUSTRATIVE,
    description: "Formato cuadrado de área nominal 400 × 400 mm, adecuado para tableros medianos y series cortas de piezas.",
    workArea: { x: 400, y: 400, z: null },
    workAreaNote: "Área nominal de la clase 4040.",
    dimensions: PENDING,
    powerW: null,
    powerLabel: PENDING,
    specs: [{ label: "Tipo de husillo", value: PENDING, verified: false }],
    materials: ["Madera", "MDF", "Acrílico", "Aluminio (según husillo)"],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  },
  {
    id: "laser-co2-40w-clase",
    name: "Cortadora láser CO2 clase 40 W",
    manufacturer: "Varios fabricantes (registro de referencia)",
    category: "laser",
    images: [imgLaser],
    imageNote: ILLUSTRATIVE,
    description: "Equipo de sobremesa con tubo CO2 de potencia nominal 40 W. Corte de láminas delgadas y grabado. Requiere extracción de humos y refrigeración del tubo.",
    workArea: { x: null, y: null, z: null },
    workAreaNote: "Área de trabajo por verificar según modelo.",
    dimensions: PENDING,
    powerW: 40,
    powerLabel: "40 W nominal (tubo CO2)",
    specs: [
      { label: "Refrigeración", value: PENDING, verified: false },
      { label: "Software compatible", value: PENDING, verified: false },
    ],
    materials: ["Acrílico", "MDF", "Madera contrachapada", "Cuero", "Cartón"],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  },
  {
    id: "fresas-3175",
    name: "Juego de fresas de 3,175 mm",
    manufacturer: "Por definir (registro de referencia)",
    category: "accesorios",
    images: [imgMills],
    imageNote: ILLUSTRATIVE,
    description: "Fresas de vástago 3,175 mm (1/8″), compatibles con la pinza habitual de equipos de la clase 3018.",
    workArea: { x: null, y: null, z: null },
    workAreaNote: "",
    dimensions: "Vástago 3,175 mm",
    powerW: null,
    powerLabel: "No aplica",
    specs: [
      { label: "Material", value: PENDING, verified: false },
      { label: "Cantidad de piezas", value: PENDING, verified: false },
    ],
    materials: ["Madera", "Acrílico", "PCB"],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  rateDOP: 60,
  rateNote: "Tasa de referencia introducida manualmente; no es una cotización en vivo.",
};

const KEY = "fablab-catalog-v1";
const initial: CatalogState = { products: SEED_PRODUCTS, settings: DEFAULT_SETTINGS, compare: [] };
let state: CatalogState = initial;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CatalogState>;
      state = {
        products: Array.isArray(parsed.products) ? parsed.products : SEED_PRODUCTS,
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        compare: Array.isArray(parsed.compare) ? parsed.compare : [],
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function setState(next: CatalogState) {
  state = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  listeners.forEach((l) => l());
}

export function useCatalog() {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
    () => initial,
  );
}

export const catalog = {
  get: () => state,
  upsert(p: Product) {
    const exists = state.products.some((x) => x.id === p.id);
    setState({ ...state, products: exists ? state.products.map((x) => (x.id === p.id ? p : x)) : [...state.products, p] });
  },
  remove(id: string) {
    setState({ ...state, products: state.products.filter((x) => x.id !== id), compare: state.compare.filter((c) => c !== id) });
  },
  setSettings(s: Partial<Settings>) { setState({ ...state, settings: { ...state.settings, ...s } }); },
  toggleCompare(id: string) {
    const has = state.compare.includes(id);
    if (!has && state.compare.length >= 4) return false;
    setState({ ...state, compare: has ? state.compare.filter((c) => c !== id) : [...state.compare, id] });
    return true;
  },
  clearCompare() { setState({ ...state, compare: [] }); },
  replaceAll(products: Product[]) { setState({ ...state, products }); },
  reset() { setState({ ...initial }); },
};

export function newProduct(): Product {
  return {
    id: `p-${Date.now().toString(36)}`,
    name: "Nuevo producto",
    manufacturer: "",
    category: "routers",
    images: [],
    imageNote: "",
    description: "",
    workArea: { x: null, y: null, z: null },
    workAreaNote: "",
    dimensions: "",
    powerW: null,
    powerLabel: "",
    specs: [],
    materials: [],
    accessories: [],
    priceUSD: null,
    shippingNote: "Envío, aranceles e ITBIS no incluidos.",
    sources: [],
    lastChecked: null,
    status: "por-verificar",
    model3dUrl: null,
  };
}

/* ---------- formatting helpers ---------- */

export function toDOP(usd: number, rate: number) {
  return Math.round(usd * rate);
}

export function fmtMoney(n: number, cur: "USD" | "DOP") {
  return `${cur} ${new Intl.NumberFormat("es-DO", { maximumFractionDigits: cur === "USD" ? 2 : 0 }).format(n)}`;
}

export function fmtArea(w: Product["workArea"]) {
  if (w.x == null && w.y == null) return "Por verificar";
  const parts = [w.x ?? "?", w.y ?? "?"];
  if (w.z != null) parts.push(w.z);
  return `${parts.join(" × ")} mm`;
}

export function fmtDate(d: string | null) {
  if (!d) return "Sin revisar";
  const date = new Date(d + "T00:00:00");
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" });
}

export function categoryName(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}
